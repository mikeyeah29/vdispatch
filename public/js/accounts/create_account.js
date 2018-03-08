
!function(Form, easyAutocomplete){

	/* Variables */

	var submit_btn = $('#save-btn');

	var accountForm = new Form('/accounts/create-account', [
		{
			id: 'q_full_company_name',
			validation: ''
		},
		{
			id: 'q_company_abn',
			validation: ''	
		},
		{
			id: 'q_lookup_name',
			validation: ''	
		},
		{
			id: 'q_parent_account',
			validation: 'none'	
		},
		{
			id: 'q_account_category',
			validation: ''	
		},
		{
			id: 'q_address_1',
			validation: 'none'	
		},
		{
			id: 'q_address_2',
			validation: 'none'	
		},
		{
			id: 'q_suburb',
			validation: 'none'	
		},
		{
			id: 'q_city',
			validation: 'none'	
		},
		{
			id: 'q_postcode',
			validation: 'none'	
		},
		{
			id: 'q_state',
			validation: 'none'	
		},
		{
			id: 'q_primary_phone',
			validation: 'none'	
		},
		{
			id: 'q_primary_email',
			validation: 'none'	
		},
		{
			id: 'q_confirmation_phone',
			validation: 'none'	
		},
		{
			id: 'q_confirmation_email',
			validation: 'none'	
		},
		{
			id: 'q_accounts_phone',
			validation: 'none'
		},
		{
			id: 'q_accounts_email',
			validation: 'none'	
		},
		{
			id: 'q_booking_note',
			validation: 'none'	
		},
		{
			id: 'q_office_note',
			validation: 'none'	
		},
		{
			id: 'q_driver_note',
			validation: 'none'	
		},
		{
			id: 'q_current_ratesheet',
			validation: 'none'	
		},
		{
			id: 'q_cancellation_period',
			validation: 'none'
		},
		{
			id: 'q_after_hours',
			validation: 'none'
		},
		{
			id: 'q_airport_fee',
			validation: 'none'
		},
		{
			id: 'q_invoice_cycle',
			validation: 'none'
		},
		{
			id: 'q_stop_credit',
			validation: 'none'
		},
		{
			id: 'q_status',
			validation: 'none'
		}
	]);

	submit_btn.on('click', function(){

		if(accountForm.isValid()){
			// send form
			var data = {
				q_full_company_name: $('#' + accountForm.fields[0].id).val(),
				q_company_abn: $('#' + accountForm.fields[1].id).val(),
				q_lookup_name: $('#' + accountForm.fields[2].id).val(),	
				q_parent_account: $('#' + accountForm.fields[3].id).val(),
				q_account_category: $('#' + accountForm.fields[4].id).val(),
				q_address_1: $('#' + accountForm.fields[5].id).val(),
				q_address_2: $('#' + accountForm.fields[6].id).val(),
				q_suburb: $('#' + accountForm.fields[7].id).val(),
				q_city: $('#' + accountForm.fields[8].id).val(),
				q_postcode: $('#' + accountForm.fields[9].id).val(),
				q_state: $('#' + accountForm.fields[10].id).val(),
				q_primary_phone: $('#' + accountForm.fields[11].id).val(),
				q_primary_email: $('#' + accountForm.fields[12].id).val(),
				q_confirmation_phone: $('#' + accountForm.fields[13].id).val(),
				q_confirmation_email: $('#' + accountForm.fields[14].id).val(),
				q_accounts_phone: $('#' + accountForm.fields[15].id).val(),
				q_accounts_email: $('#' + accountForm.fields[16].id).val(),
				q_booking_note: $('#' + accountForm.fields[17].id).val(),
				q_office_note: $('#' + accountForm.fields[18].id).val(),
				q_driver_note: $('#' + accountForm.fields[19].id).val(),
				q_current_ratesheet: $('#' + accountForm.fields[20].id).val(),
				q_cancellation_period: $('#' + accountForm.fields[21].id).val(),
				q_after_hours: $('#' + accountForm.fields[22].id).is(':checked'),
				q_airport_fee: $('#' + accountForm.fields[23].id).is(':checked'),
				q_invoice_cycle: $('#' + accountForm.fields[24].id).val(),
				q_stop_credit: $('#' + accountForm.fields[25].id).is(':checked'),
				q_status: $('#' + accountForm.fields[26].id).is(':checked')
			};

			accountForm.send(data, function(data){
				console.log(data);
				if(data.success == '1'){
					var msg = new Message(
								'Account Created. <a href="/accounts">View Accounts</a> or <a href="/accounts/edit/' + data.account._id + '">Edit ' + data.account.name + '</a>', 
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
			var msg = new Message(accountForm.message, true, $('#message_box'));
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

}(form.Form, EasyAutocomplete);