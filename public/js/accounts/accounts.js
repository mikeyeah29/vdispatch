!function(){

	/* Vars */

	var accountsTable = new ItemsTable(
		$('table'),
		['lookup', 'contact_details[0].primary_phone', 'primary_email', 'parent_account', 'current_ratesheet', ['edit', 'switch']]
	);
	var activeToggle = $('.switch input');
	var catSelect = $('#q_categories');
	var rateSelect = $('#q_rates');

	$('.table').on('change', '.switch input', function(){

		var checkBox = $(this);
		var accountId = $(this).data('itemid');
		var spin = $(this).parent().next();

		spin.show();

		var dataObj = {
			accountId: accountId,
			status: checkBox.is(':checked')
		};

		itemActiveToggle('/accounts/update_account_status', spin, dataObj);

	});

	function filterAndLoad(data, overlaySpin){

		accountsTable.filterTable('/accounts/filter-accounts', data, function(data){

			//accountsTable.table.find("tr:gt(0)").remove();
			var tblString = '';

			for(i=0; i<data.accounts.length; i++){
				
				var account = data.accounts[i];

				tblString += '<tr>';

				tblString += '<td>';
				tblString += account.lookup;
				tblString += '</td>';	

				tblString += '<td>';
				tblString += account.contact_details[0].primary_phone;
				tblString += '</td>';	

				tblString += '<td>';
				tblString += account.contact_details[0].primary_email;
				tblString += '</td>';				

				tblString += '<td>';
				tblString += account.parent_account;
				tblString += '</td>';	

				tblString += '<td>';
				tblString += account.pricing[0].current_ratesheet;
				tblString += '</td>';	

				tblString += '<td class="actions">';
				tblString += '<a class="btn btn-warning edit" href="/accounts/edit/' + account._id + '"></a>';
				tblString += '<label class="switch"><input type="checkbox" data-itemId="' + account._id + '" checked=""><div class="slider"></div></label>';
				tblString += '<div class="spin"></div>';
				tblString += '</td>';

				tblString += '</tr>';

			}

			accountsTable.table.append(tblString);

			overlaySpin.fadeOut(200);

		});

	}

	/* Category Filter */

	$('.actions_bar').on('change', '#q_categories', function(){

		var cat = $(this).val();
		var rates = rateSelect.val();
		var overlaySpin = $('.overlay_spin');

		overlaySpin.fadeIn(200);
			
		var data = {
			cat: cat,
			rates: rates
		};

		filterAndLoad(data, overlaySpin);

	});

	$('.actions_bar').on('change', '#q_rates', function(){

		var rates = $(this).val();
		var cat = catSelect.val();
		var overlaySpin = $('.overlay_spin');

		overlaySpin.fadeIn(200);
			
		var data = {
			cat: cat,
			rates: rates
		};

		filterAndLoad(data, overlaySpin);

	});

}();