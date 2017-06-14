!function(Form){

	/* Variables */

	var submit_btn = $('#loginBtn');

	var loginForm = new Form('/', [
			{
				id: 'email',
				validation: ''
			},
			{
				id: 'password',
				validation: ''
			}
		]);

	submit_btn.on('click', function(){

		if(loginForm.isValid()){
			loginForm.send('', function(data){

				// console.log(data);

				if(!data.error){

					window.location.replace('/dashboard');

				}else{

					var msg = new Message(data.error, true, $('#message_box'));
					msg.display(true);

				}

			});
		
		}else{

			var msg = new Message(loginForm.message, true, $('#message_box'));
			msg.display();

		}

	});

}(form.Form);