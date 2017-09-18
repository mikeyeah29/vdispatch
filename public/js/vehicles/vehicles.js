!function(){

	$('#table_vehicles').on('change', '.switch input', function(){

		var checkBox = $(this);
		var vehicleId = $(this).data('itemid');
		var spin = $(this).parent().next();

		spin.show();

		var dataObj = {
			vehicleId: vehicleId,
			status: checkBox.is(':checked')
		};

		itemActiveToggle('/vehicles/update-status', spin, dataObj);

	});

	$('#table_types').on('change', '.switch input', function(){

		var checkBox = $(this);
		var vehicleTypeId = $(this).data('itemid');
		var spin = $(this).parent().next();

		spin.show();

		var dataObj = {
			vehicleTypeId: vehicleTypeId,
			status: checkBox.is(':checked')
		};

		itemActiveToggle('/vehicles/types/update-status', spin, dataObj);

	});

}();