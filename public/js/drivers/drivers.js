!function(){

	// spin over calander while ajax
		// ajax get absences

	var absenceBtns_new = $('.absence_new');
	var absenceBtns_update = $('.absence_update');

	function editEvent(event){
		
		event = event[0];

		$('#event-modal').data("event-absenceId", event ? event.absenceId : '');
		$('#event-modal').data("event-driverId", event ? event.driverId : '');
		$('#event-modal').data("event-driver", event ? event.driver : '');

	    $('#event-modal input[name="event-start-date"]').datepicker('update', event ? event.startDate : '');
	    $('#event-modal input[name="event-end-date"]').datepicker('update', event ? event.endDate : '');
	
	    if($('#event-modal input[name="event-start-date"]').val() == ''){

	    	absenceBtns_new.show();
			absenceBtns_update.hide();

	    }else{

	    	absenceBtns_new.hide();
	    	absenceBtns_update.show();

	    }

	    $('#event-modal').modal();

	    console.log($('#event-modal').data('event-driver'));
	
	}

	var driverCalendar = $('#driver-calandar').calendar({
		dataSource: [
			{
                startDate: new Date(2017, 1, 4),
                endDate: new Date(2017, 1, 15),
                absenceId: '43543543',
                driverId: 't545434',
                driver: 'John Yeah',
                color: '#400'
            },
            {
                startDate: new Date(2017, 3, 5),
                endDate: new Date(2017, 5, 15),
                absenceId: '43543543',
                driverId: '5654645',
                driver: 'Tom',
                color: '#f52'
            },
            {
                startDate: new Date(2017, 9, 10),
                endDate: new Date(2017, 9, 17),
                absenceId: '43543543',
                driverId: '7867868',
                driver: 'Sam',
                color: '#099'
            }
		],
		enableContextMenu: true,
        enableRangeSelection: true,
        clickDay: function(e){
        	editEvent(e.events);
        }

	});

	function addAbsence(){

		// start overlayspin

		// ajax
			// success
			// driverCalendar update dataSource
			// stop spin
			// close modal

	}

	function updateAbsence(){
		
	}

	function deleteAbsence(){
		
	}

	// CRUD

	$('.addAbsence').on('click', function(){
		addAbsence();
	});

	$('.updateAbsence').on('click', function(){
		updateAbsence();
	});

	$('.deleteAbsence').on('click', function(){
		deleteAbsence();
	});

}();