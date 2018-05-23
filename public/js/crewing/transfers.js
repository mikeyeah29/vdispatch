!function(){

	$('.datepicker').datepicker({
	    format: 'dd/mm/yyyy'
	});

	function BookingForm(obj) {
		
		this.inpTime = obj.inpTime;
		this.inpFlightType = obj.inpFlightType;
		this.inpFlight = obj.inpFlight;
		this.inpTech = obj.inpTech;
		this.inpCabin = obj.inpCabin;
		this.inpCrewnames = obj.inpCrewnames;

		var modal = $('.bookingModal');
			
		modal.on('click', function(e){
			if($(e.target).hasClass('bookingModal')){
				modal.hide();
			}
		});

	};
	BookingForm.prototype.isUsed = function() {
		
		var used = false;

		if(this.inpTime.val() != '')
			used = true;

		if(this.inpFlightType.val() != '')
			used = true;

		if(this.inpFlight.val() != '')
			used = true;

		if(this.inpTech.val() != '')
			used = true;

		if(this.inpCabin.val() != '')
			used = true;

		if(this.inpCrewnames.val() != '')
			used = true;

		return used; 

	};
	BookingForm.prototype.refeshValidation = function() {
		$(this.inpTime).removeClass('invalid');
		$(this.inpFlightType).removeClass('invalid');
		$(this.inpFlight).removeClass('invalid');
		$(this.inpTech).removeClass('invalid');
		$(this.inpCabin).removeClass('invalid');
		$(this.inpCrewnames).removeClass('invalid');
	};
	BookingForm.prototype.getFormData = function() {

		var data = {};
		data.state = 'valid';
		data.values = {};

		this.refeshValidation();

		if(this.isUsed()){

			if(this.inpTime.val() != ''){
				data.values.time = this.inpTime.val();
			}else{
				$(this.inpTime).addClass('invalid');
				data.state = 'invalid';
			}

			if(this.inpFlightType.val() != ''){
				data.values.flightType = this.inpFlightType.val();
			}else{
				$(this.inpFlightType).addClass('invalid');
				data.state = 'invalid';
			}

			if(this.inpFlight.val() != ''){
				data.values.flight = this.inpFlight.val();
			}else{
				$(this.inpFlightType).addClass('invalid');
				data.state = 'invalid';
			}

			if(this.inpTech.val() != ''){
				data.values.tech = Number(this.inpTech.val());
			}else{
				$(this.inpTech).addClass('invalid');
				data.state = 'invalid';
			}

			if(this.inpCabin.val() != ''){
				data.values.cabin = Number(this.inpCabin.val());
			}else{
				$(this.inpCabin).addClass('invalid');
				data.state = 'invalid';
			}

			if(this.inpCrewnames.val() != ''){
				data.values.crewnames = this.inpCrewnames.val();
			}else{
				$(this.inpCrewnames).addClass('invalid');
				data.state = 'invalid';
			}

			data.used = true;
			return data;

		}else{
			data.used = false;
			return data;
		}

	};

	/******************************************/

	var submitBtn = $('#submitCrewingBookings');
	var bookingForms = [];

	$('.crewingForm').each(function(){
		bookingForms.push(new BookingForm({
			inpTime: $(this).find('.q_time'),
			inpFlightType: $(this).find('.q_flighttype'),
			inpFlight: $(this).find('.q_flight'),
			inpTech: $(this).find('.q_tech'),
			inpCabin: $(this).find('.q_cabin'),
			inpCrewnames: $(this).find('.q_crewnames')
		}));
	});

	function resetAllForms() {

		$('#crewing_select').val('');
		$('#q_date').val('');
		$('#arrdep_select').val('');

		$('.q_time').val('');
		$('.q_flighttype').val('');
		$('.q_flight').val('');
		$('.q_tech').val('');
		$('.q_cabin').val('');
		$('.q_crewnames').val('');

	}

	function getAllBookings() {

		var valid = true;
		var bookings = [];

		var gData = {
			customer: '',
			date: '',
			arrival: null
		};

		$('#crewing_select').removeClass('invalid');
		$('#q_date').removeClass('invalid');
		$('#arrdep_select').removeClass('invalid');

		// check top inpouts
		if($('#crewing_select').val() != ''){
			gData.customer = $('#crewing_select').val();
		}else{
			valid = false;
			$('#crewing_select').addClass('invalid');
		}

		if($('#q_date').val() != ''){
			gData.date = $('#q_date').val();
		}else{
			valid = false;
			$('#q_date').addClass('invalid');
		}

		if($('#arrdep_select').val() != ''){
			gData.arrival = $('#arrdep_select').val();
		}else{
			valid = false;
			$('#arrdep_select').addClass('invalid');
		}

		// check bookings

		var noneUsed = true;

		$(bookingForms).each(function(){
			
			var bookingData = this.getFormData();

			if(bookingData.used){

				noneUsed = false;

				if(bookingData.state == 'valid'){
					bookingData.values.customer = gData.customer; // should be account id
					bookingData.values.date = gData.date;
					bookingData.values.arrival = ((gData.arrival == 'true') ? true : false);
					bookings.push(bookingData.values);	
				}else{
					valid = false;
				}

			}

		});

		if(noneUsed){
			var msg = new Message('All Booking Forms Are Empty', true, $('#message_box'));
			msg.display();
			return false;
		}

		if(valid){
			return {
				customer: gData.customer,
				bookings: bookings
			};
		}else{
			return false;
		}

	}

	function getCrewOnly(string){
		return string.substring(string.indexOf('_')+1);
	}

	function showSuccesfulBookings(bookings) {

		var modal = $('.bookingModal');
		var theBookings = $('.bookingModal .box');

		$('.bookingModal .box .booking').remove();

		for(var i=0; i<bookings.length; i++){

			var str = '';
			str += '<div class="booking">';
			str += '<h3>Reference: ' + bookings[i].booking_no + '</h3>';
			str += '<div class="panel">';
			str += '<ul>';
			str += '<li><b>Customer: </b>' + bookings[i].customer + '</li>';
			str += '<li><b>Time/Date: </b>' + getDateForInput(new Date(bookings[i].date), true) + ' @ ' + bookings[i].time + '</li>';
			str += '<li><b>Crew: </b>' + bookings[i].passengers.name + '</li>';
			str += '<li><b>Pick Up: </b>' + bookings[i].pick_up.locaton.line1 + '</li>';
			str += '<li><b>Destination: </b>' + bookings[i].drop_off.locaton.line1 + '</li>';
			str += '<li><b>Names: </b>' + bookings[i].pick_up.instructions + '</li>';
			str += '<li><b>Notes: </b>' + bookings[i].notes + '</li>';
			str += '</ul>';
			str += '</div>';
			str += '</div>';					

				/*

					reference
					time/date
					crew
					pickup
					destination
					names
					notes

				*/

			theBookings.append(str);

		}

		modal.show();

	}

	function submitBookings() {

		var bData = getAllBookings();

		if(bData){
			
			$.ajax({
				url: '/api/bookings/crewing-booking',
				method: 'POST',
				data: {
					customer: bData.customer,
					bookings: bData.bookings
				},
				success: function(data){
						
					console.log('Bookings ', data);

					if(data.success){
						//resetAllForms();
						var msg = new Message('Bookings Created', false, $('#message_box'));
						msg.display();

						// popup with jobs
						showSuccesfulBookings(data.booking);

					}else{
						var msg = new Message(data.error || 'Something has gone wrong', true, $('#message_box'));
						msg.display();
					}
				
				},
				error: function(a, b, c){
					var msg = new Message(a.responseJSON.error || 'Something has gone wrong', true, $('#message_box'));
					msg.display();
				}
			});

		}

	}

	submitBtn.on('click', function(){
		submitBookings();
	});

}();