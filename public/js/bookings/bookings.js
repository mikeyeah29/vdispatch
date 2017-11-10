(function(Form, easyAutocomplete, vDisp_autocomplete){

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
			thisBooking.view.pickup.line2.val(data.line2);
			thisBooking.view.pickup.postcode.val(data.postcode);
			thisBooking.view.pickup.suburb.val(data.suburb);
		});
		vDisp_autocomplete('postcode', 'q_pu_postcode');
		vDisp_autocomplete('suburb', 'q_pu_suburb');
		vDisp_autocomplete('location', 'q_do_location', function(){
			var data = $('#q_do_location').getSelectedItemData();
			thisBooking.view.dropoff.line2.val(data.line2);
			thisBooking.view.dropoff.postcode.val(data.postcode);
			thisBooking.view.dropoff.suburb.val(data.suburb);
		});
		vDisp_autocomplete('postcode', 'q_do_postcode');
		vDisp_autocomplete('suburb', 'q_do_suburb');

		var submit_btn = $('#save-btn');

		this.bookingForm = new Form('/api/bookings/create-booking', [
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
			{ id: 'q_pu_line2', validation: ''},
			{ id: 'q_pu_postcode', validation: ''},
			{ id: 'q_pu_suburb', validation: ''},
			{ id: 'q_do_location', validation: ''},
			{ id: 'q_do_line2', validation: ''},
			{ id: 'q_do_postcode', validation: ''},
			{ id: 'q_do_suburb', validation: ''},
			{ id: 'q_rearseats', validation: ''},
			{ id: 'q_forward_seat', validation: ''},
			{ id: 'q_booster', validation: ''},
			{ id: 'q_water', validation: ''},
			{ id: 'q_face_towel', validation: ''},
			{ id: 'q_office_note', validation: 'none'},
			{ id: 'q_customer_note', validation: 'none'},
			{ id: 'q_driver_note', validation: 'none'}
		]);

		submit_btn.on('click', function(){
			var subBtn = this;
			thisBooking.saveBooking(subBtn, $(subBtn).next('.spin'));
		});

	}

	Booking.prototype.saveBooking = function(submit, spin) {

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
	            pu_line1: $('#' + bForm.fields[16].id).val(),
	            pu_line2: $('#' + bForm.fields[17].id).val(),
	            pu_postcode: $('#' + bForm.fields[18].id).val(),
	            pu_suburb: $('#' + bForm.fields[19].id).val(),
	            do_line1: $('#' + bForm.fields[20].id).val(),
	            do_line2: $('#' + bForm.fields[21].id).val(),
	            do_postcode: $('#' + bForm.fields[22].id).val(),
	            do_suburb: $('#' + bForm.fields[23].id).val(),
	            rear_seat: $('#' + bForm.fields[24].id).val(),
	            forward_seat: $('#' + bForm.fields[25].id).val(),
	            booster: $('#' + bForm.fields[26].id).val(),
	            water: $('#' + bForm.fields[27].id).val(),
	            face_towel: $('#' + bForm.fields[28].id).val(),
	            notes_office: $('#' + bForm.fields[29].id).val(),
	            notes_customer: $('#' + bForm.fields[30].id).val(),
	            notes_driver: $('#' + bForm.fields[31].id).val()
			};

			bForm.send(data, function(data){
				
				console.log(data);

				$(submit).show();
				$(spin).hide();

				if(data.success){
					var msg = new Message(
								'Booking Created. <a href="/dispatch">View Dispatch</a>', 
								false, 
								$('#message_box')
							);
					msg.display(true);
				}else{
					var msg = new Message(data.error, true, $('#message_box'));
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