
/*

All classes, functions and variables in this file are global

*/

// Helper Functions

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

function setCloseModel(selector){

	$(selector).on('click', function(e){

		console.log($(e.target));

		if($(e.target).hasClass(selector)){
			$(this).hide();
		}

	});

}

// Classes

function Message(msg, isError, elem){

	this.msg = msg;
	this.elem = elem;
	this.elem.find('p').html(msg);

	this.elem.removeClass('error_msg');

	if(isError){
		this.elem.addClass('error_msg');
	}

	var thisMsg = this;

	this.elem.find('.x').on('click', function(){
		thisMsg.hideMsg();
	});

}

Message.prototype.display = function(persist){

	this.elem.addClass("slideup");

	thisMsg = this;

	if(persist != true){
		setTimeout(function() {
	    	thisMsg.hideMsg();
	    }, 3000);
	}

};

Message.prototype.hideMsg = function(){

	$(this.elem).removeClass("slideup");

};

// ItemsTable

/*

	rowItems 
		- this is an array of strings that are the keys of the data thats being looped through on 
		  the updated table (so each td)
		- if its not a string its an obj which includes...
			{
				td_class: 'actions',
				elements: [
					'<a href="">njknj</a>',
					'<span data-hmmid="#hmmid#">yesh</span>'
				]
			}

*/

function ItemsTable(tableELement){
	this.table = tableELement;
}

ItemsTable.prototype.filterTable = function(url, data, loaded){

	var thisTable = this;

	$.ajax({
		url: url,
		type: 'POST',
		dataType: 'json',
		data: data,
		success: function(data){
			
			console.log(data);

			if(data.success == '1'){
				thisTable.table.find("tr:gt(0)").remove();
				loaded(data);
			}

		},
		error: function(xhr, desc, err){
			console.log(xhr, desc, err);
		}
	});

};

// Active Toggle

/* 

	itemActiveToggle(dataObj, url, toggleInput)

	dataObj = {
		itemId: itemId
	}

	url = update api url

	toggleInput = ....

*/

function itemActiveToggle(url, spin, dataObj){

	$.ajax({
		url: url,
		type: 'POST',
		dataType: 'json',
		data: dataObj,
		success: function(data){
			
			console.log(data);

			spin.hide();

			if(data.error){
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

}

function getDateForInput(date){

	var dd = date.getDate();
	var mm = date.getMonth()+1; //January is 0!
	var yyyy = date.getFullYear();

	if(dd<10){
	    dd='0'+dd;
	} 
	if(mm<10){
	    mm='0'+mm;
	} 

	return mm+'/'+dd+'/'+yyyy;

}

// Autocompletes

function vDisp_autocomplete(dataToSearch, id, callback = null){

	url = '';

	var theElement;

	if($.type(id) == 'object'){
		theElement = id;
	}else{
		theElement = $('#' + id);
	}

	var options = {
		url: function(phrase) {

			if(dataToSearch == 'location'){
				return '/api/locations/search';
			}else{
				return "/api/" + dataToSearch + 's';
			}

		},
		getValue: function(element) {

			var thing = dataToSearch;

			if(dataToSearch == 'location'){
				thing = 'line1';
			}
			return element[thing] || element;
		},
		ajaxSettings: {
			dataType: "json",
			method: "POST",
			data: {
			  dataType: "json"
			}
		},
		preparePostData: function(data) {
			data.phrase = theElement.val();
			return data;
		},
		list: {
			onSelectItemEvent: function(){
				if(callback){
					callback(theElement);
				}
			}
		},
		requestDelay: 400
	};

	theElement.easyAutocomplete(options);

}