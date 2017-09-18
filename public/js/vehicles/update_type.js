!function(Form, ImageLibrary){

	/* Variables */

	console.log('nbjkbjkb');

	var submit_btn = $('#update-btn');

	var vehicleTypeForm = new Form('/vehicles/types/update', [
		{
			id: 'q_name',
			validation: ''
		},
		{
			id: 'q_code',
			validation: ''	
		},
		{
			id: 'q_make',
			validation: ''	
		},
		{
			id: 'q_model',
			validation: ''	
		},
		{
			id: 'q_seats',
			validation: ''	
		},
		{
			id: 'q_suitcases',
			validation: ''	
		},
		{
			id: 'q_carry_on',
			validation: ''	
		},
		{
			id: 'q_image',
			validation: 'none'	
		},
		{
			id: 'q_servicekm',
			validation: ''	
		},
		{
			id: 'q_fuel_type',
			validation: ''	
		},
		{
			id: 'q_status',
			validation: 'none'
		}
	]);

	submit_btn.on('click', function(){

		var vehicleTypeId = $(this).data('vehicletypeid');

		if(vehicleTypeForm.isValid()){
			// send form
			var data = {
				vehicleTypeId: vehicleTypeId,
				name: $('#' + vehicleTypeForm.fields[0].id).val(),
	            code: $('#' + vehicleTypeForm.fields[1].id).val(),
	            type: {
	                make: $('#' + vehicleTypeForm.fields[2].id).val(),
	                model: $('#' + vehicleTypeForm.fields[3].id).val()
	            },
	            features: {
	                seats: $('#' + vehicleTypeForm.fields[4].id).val(),
	                suitcases: $('#' + vehicleTypeForm.fields[5].id).val(),
	                carry_on: $('#' + vehicleTypeForm.fields[6].id).val(),
	                image: $('#' + vehicleTypeForm.fields[7].id).attr('src')
	            },
	            details: {
	                service_km: $('#' + vehicleTypeForm.fields[8].id).val(),
	                fuel_type: $('#' + vehicleTypeForm.fields[9].id).val()
	            },
				status: $('#' + vehicleTypeForm.fields[10].id).is(':checked')
			};

			vehicleTypeForm.send(data, function(data){
				console.log(data);
				if(!data.error){
					var msg = new Message(
								'Vehicle Type ' + data.vehicletype.name + ' has been Updated.', 
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
			var msg = new Message(vehicleTypeForm.message, true, $('#message_box'));
			msg.display();
		}

	});

	var imageLibrary = new ImageLibrary();

	$('#q_image + .uploadBtn').on('click', function(){
		imageLibrary.openLibrary('#q_image .uploadBtn', '#q_image');
	});

	imageLibrary.onSelectImage(function(img){
		$(imageLibrary.imgContainer).attr('src', '/uploads/' + img);
	});

}(form.Form, imageLibrary.ImageLibrary);