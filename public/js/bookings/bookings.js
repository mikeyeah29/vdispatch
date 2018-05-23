(function(Form, easyAutocomplete, vDisp_autocomplete){

	$('.datepicker').datepicker({
	    format: 'dd/mm/yyyy'
	});

	function Model(obj){
		
	}

	function View(){
		this.pickup = {
			line2: $('#q_pu_line2'),
			postcode: $('#q_pu_postcode'),
			suburb: $('#q_pu_suburb')
		};
		this.dropoff = {
			line2: $('#q_do_line2'),
			postcode: $('#q_do_postcode'),
			suburb: $('#q_do_suburb')
		};
	}

	function Booking(Model, View){

		this.view = new View();
		this.model = new Model({});

		var thisBooking = this;

		/*** events ***/

		vDisp_autocomplete('location', 'q_pu_location', function(){
			var data = $('#q_pu_location').getSelectedItemData();
			$('#q_pu_location').data('locationid', data._id);
		});
		vDisp_autocomplete('location', 'q_do_location', function(){
			var data = $('#q_do_location').getSelectedItemData();
			$('#q_do_location').data('locationid', data._id);
		});

		var submit_btn = $('#save-btn');
		var update_btn = $('#update-btn');

		var bookingFormData = [
			{ id: 'q_customer', validation: '' },
			{ id: 'q_subcustomer', validation: 'none' },
			{ id: 'q_ref1', validation: 'none'},
			{ id: 'q_ref2', validation: 'none' },
			{ id: 'q_ref3', validation: 'none' },
			{ id: 'q_flight', validation: 'none' },
			{ id: 'q_date', validation: 'none' },
			{ id: 'q_time', validation: '' },
			{ id: 'q_name', validation: '' },
			{ id: 'q_adults', validation: 'none' },
			{ id: 'q_children', validation: 'none'},
			{ id: 'q_infants', validation: 'none'},
			{ id: 'q_email', validation: 'email'},
			{ id: 'q_phone', validation: ''},
			{ id: 'q_vehicle_type', validation: ''},
			{ id: 'q_transfertype', validation: ''},
			{ id: 'q_pu_location', validation: ''},
			{ id: 'q_do_location', validation: ''},
			{ id: 'q_rearseats', validation: ''},
			{ id: 'q_forward_seat', validation: ''},
			{ id: 'q_booster', validation: ''},
			{ id: 'q_water', validation: ''},
			{ id: 'q_face_towel', validation: ''},
			{ id: 'q_office_note', validation: 'none'},
			{ id: 'q_customer_note', validation: 'none'},
			{ id: 'q_driver_note', validation: 'none'}
		];

		this.bookingForm = new Form('/api/bookings/create-booking', bookingFormData);
		this.updateForm = new Form('/api/bookings/update-booking', bookingFormData);

		submit_btn.on('click', function(){
			var subBtn = this;
			thisBooking.saveBooking(subBtn, this.bookingForm, $(subBtn).next('.spin'));
		});

		update_btn.on('click', function(){
			var subBtn = this;
			thisBooking.saveBooking(subBtn, this.updateForm, $(subBtn).next('.spin'));
		});

	}

	Booking.prototype.saveBooking = function(submit, bForm, spin) {

		console.log(submit, spin);

		var bForm = this.bookingForm;

		if(bForm.isValid()){

			// spin
			$(submit).hide();
			$(spin).show();

			// send form
			var data = {
				customer: $('#' + bForm.fields[0].id).val(),
		        sub_customer: $('#' + bForm.fields[1].id).val(),
		        ref1: $('#' + bForm.fields[2].id).val(),
		        ref2: $('#' + bForm.fields[3].id).val(),
		        ref3: $('#' + bForm.fields[4].id).val(),
		        flight: $('#' + bForm.fields[5].id).val(),
		        date: $('#' + bForm.fields[6].id).val(),
		        time: $('#' + bForm.fields[7].id).val(),
	            name: $('#' + bForm.fields[8].id).val(),
	            adults: $('#' + bForm.fields[9].id).val(),
	            children: $('#' + bForm.fields[10].id).val(),
	            infants: $('#' + bForm.fields[11].id).val(),
	            email: $('#' + bForm.fields[12].id).val(),
	            phone: $('#' + bForm.fields[13].id).val(),
		        vehicletype_id: $('#' + bForm.fields[14].id).val(),
				transfer_type: $('#' + bForm.fields[15].id).val(),		 
	            pu_line1: $('#' + bForm.fields[16].id).data('locationid'),
	            do_line1: $('#' + bForm.fields[17].id).data('locationid'),
	            rear_seat: $('#' + bForm.fields[18].id).val(),
	            forward_seat: $('#' + bForm.fields[19].id).val(),
	            booster: $('#' + bForm.fields[20].id).val(),
	            water: $('#' + bForm.fields[21].id).val(),
	            face_towel: $('#' + bForm.fields[22].id).val(),
	            notes_office: $('#' + bForm.fields[23].id).val(),
	            notes_customer: $('#' + bForm.fields[24].id).val(),
	            notes_driver: $('#' + bForm.fields[25].id).val()
			};

			if($(submit).data('bookingid')){
				data.bookingid = $(submit).data('bookingid');
			}

			bForm.send(data, function(data){

				$(submit).show();
				$(spin).hide();

				if(data.success){
					var msg = new Message(
								data.success + ' <a href="/dispatch">View Dispatch</a>', 
								false, 
								$('#message_box')
							);
					msg.display(true);
				}else{
					console.log('ERRPR: ', data.responseJSON);
					var msg = new Message(data.responseJSON.error || 'Something went wrong', true, $('#message_box'));
					msg.display();
				}

			});

		}else{
			// error message
			var msg = new Message(bForm.message, true, $('#message_box'));
			msg.display();
		}

	};

	Booking.prototype.updateModelFromView = function() {
		
	};

	var booking = new Booking(Model, View);

}(form.Form, EasyAutocomplete, vDisp_autocomplete));