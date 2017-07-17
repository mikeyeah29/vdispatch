
/* Account Funcs */

function getAccountCats( selectedCat = '' ){

	var cats = ['other', 'Accommodation', 'Crewing', 'ITO', 'Public', 'Wholesaler'];
	var catsArray = [];

	cats.forEach(function(cat){

		var selected = false;

		if(selectedCat == cat){
			selected = true;
		}

		catsArray.push({
			name: cat,
			selected: selected
		});

	});

	return catsArray;

}

module.exports.getAccountCats = getAccountCats;