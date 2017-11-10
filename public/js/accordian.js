/*

	CSS

	.accordian {
	    margin-top: 25px;
	}

	.accordian .a_title {
	    background: #f1f1f1 url(../img/dark-plus.png) no-repeat 10px 50%;
	    padding: 5px 50px;
	    border-top: dashed 2px #E0DFDE;
	    border-bottom: dashed 2px #E0DFDE;
	    margin-top: -2px;
	    cursor: pointer;
	}

	.accordian .a_content {
	    padding: 20px 0px;
	    display: none;
	}

	HTML

	<div class="accordian" id="navAccordian">
		<div class="a_title">Heading One</div>
		<div class="a_content">
			...content...
		</div>
		<div class="a_title">Heading Two</div>
		<div class="a_content">
			...content...
		</div>
	</div>

*/

var accordian = (function(){

	var exports = {};

	// pass in a jquery object of the accordian container

	function Accordian(a, opening){
		
		var thisAccordian = this;
		this.headings = $(a).find('.a_title');
		this.expandedContent = $(a).find('.a_content');
		this.opening = opening || null;

		this.headings.on('click', function(){
			thisAccordian.closeContent();
			thisAccordian.openContent(this);
		});

	};

	// Accordian.prototype.init = function() {
	// 	// body...
	// };

	Accordian.prototype.openByIndex = function(index){
		var thisOne = $(this.headings).get(index);
		$(thisOne).addClass('open');
		$(thisOne).next('.a_content').slideDown(300);
	};

	Accordian.prototype.openContent = function(heading){

		if(this.opening){

			this.opening(heading, function(){
				$(heading).addClass('open');
				$(heading).next('.a_content').slideDown(300);
			});

		}else{

			$(heading).addClass('open');
			$(heading).next('.a_content').slideDown(300);

		}

	};

	Accordian.prototype.closeContent = function(){
		this.headings.removeClass('open');
		this.expandedContent.slideUp(300);
	}

	exports.Accordian = Accordian;
	return exports;

}());