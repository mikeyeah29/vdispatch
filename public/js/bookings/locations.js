!function(YeahAutocomplete, Form, PopUp){

	function ModalPanel(){

		this.updateId = null;

		this.overlay = $('#add_location_modal');
		this.box = $('#add_location_modal .box');

		this.btnAdd = $('#addLocation');
		this.btnEdit = $('#editLocation');

		this.inputLine1 = $('#q_line1');
		this.inputLine2 = $('#q_line2');
		this.inputSuburb = $('#q_suburb');

		var addLocForm = new Form('/api/locations/add', [
			{ id: 'q_line1', validation: '' },
			{ id: 'q_line2', validation: 'none' },
			{ id: 'q_suburb', validation: '' }
		]);

		var editLocForm = new Form('/api/locations/update', [
			{ id: 'q_line1', validation: '' },
			{ id: 'q_line2', validation: 'none' },
			{ id: 'q_suburb', validation: '' }
		]);

		$('.overlay').on('click', function(e){

			var yeha = $(e.target)[0];

			if($(yeha).hasClass('overlay')){
				$(this).hide();
			}

		});

		this.btnAdd.on('click', function(){

			if(addLocForm.isValid()){
				
				var data = {
					line1: $('#' + addLocForm.fields[0].id).val(),
					line2: $('#' + addLocForm.fields[1].id).val(),
					suburbId: $('#' + addLocForm.fields[2].id).data('suburb_id')
				}

				console.log('data', data);

				addLocForm.send(data, function(data){
					if(data.success){
						$('.overlay').hide();
						var msg = new Message('Location Added', false, $('#message_box'));
						msg.display(true);
						$('#' + addLocForm.fields[0].id).val('');
						$('#' + addLocForm.fields[1].id).val('');
						$('#' + addLocForm.fields[2].id).val('');
						location.reload();
					}else{
						console.log(data);
						var msg = new Message(data.responseJSON.error || 'Something went wrong', true, $('#message_box'));
						msg.display();
					}
				});

			}else{
				var msg = new Message(addLocForm.message, true, $('#message_box'));
				msg.display();
			}

		});

		var thisEdBox = this;

		this.btnEdit.on('click', function(){

			if(thisEdBox.updateId){
				if(editLocForm.isValid()){
					
					var data = {
						updateId: thisEdBox.updateId,
						line1: $('#' + editLocForm.fields[0].id).val(),
						line2: $('#' + editLocForm.fields[1].id).val(),
						suburbId: $('#' + editLocForm.fields[2].id).data('suburb_id')
					};

					console.log('Data ', data);

					editLocForm.send(data, function(data){
						if(data.success){
							$('.overlay').hide();
							var msg = new Message('Location Updated', false, $('#message_box'));
							msg.display(true);
							$('#' + editLocForm.fields[0].id).val('');
							$('#' + editLocForm.fields[1].id).val('');
							$('#' + editLocForm.fields[2].id).val('');
							location.reload();
						}else{
							console.log(data);
							var msg = new Message(data.responseJSON.error || 'Something went wrong', true, $('#message_box'));
							msg.display();
						}
					});

				}else{
					var msg = new Message(editLocForm.message, true, $('#message_box'));
					msg.display();
				}
			}else{
				var msg = new Message('No Location ID', true, $('#message_box'));
				msg.display();
			}

		});

	}
	ModalPanel.prototype.open = function(mode, data) {

		if(mode == 'add'){
			this.btnEdit.hide();
			this.btnAdd.show();
			this.inputLine1.val('');
			this.inputLine2.val('');
			this.inputSuburb.val('');
		}

		if(mode == 'edit'){
			this.btnEdit.show();
			this.btnAdd.hide();
			this.updateId = data.updateId;
			this.inputLine1.val(data.line1);
			this.inputLine2.val(data.line2);
			this.inputSuburb.val(data.suburb);
		}

		$('.overlay').show();

	};

	/* Heler functions
	************************************************/

	function refreshLocations(locs){

	}

	function deleteLocation(locId, callback){

		$('table').addClass('tableSpin');

		$.ajax({
			url: '/api/locations/' + locId,
			method: 'DELETE',
			success: function(data){
				console.log(data);
				callback(data);
			},
			error: function(a, b, c){
				console.log(a, b, c);
				callback(false);
			}
		});

	}

	/*************************************************************/

	// modal
	var modalPanel = new ModalPanel();

	// Adding
	$('#addLoc').on('click', function(){
		modalPanel.open('add');
	});

	// editing
	$('table').on('click', '.edit', function(){

		var row = $(this).closest('tr');
		var locId = row.data('locid');

		$('#q_suburb').data('suburb_id', $(this).data('suburbid'));

		modalPanel.open('edit', {
			updateId: locId,
			line1: $($(row).children()[0]).text(),
			line2: $($(row).children()[1]).text(),
			suburb: $($(row).children()[2]).text()
		});

	});

	var suburbAutocomplete = new YeahAutocomplete({
		input: 'q_suburb',
		allowFreeType: true,
		dataUrl: '/api/suburbs',
		method: 'POST',
		property: 'suburb'
	});

	$('#q_suburb').on('resultSelected', function(e, f){
		console.log('suburb ', f);
		$(this).data('suburb_id', f._id);
	});

	var locationAutocomplete = new YeahAutocomplete({
		input: 'q_search',
		allowFreeType: true,
		dataUrl: '/api/locations/search',
		method: 'POST',
		property: 'line1',
		customDisplay: function(results){

			var locTable = $('#loc-table');

			locTable.find("tr:gt(0)").remove();
			$('.paginationLinks').hide();

			for(var i=0; i<results.length; i++){
				var row = '<tr data-locid="' + results[i]._id + '">';
				row += '<td>' + results[i].line1 + '</td>';
				row += '<td>' + results[i].line2 + '</td>';
				row += '<td>' + results[i].suburb.suburb + '</td>';
				row += '<td>' + results[i].suburb.postcode + '</td>';
				row += '<td>';
				row += '<div class="btn edit" data-suburbid="' + results[i].suburb._id + '">';
				row += '</div><div class="delCircle"></div>';
				row += '</td>';
				row += '</tr>';
				locTable.append(row); 
			}

		}
	});

	$('#q_search').on('resultSelected', function(e, f){

	});

	// delete
	$('table').on('click', '.delCircle', function(){

		var row = $(this).closest('tr');
		var locId = row.data('locid');

		var popUp = new PopUp(
			function(){
				deleteLocation(locId, function(data){
					if(data.success){
						var msg = new Message(data.success, false, $('#message_box'));
						msg.display();
						$('table').removeClass('tableSpin');
						location.reload();
					}else{
						var msg = new Message('Something Went Wrong', true, $('#message_box'));
						msg.display();
						$('table').removeClass('tableSpin');
					}
				});
			}, 
			function(){
				popUp.popDown();
			}
		);

		popUp.popUp('Are you sure you want to remove this location?');

	});

}(YeahAutocomplete, form.Form, Popup);