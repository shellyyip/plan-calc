// p1b-digitalPlanConnections
var USCP1B = USCP1B || {};
console.log('******** starting p1b');

// Devices
var allDevices = [];
$deviceList = $('ul.devices').find('li');
$deviceList.each(function() {
	allDevices.push($(this).data());
});

var totalPlan = {
	totalDeviceNum: 0,
	totalCost: 0
};

var $plus = $('.spinner-plus');
var $minus = $('.spinner-minus');

var preventNegNum = function() {
	console.log('**************');
	$deviceList.each(function() {
		var $this = $(this);
		var num = $this.data('num');
		console.log('Quant of '+$this.data('device')+' is '+num);
		if (num == 0) {
			$this.find('.spinner-minus').prop('disabled',true);
		} else {
			$this.find('.spinner-minus').prop('disabled',false);
		}
	});
}
var updateDeviceNum = function() {
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
		preventNegNum();
	} else if (total == 2) {
		//Disable all minus buttons
		$minus.prop('disabled', true);
	} else {
		$plus.prop('disabled', false);
		preventNegNum();
	}
	// ** Update & print total
	totalPlan.totalDeviceNum = total;
	$('.total-devices').text(totalPlan.totalDeviceNum);
}

$plus.on('click', function() {
	var device = $(this).parents('[data-device]').data('device');
	var obj = $.grep(allDevices, function(e){ 
		return e.device == device; 
	});
	obj[0]['num']+=1
	updateDeviceNum();
});
$minus.on('click', function() {
	var device = $(this).parents('[data-device]').data('device');
	var obj = $.grep(allDevices, function(e){ 
		return e.device == device; 
	});
	obj[0]['num']-=1
	updateDeviceNum();
});


// Data Plans
USCP1B.DataPlan = function(gbs, cost) {
	this.gbs = gbs;
	this.cost = cost;
};
var gbs10 = new USCP1B.DataPlan(10, 90);
var gbs12 = new USCP1B.DataPlan(12, 110);
var gbs14 = new USCP1B.DataPlan(14, 120);
var gbs16 = new USCP1B.DataPlan(16, 130);
var gbs18 = new USCP1B.DataPlan(18, 140);
var gbs20 = new USCP1B.DataPlan(20, 150);

updateDeviceNum();
