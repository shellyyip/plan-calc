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
var flipNewToOld = function(parentElem) {
	var oldEl = parentElem.find('.old');
	var newEl = parentElem.find('.new');
	oldEl.empty();
	newEl.children().appendTo(oldEl);
}

//Put it all together
var flipDigits = function(num, parentElem) {
	flipNewToOld(parentElem);
	printSeparateDigits( num, parentElem.find('.new .back') );//new num
	parentElem.find('new').flip(); 
}