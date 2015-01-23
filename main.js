// p1b-digitalPlanConnections
var totalPlan = {
	totalDeviceNum: 0,
	totalCost: 0
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
			$this.find('.quantity').hide();
		} else {
			$this.find('.quantity').show();
		}
	});
}
var updateDeviceNum = function() {// Count devices
	var total = 0;
	$deviceList.each(function() {
		var $this = $(this);
		var num = $this.data('num');
		//Print quantities next to each device
		$this.find('.quantity').text(num);
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
	$('.total-devices').text(totalPlan.totalDeviceNum);
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
	// Print total
	$('.total-cost').text(finTotal);
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
	debugReceipt();
}

var noStores = function() {
	$('#store-list ul').empty();
  	$('#form-errors').show();
}

var success = function(stores) {
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
	// $('#store-list ul .get-directions strong a').unbind('click').on('click',function() {
	//   ga('send', 'event', 'Get Directions Link Click BH6 Results', 'Click', 'Get Store Directions - BH6');
	// });
	});
};

// **** Events 
$plus.on('click', function() {
	var device = $(this).parents('[data-device]').data('device');
	var obj = $.grep(allDevices, function(e){ 
		return e.device == device; 
	});
	obj[0]['num']+=1;
	updateAll();
});
$minus.on('click', function() {
	var device = $(this).parents('[data-device]').data('device');
	var obj = $.grep(allDevices, function(e){ 
		return e.device == device; 
	});
	obj[0]['num']-=1;
	updateAll();
});
$("#zip-submit").on('click', function(e) {
	e.preventDefault();
	$.ajax({
		url: 'https://www.uscellularetf.com/api/store',
		type: 'GET',
		data: 'zipcode='+$("#zipcode").val(),
		success: function(data) { 
		  //var data = window.JSON.parse(data);
		  if(data.stores == false) {
		    noStores();
		  } else {
		    success(data.stores);
		  }
		}
	});
});

$('#dataplan-slider').slider({
	value: 10,
	min: 10,
	max: 20,
	step: 2,
	slide: function( event, ui ) {
		$( "#dataplan" ).val( ui.value );
		$('.total-gbs').text(ui.value);
		calcCost();
		debugReceipt();
	}
});
var sliderVal = $( "#dataplan-slider" ).slider( "value" );
$( "#dataplan" ).val( sliderVal );
$('.total-gbs').text( sliderVal );


// **** Init
updateAll();