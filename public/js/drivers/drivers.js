!function(){

	$('.table').on('change', '.switch input', function(){

		var checkBox = $(this);
		var driverId = $(this).data('itemid');
		var spin = $(this).parent().next();

		spin.show();

		var dataObj = {
			driverId: driverId,
			status: checkBox.is(':checked')
		};

		itemActiveToggle('/drivers/update_driver_status', spin, dataObj);

	});

}();