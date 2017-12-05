!function(Accordian, Form, easyAutocomplete, vDisp_autocomplete, Popup){

	function Model(obj){
		
	}
	Model.prototype.getAccounts = function(exclude, callback) {

		$.ajax({
			url: '/api/accounts',
			method: 'POST',
			data: {
				account_category: 'Crewing',
				exclude: exclude
			},
			success: function(data){
				callback(data);
			},
			error: function(a, b, c){
				console.log(a, b, c);
			}
		});

	};
	Model.prototype.getVehicles = function(callback) {

		$.ajax({
			url: '/api/vehicletypes',
			method: 'POST',
			success: function(data){
				// console.log(data);
				callback(data);
			},
			error: function(a, b, c){
				console.log(a, b, c);
			}
		});

	};
	Model.prototype.updateHotel = function(id, hotel, callback) {

		$.ajax({
			url: '/api/crewing/update-hotel',
			method: 'POST',
			data: {
				crewing_id: id,
				hotel: hotel
			},
			success: function(data) {
				callback(data);
			},
			error: function(a, b, c){
				callback({error: a.responseJSON.error});
			}
		});
	
	};
	Model.prototype.removePrice = function(crewingDefId, prices, callback) {

		var pri;

		if(prices.length == 0){
			pri = 'empty';
		}else{
			pri = prices;
		}

		$.ajax({
			url: '/api/crewing/update-prices',
			method: 'POST',
			data: {
				crewing_id: crewingDefId,
				prices: pri
			},
			success: function(data) {
				console.log('data ', data);
				callback(data);
			},
			error: function(a, b, c){
				console.log(a, b, c);
			}
		});

	};
	Model.prototype.updateNotes = function(crewingDefId, notes, callback){

		$.ajax({
			url: '/api/crewing/update-notes',
			method: 'POST',
			data: {
				crewing_id: crewingDefId,
				note: notes
			},
			success: function(data) {
				callback(data);
			},
			error: function(a, b, c){
				console.log({error: a.removeJSON.error});
			}
		});

	};

	function View(addCrewingObj){
		this.addCrewing = addCrewingObj;
	}
	View.prototype.refreshCrewing = function(crewing) {

		location.reload(true);
		
		// $('#theAccordian').empty();

		// for(var i=0; i<crewing.length; i++){

		// 	var str = '';
		// 	str += '<div class="a_title" data-crewing_id="' + crewing[i]._id + '" data-account_id="' + crewing[i].account + '">';
		// 	str += crewing[i].name;
		// 	str += '</div>';

		// 	str += '<div class="a_content" data-crewing_id="' + crewing[i]._id + '">';
		// 	str += '<ul class="nav nav-tabs">';
		// 		str += '<li class="nav-item">';
		// 			str += '<div class="nav-link active">Hotels</div>';
		// 		str += '</li>';
		// 		str += '<li class="nav-item">';
		// 			str += '<div class="nav-link">Pricing</div>';
		// 		str += '</li>';
		// 		str += '<li class="nav-item">';
		// 			str += '<div class="nav-link">Notes</div>';
		// 		str += '</li>';
		// 	str += '</ul>';

		// 	str += '<div class="crew_box crew_hotels">';
		// 		str += '<label>Current Hotel</label>';
		// 		if(crewing[i].hotel){
		// 			str += '<p class="green">' + crewing[i].hotel.location + '</p>';
		// 			str += '<label class="break">Change Hotel</label>';
		// 			str += '<input placeholder="Hotel..." class="input_hotel">';
		// 			str += '<div class="btn btn-update">Update</div>';
		// 		}else{
		// 			str += '<p>No hotel Set</p>';
		// 			str += '<input placeholder="Hotel..." class="input_hotel">';
		// 			str += '<div class="btn btn-update">Set Hotel</div>';
		// 		}
		// 	str += '</div>';
		// 	str += '<div class="crew_box crew_pricing">';
		// 		str += '<table>';
		// 			str += '<tr>';
		// 				str += '<th>Vehicle</th>';
		// 				str += '<th>Max Crew</th>';
		// 				str += '<th>Price</th>';
		// 				str += '<th></th>';
		// 			str += '</tr>';

		// 			for(var j = 0; j<crewing[i].pricing.length; j++){
		// 				str += '<tr>';
		// 					str += '<th>' + crewing[i].pricing[j].vehicle + '</th>';
		// 					str += '<th>' + crewing[i].pricing[j].max_crew + '</th>';
		// 					str += '<th>' + crewing[i].pricing[j].price + '</th>';
		// 					str += '<th><span class="btn edit"></span><span class="delete"></span></th>';
		// 				str += '</tr>';
		// 			}

		// 		str += '</table>';
		// 		str += '<div class="btn add">Add Price</div>';
		// 	str += '</div>';
		// 	str += '<div class="crew_box crew_notes">';
		// 		str += '<textarea class="break">' + crewing[i].default_note + '</textarea>';
		// 		str += '<div class="btn btn-update">Update Note</div>';
		// 	str += '</div>';

		// 	str += '</div>';

		// 	$('#theAccordian').append(str);

		// }

	};
	View.prototype.fillCustomerSelect = function(accounts) {
		$(this.addCrewing.inpCustomer).empty();
		$(this.addCrewing.inpCustomer).append('<option value="">- select customer -</option>');
		for(var i=0; i<accounts.length; i++){
			this.addCrewing.inpCustomer.append('<option value="' + accounts[i]._id + '">' + accounts[i].name + '</option>');
		}
	};	
	View.prototype.fillVehiclesSelect = function(vehicles, edit = false) {

		var vSelect = $('#vehicle_select');
		if(edit){
			vSelect = $('#vehicle_edit_select');
		}

		vSelect.empty();
		vSelect.append('<option value="">- select vehicle -</option>');
		for(var i=0; i<vehicles.length; i++){
			vSelect.append('<option value="' + vehicles[i]._id + '">' + vehicles[i].name + '</option>');
		}
	};

	function Crewing(Model, View){

		var tCrew = this;

		this.model = new Model({});
		this.view = new View({
				box: $('#add_crewing_box'),
				inbox: $('#add_crewing_box .modal-dialog'),
				inpCustomer: $('#crewing_customers'),
				inpName: $('#q_name'),
				submit: $('#addCrewingSubmit'),
				spin: $('#add_crewing_box .overlay_spin')
			});

		/*** Adding Crewing Defaults ***/

		this.setUpAddCrewing();

		/*** Editing Crewing Defaults ***/

		this.accordian = new Accordian($('#theAccordian'));
		this.setUpTabSwitching();

		this.setUphotels();

		this.addPrices();
		this.pricesActions();

		this.setUpNotes();

	}
	Crewing.prototype.setUpAddCrewing = function(){

		var addCrewingForm = new Form('/api/crewing/create', [
				{
					id: 'crewing_customers',
					validation: ''
				},
				{
					id: 'q_name',
					validation: ''
				}
			]);

		var tCrew = this;

		$('#addNewCrewing').on('click', function(){
			tCrew.view.addCrewing.box.show();
			tCrew.view.addCrewing.spin.show();

			var exclude = [];

			$('.a_title').each(function(){
				exclude.push($(this).data('account_id'));
			});

			tCrew.model.getAccounts(exclude, function(data){

				if(data.accounts){

					tCrew.view.fillCustomerSelect(data.accounts);
					tCrew.view.addCrewing.spin.hide();

				}else{
					var msg = new Message(data.error || 'Something has gone wrong', true, $('#message_box'));
					msg.display();
				}

			});
		});

		$('.overlay-fixed').on('click', function(e){
			if($(e.target).hasClass('overlay-fixed')){
				$(this).hide();
			}
		});

		$('#submitCrewingNew').on('click', function(){
			if(addCrewingForm.isValid()){

				tCrew.view.addCrewing.spin.show();

				var data = {
					account: $('#' + addCrewingForm.fields[0].id).val(),
					name: $('#' + addCrewingForm.fields[1].id).val()
				};

				addCrewingForm.send(data, function(data){
					if(data.success){

						tCrew.view.refreshCrewing(data.crewing);
						tCrew.accordian = new Accordian($('#theAccordian'));

						$('.overlay-fixed').hide();
						var msg = new Message('Crewing Added', false, $('#message_box'));
						msg.display(true);
					}else{
						tCrew.view.addCrewing.spin.hide();
						var msg = new Message(data.error, true, $('#message_box'));
						msg.display();
					}
				});

			}else{

				var msg = new Message(addCrewingForm.message, true, $('#message_box'));
				msg.display();

			}
		});

	};

	Crewing.prototype.setUpTabSwitching = function(){

		$('#theAccordian').on('click', '.nav-link', function(){

			var thisCrewing = $(this).closest('.accordian_li');

			$(thisCrewing).find('.nav-link').removeClass('active');
			$(thisCrewing).find('.crew_box').hide();

			$(this).addClass('active');
			$(thisCrewing).find('.crew_' + $(this).text().toLowerCase()).show();		

		});

	};

	Crewing.prototype.setUphotels = function(){

		var tCrew = this;
		var hotel;

		$('.input_hotel').each(function(){

			// '.input_hotel'

			vDisp_autocomplete('location', $(this), function(hmm){
				var data = $(hmm).getSelectedItemData();
				hotel = data._id;
			});

		});

		$('#theAccordian').on('click', '.crew_hotels .btn-update', function(){

			// console.log('index ', $(this).closest('.a_content').index());
			var crewingDefId = $(this).closest('.a_content').data('crewing_id');

			var input = $(this).prev().find('.input_hotel');
			input.removeClass('invalid');

			if(input.val() != ''){
				// update
				tCrew.model.updateHotel(crewingDefId, hotel, function(data){
					if(data.crewing){
						tCrew.view.refreshCrewing(data.crewing);
						tCrew.accordian = new Accordian($('#theAccordian'));
						// tCrew.accordian.openByIndex(($(this).closest('.a_content').index() + 1) / 2);
						var msg = new Message('Hotel Updated', false, $('#message_box'));
						msg.display();
					}else{
						var msg = new Message('Location Does Not Exist', true, $('#message_box'));
						msg.display();
					}
				});
			}else{
				input.addClass('invalid');
				var msg = new Message('Hotel Required', true, $('#message_box'));
				msg.display();
			}

		});

	};

	Crewing.prototype.addPrices = function(){

		var tCrew = this;
		var spin = $('#add_price_box .overlay_spin');

		var addPriceForm = new Form('/api/crewing/update-prices', [
				{
					id: 'vehicle_select',
					validation: ''
				},
				{
					id: 'q_max_crew',
					validation: ''
				},
				{
					id: 'q_price',
					validation: ''
				}
			]);

		$('#theAccordian').on('click', '.add_price', function(){

			tCrew.openPriceBox(spin, this);

		});

		$('#submitPriceNew').on('click', function(){

			var crewingDefId = $('#add_price_box').data('crewing_id');
			var prices = $('#add_price_box').data('prices');
			prices.push({
				vehicle: $('#' + addPriceForm.fields[0].id).val(),
	            max_crew: $('#' + addPriceForm.fields[1].id).val(),
	            price: $('#' + addPriceForm.fields[2].id).val()
			});

			if(addPriceForm.isValid()){

				spin.show();

				var data = {
					crewing_id: crewingDefId,
					prices: prices
				};

				addPriceForm.send(data, function(data){
					if(data.success){

						tCrew.view.refreshCrewing(data.crewing);
						tCrew.accordian = new Accordian($('#theAccordian'));

						$('.overlay-fixed').hide();
						var msg = new Message('Prices Updated', false, $('#message_box'));
						msg.display(true);

					}else{
						spin.hide();
						var msg = new Message(data.error || data.responseJSON.error, true, $('#message_box'));
						msg.display();
					}
				});

			}else{

				var msg = new Message(addPriceForm.message, true, $('#message_box'));
				msg.display();

			}

		});

	};

	Crewing.prototype.openPriceBox = function(spin, thing) {

		var tCrew = this;

		var crewingDefId = $(thing).closest('.a_content').data('crewing_id');
		var prices = this.getCurrentPrices($(thing).prev('table'));

		$('#add_price_box').data('crewing_id', crewingDefId);
		$('#add_price_box').data('prices', prices);

		$('#add_price_box').show();
		spin.show();

		this.model.getVehicles(function(data){

			if(data){

				tCrew.view.fillVehiclesSelect(data.vehicles);
				spin.hide();

			}else{
				var msg = new Message(data.error || 'Something has gone wrong', true, $('#message_box'));
				msg.display();
			}

		});

		// load extra info... if edit
		// $('#q_max_crew').val(maxcrew);
		// $('#q_price').val(price);

	}

	Crewing.prototype.openEditPriceBox = function(spin, thing, maxcrew = '', price = '', row) {

		var tCrew = this;

		var crewingDefId = $(thing).closest('.a_content').data('crewing_id');
		var prices = this.getCurrentPrices($(thing).closest('table'));

		$('#edit_price_box').data('crewing_id', crewingDefId);
		$('#edit_price_box').data('prices', prices);
		$('#edit_price_box').data('row', row);

		$('#edit_price_box').show();
		spin.show();

		this.model.getVehicles(function(data){

			if(data){

				tCrew.view.fillVehiclesSelect(data.vehicles, true);
				spin.hide();

			}else{
				var msg = new Message(data.error || 'Something has gone wrong', true, $('#message_box'));
				msg.display();
			}

		});

		// load extra info... if edit
		$('#q_edit_max_crew').val(maxcrew);
		$('#q_edit_price').val(price);

	};

	Crewing.prototype.getCurrentPrices = function(table, index = null) { 

		var arr = [];

		var rows = table.find('tr');

		rows.each(function(row){
			if(row > 0){
				if(row != index){
					arr.push({
						vehicle: $($(this).children()[0]).data('vehicle'),
			            max_crew: $($(this).children()[1]).text(),
			            price: $($(this).children()[2]).text()
					});
				}
			}
		});

		return arr;

	};

	Crewing.prototype.pricesActions = function(){

		var tCrew = this;
		var spin = $('#add_price_box .overlay_spin');

		var editPriceForm = new Form('/api/crewing/update-prices', [
				{
					id: 'vehicle_edit_select',
					validation: ''
				},
				{
					id: 'q_edit_max_crew',
					validation: ''
				},
				{
					id: 'q_edit_price',
					validation: ''
				}
			]);

		$('#theAccordian').on('click', '.edit', function(){

			var thisCrewing = $(this).closest('.accordian_li');
			var row = $(this).parent().parent().children();
			var rowIndex = $(this).parent().parent().index();

			var maxcrew = $(row[1]).text();
			var price = $(row[2]).text();

			tCrew.openEditPriceBox(spin, this, maxcrew, price, rowIndex);

		});

		$('#theAccordian').on('click', '.delete', function(){

			var thisDel = this;

			// console.log('CrewId ', crewId);
			// console.log('Prices ', prices);

			var areYouSure = new Popup(function(){

				var thisCrewing = $(thisDel).closest('.accordian_li');
				var crewId = $(thisDel).closest('.a_content').data('crewing_id');
				var prices = tCrew.getCurrentPrices($(thisDel).closest('table'), $(thisDel).parent().parent().index());

				tCrew.model.removePrice(crewId, prices, function(data){
					if(data.crewing){
						tCrew.view.refreshCrewing(data.crewing);
						tCrew.accordian = new Accordian($('#theAccordian'));
						// tCrew.accordian.openByIndex(($(this).closest('.a_content').index() + 1) / 2);
						var msg = new Message('Price Removed', false, $('#message_box'));
						msg.display();
					}else{
						var msg = new Message('Something has gone wrong', true, $('#message_box'));
						msg.display();
					}
					areYouSure.popDown();
				});
			},
			function(){
				this.popDown();
			});

			areYouSure.popUp('Are you sure you want to remove this price?');

		});

		$('#submitPriceEdit').on('click', function(){

			var crewingDefId = $('#edit_price_box').data('crewing_id');
			var prices = $('#edit_price_box').data('prices');

			var row = $('#edit_price_box').data('row');

			$(prices).each(function(index){
				if(index == row - 1){
					prices[index] = {
						vehicle: $('#' + editPriceForm.fields[0].id).val(),
        				max_crew: $('#' + editPriceForm.fields[1].id).val(),
	           			price: $('#' + editPriceForm.fields[2].id).val()
					};	
				}
			});

			if(editPriceForm.isValid()){

				spin.show();

				var data = {
					crewing_id: crewingDefId,
					prices: prices
				};

				editPriceForm.send(data, function(data){
					if(data.success){

						tCrew.view.refreshCrewing(data.crewing);
						tCrew.accordian = new Accordian($('#theAccordian'));

						$('.overlay-fixed').hide();
						var msg = new Message('Prices Updated', false, $('#message_box'));
						msg.display(true);

					}else{
						spin.hide();
						var msg = new Message(data.error, true, $('#message_box'));
						msg.display();
					}
				});

			}else{

				var msg = new Message(editPriceForm.message, true, $('#message_box'));
				msg.display();

			}

		});

	};

	Crewing.prototype.setUpNotes = function() {
		var tCrew = this;
		$('.updateNotes').on('click', function(){
			var notes = $(this).prev('textarea').val();
			if(notes != ''){
				// update
				var crewingDefId = $(this).closest('.a_content').data('crewing_id');
				tCrew.model.updateNotes(crewingDefId, notes, function(data){
					if(data.crewing){
						tCrew.view.refreshCrewing(data.crewing);
						tCrew.accordian = new Accordian($('#theAccordian'));
						// tCrew.accordian.openByIndex(($(this).closest('.a_content').index() + 1) / 2);
						var msg = new Message('Notes Updated', false, $('#message_box'));
						msg.display();
					}else{
						var msg = new Message(data.error || 'Something went wrong', true, $('#message_box'));
						msg.display();
					}
				});
			}else{
				input.addClass('invalid');
				var msg = new Message('Notes Required', true, $('#message_box'));
				msg.display();
			}
		});
	};

	crewing = new Crewing(Model, View);

}(accordian.Accordian, form.Form, EasyAutocomplete, vDisp_autocomplete, Popup);