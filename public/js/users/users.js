!function(){

	var userActiveToggle = $('.switch input');

	userActiveToggle.on('change', function(){

		var checkBox = $(this);
		var userId = $(this).data('userid');
		var spin = $(this).parent().next();

		spin.show();

		var dataObj = {
			userId: userId,
			status: checkBox.is(':checked')
		};

		itemActiveToggle('/users/update_user_status', spin, dataObj);

	});

	// function searchAndLoad() {
	// 	$('#search_input').on('change', function(){
	// 		$.ajax({
	// 			url: '/',
	// 			method: 'GET',
	// 			success: function(data) {

	// 			},
	// 			error: function(a, b, c) {

	// 			}
	// 		});
	// 	});
	// }

}();