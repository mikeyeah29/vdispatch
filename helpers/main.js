
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

module.exports.getDateForInput = getDateForInput;
module.exports.getYears = getYears;