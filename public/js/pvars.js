!function(){

	function updateVars(pvars){

		var trs = $('table tr');

		$(trs).each(function(index){

			if(index > 0){
				$(this).children().eq(1).text('$' + pvars[index-1].price + ' / ' + pvars[index-1].unit);
			}

		});

	}

	var updateBtns = $('.btnUpdate');

	updateBtns.on('click', function(){

		var thisBtn = $(this);
		var tds = $(this).parent().siblings();
		var pVar = $(tds.get(0)).text();
		var priceInput = $(tds.get(2)).find('input');
		var price = priceInput.val();
		var spin = $(this).next('.spin');

		if(price != ''){

			spin.show();
			thisBtn.hide();

			$.ajax({
				url: '/pricing_variables/update',
				type: 'POST',
				dataType: 'json',
				data: {
					name: pVar,
					price: price
				},
				success: function(data){

					spin.hide();
					thisBtn.show();

					if(data.success != '1'){
						var msg = new Message(data.error, true, $('#message_box'));
						msg.display();
					}else{

						priceInput.val('');

						updateVars(data.pvars);

						var msg = new Message(pVar + ' Variable Updated', false, $('#message_box'));
						msg.display();

					}

				},
				error: function(xhr, desc, err){
					console.log(xhr, desc, err);
				}
			});

		}else{

			var msg = new Message('Price variable cant be empty', true, $('#message_box'));
			msg.display();

		}

	});

}();