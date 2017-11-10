/*
	CSS to add...
	.c_modal {
		position: fixed;
	    width: 100%;
	    height: 100%;
	    background: rgba(0,0,0,0.8);
	    top: 0px;
	}
*/

class Popup {

	popUp(message, customform){

		const thisClass = this;

		let modal = $('<div>', {"class": "c_modal"});
		let box = $('<div>', {"class": "box"});
		let msg = $('<p>').html(message);

		let yesBtn = $('<button>', {"class": "yesBtn"}).html('yes').on('click', function(){
						thisClass.positiveFunc();
					});

		let noBtn = $('<button>', {"class": "noBtn"}).html('no').on('click', function(){
						thisClass.negativeFunc();
					});

		box.append(msg);

		if(customform !== undefined){

			box.append(customform);

		}else{
		
			box.append(yesBtn);
			box.append(noBtn);

		}

		modal.append(box);

		$('body').append(modal);

		
		$('.c_modal').on('click', function(e){

			if($(e.target).is('.box') || $(e.target).is('button') || $(e.target).is('input')){
	            e.preventDefault();
	            return;
	        }

			thisClass.popDown();
		});

		if(customform !== undefined){
			this.positiveFunc();
		}

	}

	popDown(){

		$('.c_modal').remove();
		$('.c_modal').off();

	}

	constructor(positiveFunc, negativeFunc){
		this.positiveFunc = positiveFunc;
		this.negativeFunc = negativeFunc;
	}

}

/*
class Popup {
	popUp(message, customform){
		let modal = '<div class="c_modal">';
		modal += '<div class="box">';
		modal += '<p>' + message + '</p>';
		if(customform !== undefined){
			modal += customform;
		}else{
			modal += '<button id="yes_btn">Yes</button>';
			modal += '<button id="no_btn">No</button>';
		}
		modal += '</div>';
		modal += '</div>';
		$('body').append(modal);
		const thisClass = this;
		$('.c_modal').on('click', function(e){
			if($(e.target).is('.box') || $(e.target).is('button') || $(e.target).is('input')){
	            e.preventDefault();
	            return;
	        }
			thisClass.popDown();
			
		});
		$('#yes_btn').on('click', function(){
			thisClass.positiveFunc();
		});
		$('#no_btn').on('click', function(){
			thisClass.negativeFunc();
		});
		// if(customform !== undefined){
		// 	this.positiveFunc();
		// }
	}
	popDown(){
		console.log('popdocdcsdwn');
		$('.c_modal').remove();
		$('.c_modal').off();
	}
	constructor(positiveFunc, negativeFunc){
		this.positiveFunc = positiveFunc;
		this.negativeFunc = negativeFunc;
	}
}
*/