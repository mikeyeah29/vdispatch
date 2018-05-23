(function(){

	$('.datepicker').datepicker({
	    format: 'dd/mm/yyyy'
	});
	
	$('#search').on('click', function(){
		$('section').addClass('cover_spin');
	});

})();