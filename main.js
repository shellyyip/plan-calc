/*!
 * jQuery-ajaxTransport-XDomainRequest - v1.0.2 - 2014-05-02
 * https://github.com/MoonScript/jQuery-ajaxTransport-XDomainRequest
 * Copyright (c) 2014 Jason Moon (@JSONMOON)
 * Licensed MIT (/blob/master/LICENSE.txt)
 */
(function(a){if(typeof define==='function'&&define.amd){define(['jquery'],a)}else{a(jQuery)}}(function($){if($.support.cors||!$.ajaxTransport||!window.XDomainRequest){return}var n=/^https?:\/\//i;var o=/^get|post$/i;var p=new RegExp('^'+location.protocol,'i');$.ajaxTransport('* text html xml json',function(j,k,l){if(!j.crossDomain||!j.async||!o.test(j.type)||!n.test(j.url)||!p.test(j.url)){return}var m=null;return{send:function(f,g){var h='';var i=(k.dataType||'').toLowerCase();m=new XDomainRequest();if(/^\d+$/.test(k.timeout)){m.timeout=k.timeout}m.ontimeout=function(){g(500,'timeout')};m.onload=function(){var a='Content-Length: '+m.responseText.length+'\r\nContent-Type: '+m.contentType;var b={code:200,message:'success'};var c={text:m.responseText};try{if(i==='html'||/text\/html/i.test(m.contentType)){c.html=m.responseText}else if(i==='json'||(i!=='text'&&/\/json/i.test(m.contentType))){try{c.json=$.parseJSON(m.responseText)}catch(e){b.code=500;b.message='parseerror'}}else if(i==='xml'||(i!=='text'&&/\/xml/i.test(m.contentType))){var d=new ActiveXObject('Microsoft.XMLDOM');d.async=false;try{d.loadXML(m.responseText)}catch(e){d=undefined}if(!d||!d.documentElement||d.getElementsByTagName('parsererror').length){b.code=500;b.message='parseerror';throw'Invalid XML: '+m.responseText;}c.xml=d}}catch(parseMessage){throw parseMessage;}finally{g(b.code,b.message,c,a)}};m.onprogress=function(){};m.onerror=function(){g(500,'error',{text:m.responseText})};if(k.data){h=($.type(k.data)==='string')?k.data:$.param(k.data)}m.open(j.type,j.url);m.send(h)},abort:function(){if(m){m.abort()}}}})}));

// p1b-digitalPlanConnections
var totalPlan = {
	totalDeviceNum: 0,
	totalCost: 0,
	totalGbs: 0
};
var $plus = $('.spinner-plus');
var $minus = $('.spinner-minus');

// **** Devices
var allDevices = [];
$deviceList = $('ul.devices').find('li');
$deviceList.each(function() {
	allDevices.push($(this).data());
});

// **** Data Plans
var dataPlans = [
	{gbs: 10, cost: 90},
	{gbs: 12, cost: 110},
	{gbs: 14, cost: 120},
	{gbs: 16, cost: 130},
	{gbs: 18, cost: 140},
	{gbs: 20, cost: 150}
];

// **** Functions 
var toggleMinus = function() {// Checks if minus button will make quantity go negative, and toggles on/off accordingly
	$deviceList.each(function() {
		var $this = $(this);
		var num = $this.data('num');
		if (num == 0) {
			$this.find('.spinner-minus').prop('disabled',true);
		} else {
			$this.find('.spinner-minus').prop('disabled',false);
		}
	});
}
var toggleQuantity = function() {// Checks if device quantity is 0 and makes the circle invisible if so
	$deviceList.each(function() {
		var $this = $(this);
		var num = $this.data('num');
		if (num == 0) {	
			//hide
			$this.find('.quantity').removeClass('pop-in').addClass('pop-out');
		} else {
			//show
			$this.find('.quantity').addClass('pop-in').removeClass('pop-out');
		}
	});
}
var addLeadingZeros = function(num) {//Adds leading zeros to solve spacing issues with single digits that turn into double digits. Not dynamic; better fn would also take max digits to add as many leading zeros as user wants. Returns a string
	var str = num.toString();
	if (str.length < 2) {
		str = '0'+str;
		return str;
	}
	return str;
}
var updateDeviceNum = function() {// Count devices
	var total = 0;
	$deviceList.each(function() {
		var $this = $(this);
		var num = $this.data('num');
		//Print quantities next to each device
		if (num == 0) {
			//minimum one to avoid '0' flashing in pop-out animation
			$this.find('.quantity').text('1');
		} else {
			//only update and animate new numbers
			var el = $this.find('.quantity');
			var oldNum = el.text();
			if (oldNum != num) {
				$this.find('.quantity').toggleClass('pop-in').text(num);
			}
		}
		//Calc total quantity
		total+=num;
	});
	// ** Enforce min/max quantities
	if (total == 10) {
		//Disable all plus buttons
		$plus.prop('disabled', true);
		toggleMinus();
	} else if (total == 2) {
		//Disable all minus buttons
		$minus.prop('disabled', true);
	} else {
		$plus.prop('disabled', false);
		toggleMinus();
	}
	// ** Update & print total
	totalPlan.totalDeviceNum = total;
	var dblDigitTotal = addLeadingZeros(totalPlan.totalDeviceNum);
	printSeparateDigits( dblDigitTotal, $('.total-devices').find('.old') );//seed initial value
	flipDigits( dblDigitTotal, $('.total-devices') );
}
var calcCost = function() {// Calculate package cost
	// ** Sum up devices
	var deviceSubtotal = 0;
	for (var i=0;i<allDevices.length;i++) {
		device = allDevices[i];
		var cost = device.num * device.costper;
		deviceSubtotal+=cost;
	}
	// ** Get data plan cost
	var gbs = $( "#dataplan" ).val();
	var obj = $.grep(dataPlans, function(e){ 
		return e.gbs == gbs; 
	});
	var dataCost = obj[0].cost;
	// ** Total
	var finTotal = dataCost + deviceSubtotal;
	totalPlan.totalCost = finTotal;
	// Print total
	printSeparateDigits( finTotal, $('.total-cost').find('.old') );//seed initial value
	flipDigits( finTotal, $('.total-cost') );
}
var debugReceipt = function() {// Print costs to console for debugging
	// ** Sum up devices
	var deviceSubtotal = 0;
	console.log('**********');
	for (var i=0;i<allDevices.length;i++) {
		device = allDevices[i];
		var cost = device.num * device.costper;
		console.log(device.device+': '+device.num+' x $'+device.costper+' = $'+cost);
		deviceSubtotal+=cost;
	}
	console.log('-----------');
	console.log('Device Subtotal: $'+deviceSubtotal);
	// ** Get data plan cost
	var gbs = $( "#dataplan" ).val();
	var obj = $.grep(dataPlans, function(e){ 
		return e.gbs == gbs; 
	});
	var dataCost = obj[0].cost;
	console.log('Data Subtotal: $'+dataCost);
	// ** Total
	var finTotal = dataCost + deviceSubtotal;
	console.log('Total: $'+finTotal);
}
var updateAll = function() {// Run all functions
	updateDeviceNum();
	toggleQuantity();
	calcCost();
}

var printPlan = function() {
	return totalPlan.totalDeviceNum+' devices, '+totalPlan.totalGbs+' GBs, $'+totalPlan.totalCost;
}

var noStores = function() {
	ga('send', 'event', 'Find A Store', 'Button Click', 'Invalid Zip');
	ga('send', 'event', 'Find A Store', 'Button Click', 'Configuration Result - '+printPlan());
	$('#store-list ul').empty();
  	$('#form-errors').show();
}

var success = function(stores) {
	ga('send', 'event', 'Find A Store', 'Button Click', 'Valid Zip');
	ga('send', 'event', 'Find A Store', 'Button Click', 'Configuration Result - '+printPlan());
	$('#form-errors').hide();
	$(".store-locator").show();
	//Clear addresses, error messages first
	$('#store-list ul').empty();
	$(stores).each(function(i) {
	var address_1 = stores[i].address_1;
	var address_2 = stores[i].address_2;
	var city = stores[i].city;
	var state = stores[i].state;
	var zipcode = stores[i].zipcode;
	if (stores[i].address_2.length > 0) {
	  $('#store-list ul').append('<li>'
	     +'<p class="store-name"><strong>'+stores[i].name+'</strong></p>'
	     +'<p class="store-address">'+address_1+'</br>'
	     +address_2+'</br>'
	     +city+', '
	     +state+' '
	     +zipcode+'</br>'
	     +'<p class="get-directions"><strong><a target="_blank" href="https://www.google.com/maps/dir//'+address_1+'+'+address_2+',+'+city+',+'+state+'+'+zipcode+'">Get Directions >></a></strong></p>'
	     +'</li>'); 
	} else {
	  $('#store-list ul').append('<li>'
	     +'<p class="store-name"><strong>'+stores[i].name+'</strong></p>'
	     +'<p class="store-address">'+address_1+'</br>'
	     +city+', '
	     +state+' '
	     +zipcode+'</br>'
	     +'<p class="get-directions"><strong><a target="_blank" href="https://www.google.com/maps/dir//'+address_1+'+'+address_2+',+'+city+',+'+state+'+'+zipcode+'">Get Directions >></a></strong></p>'
	     +'</li>'); 
	}
	$('#store-list ul .get-directions strong a').unbind('click').on('click',function() {
	   	ga('send', 'event', 'Find A Store', 'Button Click', 'Get Directions');
		});
	});
};

// **** Init
$(document).ready(function(){
	// **** Events 
	$plus.on('click', function() {
		var device = $(this).parents('[data-device]').data('device');
		var obj = $.grep(allDevices, function(e){ 
			return e.device == device; 
		});
		obj[0]['num']+=1;
		updateAll();
		//GA Tracking
		switch(device) {
		    case 'basic-phone':
		        ga('send', 'event', 'Add device', 'Button Click', 'Add Basic Phone');
		        break;
		    case 'smart-phone':
		        ga('send', 'event', 'Add device', 'Button Click', 'Add Smartphone');
		        break;
		    case 'hotspot':
		        ga('send', 'event', 'Add device', 'Button Click', 'Add Hotspot');
		        break;
		    case 'tablet':
		        ga('send', 'event', 'Add device', 'Button Click', 'Add Tablet');
		        break;
		}
	});
	$minus.on('click', function() {
		var device = $(this).parents('[data-device]').data('device');
		var obj = $.grep(allDevices, function(e){ 
			return e.device == device; 
		});
		obj[0]['num']-=1;
		updateAll();
		//GA Tracking
		switch(device) {
		    case 'basic-phone':
		        ga('send', 'event', 'Remove device', 'Button Click', 'Remove Basic Phone');
		        break;
		    case 'smart-phone':
		        ga('send', 'event', 'Remove device', 'Button Click', 'Remove Smartphone');
		        break;
		    case 'hotspot':
		        ga('send', 'event', 'Remove device', 'Button Click', 'Remove Hotspot');
		        break;
		    case 'tablet':
		        ga('send', 'event', 'Remove device', 'Button Click', 'Remove Tablet');
		        break;
		}
	});

	$.support.cors = true;
	//if IE9, fallback to plain Store Locator link
	if ( window.navigator.userAgent.indexOf("MSIE 9.0") > -1 == true) {
		//destroy form field
		$("#zipcode").remove();
		//link button to Store Locator page
		$("#zip-submit").unwrap().unwrap().wrap('<a href="http://www.uscellular.com/storefinder/index.html"></a>');
	} else {
		$("#zip-submit").on('click', function(e) {
			e.preventDefault();
			$.ajax({
				url: 'https://www.uscellularetf.com/api/store',
				type: 'GET',
				data: 'zipcode='+$("#zipcode").val(),
				success: function(data) { 
				  if(data.stores == false) {
				    noStores();
				  } else {
				    success(data.stores);
				  }
				},
				error: function(jqHXR, textStatus, errorThrown) {
					console.log(jqHXR);
					console.log(textStatus);
					console.log(errorThrown);
				}
			});
		});
	}
	$('#dataplan-slider').slider({
		value: 10,
		min: 10,
		max: 20,
		step: 2,
		slide: function( event, ui ) {
			var parent = $('.total-gbs');
			$( "#dataplan" ).val( ui.value );
			totalPlan.totalGbs = ui.value;
			flipDigits( ui.value, parent );
			calcCost();
			//GA Tracking
			ga('send', 'event', 'Choose Data', 'Button Click', 'Change GB');
		}
	});

	//Seed initial slider values
	var sliderVal = $( "#dataplan-slider" ).slider( "value" );
	$( "#dataplan" ).val( sliderVal );
	totalPlan.totalGbs = sliderVal;
	printSeparateDigits( sliderVal, $('.total-gbs').find('.old') );

	//IE pointer-events:none; polyfill
	PointerEventsPolyfill.initialize({});

	//Calculator init
	updateAll();
});