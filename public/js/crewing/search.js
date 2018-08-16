(function(){

	$('.datepicker').datepicker({
	    format: 'dd/mm/yyyy'
	});
	
	$('#search').on('click', function(){
		$('section').addClass('cover_spin');
	});

	// VUE STUFF DELETE

	const helloWorld = new Vue({
		el: '#helloVue',
		data: {
			title: 'Yeahhh'
		}
	});

})();