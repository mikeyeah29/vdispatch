var YeahAutocomplete = (function(){

	function Model(){

	}

	function View(input){
		this.input = $('#' + input);
		this.resultsList = $('<ul class="YeahAutocomplete_list"></ul>');
		this.resultsList.insertBefore(this.input);
		this.resultsList.hide();
	}
	View.prototype.startLoading = function(){
		this.input.addClass('yac_loading');
	};
	View.prototype.stopLoading = function(){
		this.input.removeClass('yac_loading');
	};
	View.prototype.displayResults = function(results, property){
		var thisView = this;
		this.resultsList.empty();
		for(i=0; i<results.length; i++){
			var li = $('<li class="yac_li">' + results[i][property] + '</li>');
			// var result = results[i];
			$(li).data('suburbinfo', results[i]);
			this.resultsList.append(li);
		}

		this.resultsList.show();
	};

	function YeahAutocomplete(options){

		var thisYac = this;

		this.view = new View(options.input);
		this.model = new Model();

		this.customDisplay = options.customDisplay || false;
	
		this.view.input.on('input', function(){
			thisYac.getResults($(this).val(), options.dataUrl, options.method, {}, options.arrName, options.property);
		});

		$('body').on('click', function(e){
			if(!$(e.target).hasClass('yac_li')){
				thisYac.view.resultsList.hide();
			}
		});

		$('.YeahAutocomplete_list').on('click', 'li', function(){
			var thisView = thisYac.view;
			thisView.input.val($(this).text());
			// console.log('RESULSTS: ', result);
			thisView.input.trigger("resultSelected", $(this).data('suburbinfo'));
			thisView.resultsList.hide();
		});

	}

	YeahAutocomplete.prototype.getResults = function(query, url, method, dataObj, arrName, property){
		
		var thisYac = this;
		this.view.startLoading();

		if(query == ''){
			query = 'noterm';
		}
		
		if(method == 'GET'){

			$.ajax({
				url: url + '/' + query,
				method: 'GET',
				success: function(data){

					var results = data;

					if(data[arrName]){
						results = data[arrName];
					}

					if(!thisYac.customDisplay){
						thisYac.view.displayResults(results, property);
					}else{
						thisYac.customDisplay(results);
					}
					thisYac.view.stopLoading();

				},
				error: function(a, b, c){
					console.log(a, b, c);
				}
			});

		}else{

			$.ajax({
				url: url,
				method: 'POST',
				data: {
					phrase: query
				},
				success: function(data){

					var results = data;

					if(data[arrName]){
						results = data[arrName];
					}

					console.log('custom jk', thisYac.customDisplay);

					if(!thisYac.customDisplay){
						thisYac.view.displayResults(results, property);
					}else{
						thisYac.customDisplay(results);
					}

					thisYac.view.stopLoading();
				},
				error: function(a, b, c){
					console.log(a, b, c);
				}
			});

		}

	};

	return YeahAutocomplete;

}());