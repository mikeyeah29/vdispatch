
!function(Form){

	/* Variables */

	var submit_btn = $('#update-btn');
	var updatePassword = false;
	var passwordLis = $('.change_pw_li');
	var changePasswordCb = $('#change_pw_toggle');

	// password toggle
	changePasswordCb.on('change', function(){

		if($(this).is(':checked')){
			passwordLis.show(200);
		}else{
			passwordLis.hide(200);
		}

	}); 

	var userForm = new Form('/users/update-user', [
		{
			id: 'q_firstname',
			validation: ''
		},
		{
			id: 'q_lastname',
			validation: ''	
		},
		{
			id: 'q_password',
			validation: 'none'	
		},
		{
			id: 'q_password_confirm',
			validation: 'none'	
		},
		{
			id: 'q_email',
			validation: 'email'	
		},
		{
			id: 'q_phone',
			validation: ''	
		},
		{
			id: 'q_address_1',
			validation: ''	
		},
		{
			id: 'q_address_2',
			validation: ''	
		},
		{
			id: 'q_suburb',
			validation: ''	
		},
		{
			id: 'q_postcode',
			validation: ''	
		},
		{
			id: 'q_bankname',
			validation: ''	
		},
		{
			id: 'q_accountnumber',
			validation: ''	
		},
		{
			id: 'q_bsb',
			validation: ''	
		},
		{
			id: 'q_perm_administrator',
			validation: 'none'	
		},
		{
			id: 'q_perm_management',
			validation: 'none'	
		},
		{
			id: 'q_perm_reservations',
			validation: 'none'	
		},
		{
			id: 'q_perm_operations',
			validation: 'none'	
		},
		{
			id: 'q_perm_accounts',
			validation: 'none'	
		},
		{
			id: 'q_perm_reports',
			validation: 'none'	
		},
		{
			id: 'q_useractive',
			validation: 'none'
		}
	]);

	submit_btn.on('click', function(){

		if(changePasswordCb.is(':checked')){
			userForm.fields[2].validation = '';
			userForm.fields[3].validation = 'password';
			updatePassword = true;
		}else{
			userForm.fields[2].validation = 'none';
			userForm.fields[3].validation = 'none';
			updatePassword = false;
		}

		var userId = $(this).data('userid');

		if(userForm.isValid()){
			// send form
			var data = {
				userId: userId,
				q_firstname: $('#' + userForm.fields[0].id).val(),
				q_lastname: $('#' + userForm.fields[1].id).val(),
				q_password: $('#' + userForm.fields[2].id).val(),
				q_password_confirm: $('#' + userForm.fields[3].id).val(),
				q_email: $('#' + userForm.fields[4].id).val(),
				q_phone: $('#' + userForm.fields[5].id).val(),
				q_address_1: $('#' + userForm.fields[6].id).val(),
				q_address_2: $('#' + userForm.fields[7].id).val(),
				q_suburb: $('#' + userForm.fields[8].id).val(),
				q_postcode: $('#' + userForm.fields[9].id).val(),
				q_bankname: $('#' + userForm.fields[10].id).val(),
				q_accountnumber: $('#' + userForm.fields[11].id).val(),
				q_bsb: $('#' + userForm.fields[12].id).val(),
				q_perm_administrator: $('#' + userForm.fields[13].id).is(':checked'),
				q_perm_management: $('#' + userForm.fields[14].id).is(':checked'),
				q_perm_reservations: $('#' + userForm.fields[15].id).is(':checked'),
				q_perm_operations: $('#' + userForm.fields[16].id).is(':checked'),
				q_perm_accounts: $('#' + userForm.fields[17].id).is(':checked'),
				q_perm_reports: $('#' + userForm.fields[18].id).is(':checked'),
				q_useractive: $('#' + userForm.fields[19].id).is(':checked'),
				update_password: updatePassword
			};

			userForm.send(data, function(data){
				console.log(data);
				if(data.success == '1'){
					var msg = new Message(
								'User ' + data.user.first_name + ' ' + data.user.last_name + ' has been Updated. <a href="/users">View Users</a>', 
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
			var msg = new Message(userForm.message, true, $('#message_box'));
			msg.display();
		}

	});

}(form.Form);