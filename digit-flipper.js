// Digit Flipper

//Takes a number and outputs a span for each digit into a parent element
var printSeparateDigits = function(num, parentElem) {
	if (typeof num != 'string') {
		num = num.toString();	
	}
	parentElem.empty();
	for (var i=0;i<num.length;i++) {
	 	parentElem.append(
	 		'<span>'+num[i]+'</span>'
	 	);
	}
}

//Moves contents of New element into Old element
var moveNewToOld = function(parentElem) {
	var oldEl = parentElem.find('.old');
	var newEl = parentElem.find('.new');
	oldEl.empty();
	newEl.children().appendTo(oldEl);
}

//Call Flip
var flipThis = function(el) {
	var elContent = el.children()
	el.empty();
	//Create front and back element, Leave front element empty, fill back element with content of el
	el.append('<span class="front"></span><span class="back"></span>').find('.back').append(elContent);
	//Init Flip plugin
	el.flip({
		axis: 'x',
		trigger: 'manual',
		speed: 500
	});
	//Trigger Flip
	el.flip(true);
	//Destroy Flip when transition ends
	//el.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
	setTimeout(//need timeout instead of using ontranstionend because if user changes the number too fast, the end event can never fire
	    function(e) {
	    	el.unwrap();
	    	el.removeAttr('style');
	    	el.find('.front').remove();
	    	el.find('.back').children().unwrap();
	    }
	, 500);//set timeout equal to speed of flip
}

//Put it all together
var flipDigits = function(num, parentElem) {
	moveNewToOld(parentElem);
	printSeparateDigits( num, parentElem.find('.new') );//new num
	flipThis( parentElem.find('.new') );
}