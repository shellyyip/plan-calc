// p1b-digitalPlanConnections
var USCP1B = USCP1B || {};
console.log('******** starting p1b');

// Devices
var allDevices = $('.devices').find('li').each(function() {
	console.log(this);
});


console.log(allDevices);

var totalPlan = {
	totalDeviceNum: 0,
	totalCost: 0
};

var updateDeviceNum = function() {

}

var $plus = $('.spinner-plus');
var $minus = $('.spinner-minus');

$plus.on('click', function() {
	//add to object of parent
	var device = $(this).parents('[data-device]').data('device');
	var obj = $.grep(allDevices, function(e){ 
		return e.device == device; 
	});
	obj[0]['num']+=1
	console.log(obj);
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