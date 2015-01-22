<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
</head>
<body>
<link href="style.css" rel="stylesheet">

<div id="page-wrapper" class="whitebg">

	<div class="module dirtyskybluebg main-plan">
		<div class="module-header">
			<h1>
				<span class="mediumbluetext">Our best plan ever, </span>
				<br><span class="darkbluetext">custom fit for you.</span>
			</h1>
			<h2 class="darkbluetext">
				Add between two and ten devices, choose your data amount, <br>
				then stop by one of our stores to sign up.
			</h2>
		</div>

		<div class="module-content">
			<div class="centered device-header">
				<img src="images/gradient-hr.jpg" class="fullwidth" />
				<h2>Add up to ten devices.</h2>
				<p>Only a selection of available devices.</p>
			</div>

			<ul class="devices">
				<li data-device="basic-phone" data-costPer="20" data-num="0">
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
				<li data-device="hotspot" data-costPer="20" data-num="0">
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
				<li data-device="smart-phone" data-costPer="10" data-num="1">
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
				<li data-device="tablet" data-costPer="10" data-num="1">
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
				<h2 class="inlineblock label-slider">10&#8203;GB</h2>
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
				<h2 class="inlineblock label-slider">20&#8203;GB</h2>
				<div class="justify-break"></div>
			</div>

			<div class="totals">
				<div class="device-data-quantity centered darkbluetext">
					<h1 class=""><span class="total-devices"></span> Devices</h1>
					<h1 class="lightgraytext">&mdash; & &mdash;</h1>
					<h1><span class="total-gbs"></span> GB</h1>
				</div>
				<span class="vertical-rule"></span>
				<div class="cost-per-month centered">
					<div>
						<h2>Your cost per month</h2>
						<h1 class="total-cost-container mediumbluetext">$<span class="total-cost"></span></h1>
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
			Things we want you to know: New line of service with new Retail Installment Contracts and Shared Connect Plan required. Credit approval required. Regulatory Cost Recovery Fee applies (currently $1.82/line/month); this is not a tax or gvmt. required charge. Add. fees, taxes and terms apply and vary by svc. and eqmt. Offers valid in-store at participating locations only, may be fulfilled through direct fulfillment and cannot be combined. See store or uscellular.com for details. Disney Big Hero 6 Free Ticket Offer: Qualifying consumers will receive a reward code valid for one movie ticket good towards two admissions (up to $26 value total) to see Big Hero 6 at participating theaters. To qualify, the customer must register for the promotion at <a href="http://www.bighero6tix.com" target="_blank">www.bighero6tix.com</a> and provide their first and last name, U.S. Cellular account number along with a valid email address. Redemption code will be sent to that email in 3-5 business days. Promotion void if not activated by 12/31/2014 Limit 1 offer per account. Not for resale; void if sold or exchanged. Offer is good while supplies last. Retail Installment Contracts: Retail Installment Contract (Contract) and monthly payments according to the Payment Schedule in the Contract required. If you are in default or terminate your Contract, we may require you to immediately pay the entire unpaid Amount Financed as well as our collection costs, attorneys' fees and court costs related to enforcing your obligations under the Contract. Kansas Customers: In areas in which U.S. Cellular receives support from the Federal Universal Service Fund, all reasonable requests for service must be met. Unresolved questions concerning services availability can be directed to the Kansas Corporation Commission Office of Public Affairs and Consumer Protection at 1-800-662-0027. Limited-time offer. Trademarks and trade names are the property of their respective owners. Additional terms apply. See store or uscellular.com for details. &copy;2014 U.S. Cellular
		</p>
	</footer>
<!--[if IE]>
<script src="/bighero6/html5shiv.js"></script>
<script src="/bighero6/html5shiv-printshiv.js"></script>
<!-->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="lib/js/jquery-ui.min.js"></script>
<script src="lib/js/jquery.ui.touch-punch.min.js"></script>
<script src="main.js"></script>
</body>