
!function(Form){

	/* Variables */

	var submit_btn = $('#save-btn');

	var vehicleForm = new Form('/vehicles/create-vehicle', [
		{
			id: 'q_year',
			validation: ''
		},
		{
			id: 'q_color',
			validation: ''
		},
		{
			id: 'q_type',
			validation: ''	
		},
		{
			id: 'q_vin',
			validation: ''	
		},
		{
			id: 'q_rego',
			validation: ''	
		},
		{
			id: 'q_rego_expiry',
			validation: ''	
		},
		{
			id: 'q_coi_expiry',
			validation: ''	
		},
		{
			id: 'q_dotbooking',
			validation: 'none'	
		},
		{
			id: 'q_odometer',
			validation: ''	
		},
		{
			id: 'q_status',
			validation: 'none'
		},
		{
			id: 'q_number',
			validation: ''
		}
	]);

	$('.datepicker').datepicker({
	    format: 'dd/mm/yyyy'
	});

	submit_btn.on('click', function(){

		if(vehicleForm.isValid()){
			// send form
			var data = {
				year: $('#' + vehicleForm.fields[0].id).val(),
			    color: $('#' + vehicleForm.fields[1].id).val(),
			    type: $('#' + vehicleForm.fields[2].id).val(),
			    vin: $('#' + vehicleForm.fields[3].id).val(),
			    rego: $('#' + vehicleForm.fields[4].id).val(),
			    rego_expiry: $('#' + vehicleForm.fields[5].id).val(),
			    coi_expiry: $('#' + vehicleForm.fields[6].id).val(),
			    dot_booking: $('#' + vehicleForm.fields[7].id).val(),
			    odometer: $('#' + vehicleForm.fields[8].id).val(),
		        status: $('#' + vehicleForm.fields[9].id).is(':checked'),
		        vehicle_number: $('#' + vehicleForm.fields[10].id).val()
			};

			vehicleForm.send(data, function(data){
				console.log(data);
				if(!data.error){
					var msg = new Message(
								'Vehicle Created. <a href="/vehicles">View Vehicles & Types</a> or <a href="/vehicles/edit/' + data.vehicle._id + '">Edit this vehicle</a>', 
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
			var msg = new Message(vehicleForm.message, true, $('#message_box'));
			msg.display();
		}

	});

}(form.Form);