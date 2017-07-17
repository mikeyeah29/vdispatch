$(document).ready(function(){

	var error = $('#page-ratesheets').data('error');
	var success = $('#page-ratesheets').data('success');

	if(error != '' && error != 'undefined'){
		var errMsg = new Message(error, true, $('#message_box'));
		errMsg.display(true);
	}

	if(success != '' && success != 'undefined'){
		var errMsg = new Message(success, false, $('#message_box'));
		errMsg.display(true);
	}

	$('#new_rate_sheet').on('change', function(){
		$(this).next().prop("disabled", false);
	});

});
	