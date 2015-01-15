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
	calcCost();
	debugReceipt();
}

// **** Events 
$plus.on('click', function() {
	var device = $(this).parents('[data-device]').data('device');
	var obj = $.grep(allDevices, function(e){ 
		return e.device == device; 
	});
	obj[0]['num']+=1
	updateAll();
});
$minus.on('click', function() {
	var device = $(this).parents('[data-device]').data('device');
	var obj = $.grep(allDevices, function(e){ 
		return e.device == device; 
	});
	obj[0]['num']-=1
	updateAll();
});

// **** Init
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

updateAll();

$("#zip-submit").on('click', function(e) {
	e.preventDefault();
	$.ajax({
		url: 'https://usc-etf.ngrok.com/api/store',
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