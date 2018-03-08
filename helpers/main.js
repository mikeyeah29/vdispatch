
function getDateForInput(date){

	if(!date){
		return '';
	}

	var dd = date.getDate();
	var mm = date.getMonth()+1; //January is 0!
	var yyyy = date.getFullYear();

	if(dd<10){
	    dd='0'+dd;
	} 
	if(mm<10){
	    mm='0'+mm;
	} 

	return dd+'/'+mm+'/'+yyyy;

}

function dateUsToUk(string){

	const parts = string.split('/');

	if(parts.length < 3){
		return '';
	}

	return parts[1] + '/' + parts[0] + '/' + parts[2];

}

function getYears(tense = future, amount, theYear = 0){
	var currentYear = new Date().getFullYear();
	var years = [];

	if(theYear > amount){
		amount == theYear;
	}

	for(i=0; i<amount; i++){
		if(tense == 'past'){
			years.push(currentYear--);
		}else{
			years.push(currentYear++);
		}
		
	}
	return years;
}

function dollarStringToInt(dollarString) {
	return parseInt(dollarString.replace('$', ''));
}

module.exports.getDateForInput = getDateForInput;
module.exports.dateUsToUk = dateUsToUk;
module.exports.getYears = getYears;
module.exports.dollarStringToInt = dollarStringToInt;