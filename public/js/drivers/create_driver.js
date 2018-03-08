
!function(Form, easyAutocomplete, ImageLibrary){

	/* Variables */

	var submit_btn = $('#save-btn');

	$('.datepicker').datepicker({
	    format: 'dd/mm/yyyy'
	});

	var driverForm = new Form('/drivers/create-driver', [
		{
			id: 'q_first_name',
			validation: ''
		},
		{
			id: 'q_last_name',
			validation: ''	
		},
		{
			id: 'q_dob',
			validation: ''	
		},
		{
			id: 'q_address_line1',
			validation: ''	
		},
		{
			id: 'q_address_line2',
			validation: ''	
		},
		{
			id: 'q_suburb',
			validation: ''	
		},
		{
			id: 'q_city',
			validation: ''	
		},
		{
			id: 'q_postcode',
			validation: ''	
		},
		{
			id: 'q_state',
			validation: ''	
		},
		{
			id: 'q_email',
			validation: 'email'	
		},
		{
			id: 'q_phone',
			validation: 'phone'	
		},
		{
			id: 'q_driver_code',
			validation: ''	
		},
		{
			id: 'q_password',
			validation: ''	
		},
		{
			id: 'q_passwordconfirm',
			validation: 'password'	
		},
		{
			id: 'q_da_number',
			validation: ''	
		},
		{
			id: 'q_da_expiry',
			validation: ''
		},
		{
			id: 'q_da_scan',
			validation: 'none'	
		},
		{
			id: 'q_dl_number',
			validation: ''	
		},
		{
			id: 'q_dl_expiry',
			validation: ''	
		},
		{
			id: 'q_dl_scan',
			validation: 'none'	
		},
		{
			id: 'q_abn',
			validation: ''	
		},
		{
			id: 'q_account',
			validation: ''
		},
		{
			id: 'q_bsb',
			validation: ''
		},
		{
			id: 'q_drivertype',
			validation: ''
		},
		{
			id: 'q_color',
			validation: 'color'
		},
		{
			id: 'q_status',
			validation: 'none'
		}
	]);

	submit_btn.on('click', function(){

		// console.log('dob ', $('#' + driverForm.fields[2].id).val());

		if(driverForm.isValid()){
			// send form
			var data = {
				q_first_name: $('#' + driverForm.fields[0].id).val(),
				q_last_name: $('#' + driverForm.fields[1].id).val(),
				q_dob: $('#' + driverForm.fields[2].id).val(),	
				q_address_line1: $('#' + driverForm.fields[3].id).val(),
				q_address_line2: $('#' + driverForm.fields[4].id).val(),
				q_suburb: $('#' + driverForm.fields[5].id).val(),
				q_city: $('#' + driverForm.fields[6].id).val(),
				q_postcode: $('#' + driverForm.fields[7].id).val(),
				q_state: $('#' + driverForm.fields[8].id).val(),
				q_email: $('#' + driverForm.fields[9].id).val(),
				q_phone: $('#' + driverForm.fields[10].id).val(),
				q_driver_code: $('#' + driverForm.fields[11].id).val(),
				q_password: $('#' + driverForm.fields[12].id).val(),
				q_passwordconfirm: $('#' + driverForm.fields[13].id).val(),
				q_da_number: $('#' + driverForm.fields[14].id).val(),
				q_da_expiry: $('#' + driverForm.fields[15].id).val(),
				q_da_scan: $('#' + driverForm.fields[16].id).attr('src'),
				q_dl_number: $('#' + driverForm.fields[17].id).val(),
				q_dl_expiry: $('#' + driverForm.fields[18].id).val(),
				q_dl_scan: $('#' + driverForm.fields[19].id).attr('src'),
				q_abn: $('#' + driverForm.fields[20].id).val(),
				q_account: $('#' + driverForm.fields[21].id).val(),
				q_bsb: $('#' + driverForm.fields[22].id).val(),
				q_drivertype: $('#' + driverForm.fields[23].id).val(),
				q_color: $('#' + driverForm.fields[24].id).val(),
				q_status: $('#' + driverForm.fields[25].id).is(':checked')
			};

			driverForm.send(data, function(data){
				console.log(data);
				if(data.success == '1'){
					var msg = new Message(
								'Driver Created. <a href="/drivers">View Drivers</a> or <a href="/drivers/edit/' + data.driver._id + '">Edit ' + data.driver.first_name + ' ' + data.driver.last_name + '</a>', 
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
			var msg = new Message(driverForm.message, true, $('#message_box'));
			msg.display();
		}

	});

	var options = {
	  url: function(phrase) {
	    return "/api/suburbs";
	  },
	  getValue: function(element) {
	    return element.suburb;
	  },
	  ajaxSettings: {
	    dataType: "json",
	    method: "POST",
	    data: {
	      dataType: "json"
	    }
	  },
	  preparePostData: function(data) {
	    data.phrase = $("#q_suburb").val();
	    return data;
	  },
	  requestDelay: 400
	};

	$("#q_suburb").easyAutocomplete(options);

	var pcoptions = {
	  url: function(phrase) {
	    return "/api/postcodes";
	  },
	  getValue: function(element) {
	    return element;
	  },
	  ajaxSettings: {
	    dataType: "json",
	    method: "POST",
	    data: {
	      dataType: "json"
	    }
	  },
	  preparePostData: function(data) {
	    data.phrase = $("#q_postcode").val();
	    return data;
	  },
	  requestDelay: 400
	};

	$("#q_postcode").easyAutocomplete(pcoptions);

	// color

	$('#q_color').on('input', function(){
		$(this).next().css('background', $(this).val());
	});

	// scan upload

	var imageLibrary = new ImageLibrary();

	$('#da_scan .uploadBtn').on('click', function(){
		imageLibrary.openLibrary('#da_scan .uploadBtn', '#da_scan img');
	});

	$('#dl_scan .uploadBtn').on('click', function(){
		imageLibrary.openLibrary('#dl_scan .uploadBtn', '#dl_scan img');
	});

	imageLibrary.onSelectImage(function(img){
		$(imageLibrary.imgContainer).attr('src', '/uploads/' + img);
	});

}(form.Form, EasyAutocomplete, imageLibrary.ImageLibrary);