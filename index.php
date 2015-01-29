<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<script src="lib/js/usc-ga.js"></script>
</head>
<body>
<link href="style.css" rel="stylesheet">
<!--[if IE 9]>
	<style>
	/* Fallback for IE9 non-support for CSS3 animations */
     .pop-in {
      visibility: auto;
    }
    .pop-out {
      visibility: hidden;
    }
    </style>
<![endif]-->

<div id="page-wrapper" class="whitebg">

	<div class="module dirtyskybluebg main-plan">
		<div class="module-header">
			<h1>
				<span class="mediumbluetext">Our best plan ever, </span>
				<br>
				<span class="darkbluetext">custom fit for you.</span>
			</h1>
			<h2 class="darkbluetext">
				Add between two and ten devices, choose your data amount, 
				<span class="invisible-on-mobile"><br></span>
				then stop by one of our stores to sign up. Plus, get a $100 trade-in guarantee.
			</h2>
		</div>

		<div class="module-content">
			<div class="centered device-header">
				<img src="images/gradient-hr.jpg" class="fullwidth" />
				<h2>Add up to ten devices.</h2>
				<p>Only a selection of available devices.</p>
			</div>

			<ul class="devices">
				<li data-device="basic-phone" data-costper="20" data-num="0">
					<div class="device-img">
						<img src="images/device-basicphone.png"/>
						<div class="quantity"></div>
					</div>
					<p>Basic Phone ($20)</p>
					<div class="num-spinner">
						<button class="spinner-minus"> &ndash; </button>
						<span class="vertical-rule"></span>
						<button class="spinner-plus"> + </button>
					</div>
				</li>
				<li data-device="hotspot" data-costper="20" data-num="0">
					<div class="device-img">
						<img src="images/device-hotspot.png"/>
						<div class="quantity"></div>
					</div>
					<p>Hotspot ($20)</p>
					<div class="num-spinner">
						<button class="spinner-minus"> &ndash; </button>
						<span class="vertical-rule"></span>
						<button class="spinner-plus"> + </button>
					</div>
				</li>
				<li data-device="smart-phone" data-costper="10" data-num="1">
					<div class="device-img">
						<img src="images/device-smartphone.png"/>
						<div class="quantity"></div>
					</div>
					<p>Smartphone ($10)</p>
					<div class="num-spinner">
						<button class="spinner-minus"> &ndash; </button>
						<span class="vertical-rule"></span>
						<button class="spinner-plus"> + </button>
					</div>
				</li>
				<li data-device="tablet" data-costper="10" data-num="1">
					<div class="device-img">
						<img src="images/device-tablet.png"/>
						<div class="quantity"></div>
					</div>
					<p>Tablet ($10)</p>
					<div class="num-spinner">
						<button class="spinner-minus"> &ndash; </button>
						<span class="vertical-rule"></span>
						<button class="spinner-plus"> + </button>
					</div>
				</li>
			</ul>

			<div class="dataplans">
				<h2 class="centered">Choose your shared data.</h2>
				<input type="text" id="dataplan" readonly hidden>
				<h2 class="inlineblock label-slider">10GB</h2>
				<div class="dataplan-slider-container">
					<div id="dataplan-slider"></div>
					<div class="slider-ticks">
						<span>&bull;</span> 
						<span>&bull;</span> 
						<span>&bull;</span> 
						<span>&bull;</span> 
						<span>&bull;</span> 
						<span>&bull;</span> 
						<span class="justify-break"></span>
					</div>
				</div>
				<h2 class="inlineblock label-slider">20GB</h2>
				<div class="justify-break"></div>
			</div>

			<div class="totals">
				<div class="device-data-quantity centered darkbluetext">
					<div>
						<div class="total-devices-container">
							<div class="total-devices flip-wrap">
								<h1 class="old"></h1> 
								<h1 class="new"></h1> 
							</div> 
							<h1 class="flip-label">Devices</h1>
						</div>

						<h1 class="lightgraytext">&mdash; & &mdash;</h1>

						<div class="total-gbs-container">
							<div class="total-gbs flip-wrap">
								<h1 class="old"></h1> 
								<h1 class="new"></h1> 
							</div>
							<h1 class="flip-label">GB</h1>
						</div>
					</div>
				</div>
				<span class="vertical-rule"></span>
				<div class="cost-per-month centered">
					<div>
						<h2>Your cost per month</h2>
						<div class="total-cost-container mediumbluetext">
							<h1 class="flip-label">$</h1>
							<div class="total-cost flip-wrap">
								<h1 class="old"></h1> 
								<h1 class="new"></h1> 
							</div>
						</div>
					</div>
				</div>
			</div>
			<p class="centered clear">This is for illustrative purposes only. Price is dependent on selected devices and Shared Data Plan.</p>
		</div>
	</div>

	<div class="module slate-bg store-locator">
		<div class="white-overlay">
			<h2 class="mediumbluetext">Stop by one of our locations <br>to seal the deal.</h2>

			<div class="elig-form">
				<form id="zipcode-form" method="get" action="https://usc-etf.ngrok.com/api/store">
				  	<fieldset>
						<input type="text" class="reqFields" required="required" id="zipcode" name="zipcode" placeholder="ZIP CODE" pattern=".{5,5}">
						<button id="zip-submit" class="button redbg whitetext" type="submit">Find A Store</button>
					</fieldset>
				</form>
				<p id="form-errors">
					<img src="images/icon-noteligible.png">
					We're sorry; it appears that you are not eligible for this offer.
				</p>
			</div>

			<div id="store-list">
				<ul class="row">
				</ul>
				<div class="clear"></div>
			</div>
		</div>
	</div>

	<footer class="module">
		<p class="mediumgraytext text-left verdana">
			<strong>Things we want you to know:</strong> New Retail Installment Contracts, Shared Connect Plan and $25 device act. fee required. Credit approval required. Regulatory Cost Recovery Fee applies (currently $1.82/line/month); this is not a tax or gvmt. required charge. Add. fees, taxes and terms apply and vary by svc. and eqmt. Offers valid in-store at participating locations only, may be fulfilled through direct fulfillment and cannot be combined. See store or uscellular.com for details. <strong>$130 Price Plan</strong> based on $90/mo., 10GB Shared Connect Plan plus 4 lines with discounted $10 Device Connection Charges each. Retail Installment Contract required to receive discounts; otherwise, regular Device Connection Charges apply. Other discounts available for additional Shared Connect Plans. Limited-time offer. <strong>Contract Payoff Promo:</strong> Offer valid on up to 6 consumer lines or 25 business lines. Must port in current number to U.S. Cellular and purchase new Smartphone or tablet through a Retail Installment Contract on a Shared Connect Plan with Device Protection+. Enrollment in Device Protection+ required in all markets except North Carolina. The monthly charge for Device Protection+ is $8.99 for Smartphones. A deductible per approved claim applies. Federal Warranty Service Corporation is the Provider of the Device Protection+ ESC benefits, except in CA and OK. Submit final bill identifying early termination fee (ETF) charged by carrier within 60 days of activation date to <a href="http://www.uscellular.com/contractpayoff" target="_blank">www.uscellular.com/contractpayoff</a> or via mail to U.S. Cellular® Contract Payoff Program 5591-61; PO Box 752257; El Paso, TX 88575-2257. Customer will be reimbursed for the ETF reflected on final bill up to $350/line. Reimbursement in form of a U.S. Cellular Prepaid Card is issued by MetaBank,® Member FDIC; additional offers are not sponsored or endorsed by MetaBank. This card does not have cash access and can be used at any merchant location that accepts MasterCard® Debit Cards within the U.S. only. Card valid through expiration date shown on front of card. Allow 12–14 weeks for processing. To be eligible, customer must register for My Account. <strong>Retail Installment Contract:</strong> Retail Installment Contract (Contract) and monthly payments according to the Payment Schedule in the Contract required. If you are in default or terminate your Contract, we may require you to immediately pay the entire unpaid Amount Financed as well as our collection costs, attorneys’ fees and court costs related to enforcing your obligations under the Contract. Upgrade your handset after 12 consecutive payments made on the Contract. <strong>Kansas Customers:</strong> In areas in which U.S. Cellular receives support from the Federal Universal Service Fund, all reasonable requests for service must be met. Unresolved questions concerning services availability can be directed to the Kansas Corporation Commission Office of Public Affairs and Consumer Protection at 1-800-662-0027. Limited-time offer. Trademarks and trade names are the property of their respective owners. Additional terms apply. See store or uscellular.com for details. &copy;2015 U.S. Cellular
		</p>
	</footer>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="lib/js/jquery-ui.min.js"></script>
<script src="lib/js/jquery.ui.touch-punch.min.js"></script>
<script src="lib/js/pointer_events_polyfill.js"></script>
<script src="lib/js/flip.min.js"></script>
<script src="digit-flipper.js"></script>
<script src="main.js"></script>
</body>