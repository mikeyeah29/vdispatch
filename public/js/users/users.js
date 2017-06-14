
!function(){

	var userActiveToggle = $('.switch input');

	userActiveToggle.on('change', function(){

		var checkBox = $(this);
		var userId = $(this).data('userid');
		var spin = $(this).parent().next();

		spin.show();

		$.ajax({
			url: '/users/update_user_status',
			type: 'POST',
			dataType: 'json',
			data: {
				userId: userId,
				status: checkBox.is(':checked')
			},
			success: function(data){
				
				console.log(data);

				spin.hide();

				if(data.success != '1'){
					var msg = new Message(data.error, true, $('#message_box'));
					msg.display();
				}else{
					var msg = new Message(data.successMsg, false, $('#message_box'));
					msg.display();
				}

			},
			error: function(xhr, desc, err){
				console.log(xhr, desc, err);
			}
		});

	});

}();