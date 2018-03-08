!function(Form){

	var theModal = $('#event-modal');
	var spin = $('.overlay_spin');
	var modalSpin = $('.modal-body .spin');

	$('.datepicker').datepicker({
	    format: 'dd/mm/yyyy'
	});

	function AbsenceController(){

		this.date = null;
		this.drivers = [];

		this.h5 = $('.absenceH5');

		this.startDateInput = $('#event-modal input[name="event-start-date"]');
		this.endDateInput = $('#event-modal input[name="event-end-date"]');

		this.formAdd = new Form('/drivers/add-absence', [
				{
					id: 'q_start_date',
					validation: ''
				},
				{
					id: 'q_end_date',
					validation: ''
				},
				{
					id: 'select_driver',
					validation: ''
				}
		]);

		this.currentAbsencesBox = $('.current_absences_box');
		this.selectDriver = $('#select_driver');
		this.addBtn = $('.addAbsence');
		this.updateBtn = $('.updateAbsence');
		this.spin = $('#abSpin');

	}

	AbsenceController.prototype.setEditor = function(event){

		modalSpin.hide();

		var thisAc = this;

		this.startDateInput.datepicker('update', getDateForInput(this.date, true));
		this.endDateInput.datepicker('update', getDateForInput(this.date, true));

		if(this.drivers != ''){
			
			this.currentAbsencesBox.show();

			var ul = $('.absences_today');
			ul.empty();

			for(var i=0; i<this.drivers.length; i++){
		
				var li = $('<li></li>');
				li.data('absenceId', this.drivers[i].absenceId);
				li.data('startDate', this.drivers[i].startDate);
				li.data('endDate', this.drivers[i].endDate);
				li.data('driverName', this.drivers[i].driver_name);
				var xSpan = $('<span class="x driver">x</span>');
				var nameSpan = $('<span class="absencedriverName">' + this.drivers[i].driver_name + '</span>');

				li.append(xSpan);
				li.append(nameSpan);

				ul.append(li);

			}

		}else{
			this.currentAbsencesBox.hide();
		}

	};

	AbsenceController.prototype.switchToUpdateMode = function(startDate, endDate, driverName, absenceId){
		this.spin.hide();
		this.currentAbsencesBox.slideUp(200);
		this.startDateInput.datepicker('update', new Date(getDateForInput(startDate), true));
		this.endDateInput.datepicker('update', new Date(getDateForInput(endDate), true));
		this.h5.text('Absence for ' + driverName);
		this.selectDriver.hide();
		this.addBtn.hide();
		this.updateBtn.data('absenceId', absenceId);
		this.updateBtn.show();
	}

	AbsenceController.prototype.switchToAddMode = function(){

		this.spin.hide();
		this.h5.text('Add Absence');
		this.selectDriver.show();
		this.addBtn.show();
		this.updateBtn.hide();

	}

	AbsenceController.prototype.addAbsence = function(callback){

		this.startSpin();

		var thisAc = this;

		if(this.formAdd.isValid()){

			this.formAdd.send({
				driverId: $('#select_driver').val(),
				startDate: $('#q_start_date').datepicker().val(), 
				endDate: $('#q_end_date').datepicker().val()
			}, function(data){

				if(data.success == '1'){
					callback(data.absences);
					var msg = new Message('Driver Absence Recorded', false, $('#message_box'));
					msg.display(false);
					thisAc.stopSpin(false);
				}else{
					var msg = new Message(data.error, true, $('#message_box'));
					msg.display(false);
				}
				
				// modalSpin.hide();
				theModal.modal('hide');

			});

		}else{
			var msg = new Message('Missing required fields', true, $('#message_box'));
			msg.display();
			thisAc.stopSpin(false);
		}

	};

	AbsenceController.prototype.startSpin = function(){
		modalSpin.show();
		this.addBtn.hide();
		this.updateBtn.hide();
	};

	AbsenceController.prototype.stopSpin = function(isUpdate){
		modalSpin.hide();
		if(!isUpdate){
			this.addBtn.show();
		}else{
			this.updateBtn.show();
		}
	};

	AbsenceController.prototype.updateAbsence = function(absenceId, callback){

		this.startSpin();
		var thisAc = this;

		$.ajax({
			url: '/drivers/update-absence',
			type: 'POST',
			dataType: 'json',
			data: {
				absenceId: absenceId,
				startDate: $('#q_start_date').datepicker().val(), 
				endDate: $('#q_end_date').datepicker().val()
			},
			success: function(data){
				// updateCalender
				if(data.success == '1'){
					thisAc.stopSpin(true);
					callback(data.absences);
					var msg = new Message('Driver Absence Updated', false, $('#message_box'));
					msg.display(false);
					theModal.modal('hide');
				}else{
					var msg = new Message(data.error, true, $('#message_box'));
					msg.display(false);
				}
			},
			error: function(xhr, desc, err){
				console.log(xhr, desc, err);
			}
		});

	};

	AbsenceController.prototype.deleteAbsence = function(absenceId, callback){

		$.ajax({
			url: '/drivers/remove-absence',
			type: 'POST',
			dataType: 'json',
			data: {
				absenceId: absenceId
			},
			success: function(data){
				// updateCalender
				if(data.success == '1'){
					callback(data.absences);
					var msg = new Message('Driver Absence Removed', false, $('#message_box'));
					msg.display(false);
				}else{
					var msg = new Message(data.error, true, $('#message_box'));
					msg.display(false);
				}
			},
			error: function(xhr, desc, err){
				console.log(xhr, desc, err);
			}
		});

	};

	/***************************

		ABSENCE CALENDAR

	****************************/

	function AbsenceCalendar(calendarSelector){

		var thisAc = this;

		this.calendar = $(calendarSelector).calendar({
			enableContextMenu: true,
	        enableRangeSelection: true,
	        clickDay: function(e){
	        	thisAc.editEvent(e.events, e.date);
	        }
		});

		this.absenceController = new AbsenceController();

		$.ajax({
			url: '/drivers/get-absences',
			type: 'POST',
			dataType: 'json',
			data: {},
			success: function(data){
				thisAc.updateCalendarData(data.absences);
				spin.hide();
			},
			error: function(xhr, desc, err){
				console.log(xhr, desc, err);
			}
		});

	}

	AbsenceCalendar.prototype.editEvent = function(event, date){

		this.absenceController.date = date;
		this.absenceController.drivers = event;
		this.absenceController.setEditor(event);
		this.absenceController.switchToAddMode();
		theModal.modal();

	};

	AbsenceCalendar.prototype.updateCalendarData = function(dataAbsences){

		var absences = [];

		for(var i=0; i<dataAbsences.length; i++){

			var obj = {
				absenceId: dataAbsences[i]._id,
				driverId: dataAbsences[i].driver._id, 
				driver_name: dataAbsences[i].driver.first_name + ' ' +  dataAbsences[i].driver.last_name, 
				color: dataAbsences[i].driver.color,
				startDate: new Date(dataAbsences[i].startDate),
				endDate: new Date(dataAbsences[i].endDate)
			};

			absences.push(obj);

		}

		this.calendar.setDataSource(absences);

	};

	/////////////////////////

	var absenceCalender = new AbsenceCalendar('#driver-calandar');

	$('.addAbsence').on('click', function(){
		absenceCalender.absenceController.addAbsence(function(data){
			absenceCalender.updateCalendarData(data);
		});
	});

	absenceCalender.absenceController.updateBtn.on('click', function(){
		absenceCalender.absenceController.updateAbsence($(this).data('absenceId'), function(data){
			absenceCalender.updateCalendarData(data);
		});
	});

	$('.absences_today').on('click', '.x', function(){
		$(this).addClass('xSpin');
		var xSpan = this;
		absenceCalender.absenceController.deleteAbsence($(this).parent().data('absenceId'), function(data){
			absenceCalender.updateCalendarData(data);
			$(xSpan).parent().remove();
			absenceCalender.absenceController.switchToAddMode();
		});
	});

	$('.absences_today').on('click', '.absencedriverName', function(){
		var nameSpan = this;
		var startDate = $(nameSpan).parent().data('startDate');
		var endDate = $(nameSpan).parent().data('endDate');
		var driverName = $(nameSpan).parent().data('driverName');
		var absenceId = $(nameSpan).parent().data('absenceId');
		absenceCalender.absenceController.switchToUpdateMode(startDate, endDate, driverName, absenceId);
	});

}(form.Form);