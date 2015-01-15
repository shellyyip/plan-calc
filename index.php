<link href="style.css" rel="stylesheet">

<div id="page-wrapper" class="lightgraybg">

	<div class="module">
		<h1 class="stagsanslight">Our best plan ever, custom fit for you.</h1>
	</div>

	<div class="module stagsanslight">
		<ul class="devices">
			<li data-device="basic-phone" data-costPer="20" data-num="0">
				Basic Phone ($20)
				<span class="quantity"></span>
				<div class="num-spinner">
					<button class="spinner-plus"> + </button>
					<button class="spinner-minus"> - </button>
				</div>
			</li>
			<li data-device="hotspot" data-costPer="20" data-num="0">
				Hotspot ($20)
				<span class="quantity"></span>
				<div class="num-spinner">
					<button class="spinner-plus"> + </button>
					<button class="spinner-minus"> - </button>
				</div>
			</li>
			<li data-device="smart-phone" data-costPer="10" data-num="1">
				Smartphone ($10)
				<span class="quantity"></span>
				<div class="num-spinner">
					<button class="spinner-plus"> + </button>
					<button class="spinner-minus"> - </button>
				</div>
			</li>
			<li data-device="tablet" data-costPer="10" data-num="1">
				Tablet ($10)
				<span class="quantity"></span>
				<div class="num-spinner">
					<button class="spinner-plus"> + </button>
					<button class="spinner-minus"> - </button>
				</div>
			</li>
		</ul>

		<div class="dataplans">
			<h2>Choose your shared data.</h2>
			<input type="text" id="dataplan" readonly hidden>
			<div id="dataplan-slider"></div>
		</div>

		<div>
		Total Devices: <span class="total-devices"></span>
		<br>
		Total GB: <span class="total-gbs"></span>
		<br>
		Your cost per month: <span class="total-cost"></span>
		<br>
		</div>
	</div>

	<div class="module slate-bg store-locator">
		<div class="white-overlay">
			<h2>Stop by one of our locations <br>to seal the deal.</h2>

			<div class="elig-form">
				<form id="bg6-zipcode-form" method="get" action="https://www.uscellularetf.com/api/store">
					<p class="zipcode-label">Zip Code *</p>
				  	<fieldset>
						<input type="text" class="reqFields" required="required" id="zipcode" name="zipcode" pattern=".{5,5}">
						<button id="bg6-zip-submit" class="button redbg whitetext" type="submit">Find A Store</button>
					</fieldset>
				</form>
				<p id="form-errors"></p>
			</div>

			<div id="store-list">
				<ul class="row">
				</ul>
				<div class="clear"></div>
			</div>
		</div>
	</div>

	<div class="module slate-bg find-accessories">
		<a id="bg6-findaccessories" href="http://www.uscellular.com/uscellular/accessories/showAccessories.jsp?openShopping=true" class="button redbg whitetext" target="_blank">Browse Accessories</a>
	</div>

	<footer class="module">
		<p class="mediumgraytext text-left">
			Things we want you to know: New line of service with new Retail Installment Contracts and Shared Connect Plan required. Credit approval required. Regulatory Cost Recovery Fee applies (currently $1.82/line/month); this is not a tax or gvmt. required charge. Add. fees, taxes and terms apply and vary by svc. and eqmt. Offers valid in-store at participating locations only, may be fulfilled through direct fulfillment and cannot be combined. See store or uscellular.com for details. Disney Big Hero 6 Free Ticket Offer: Qualifying consumers will receive a reward code valid for one movie ticket good towards two admissions (up to $26 value total) to see Big Hero 6 at participating theaters. To qualify, the customer must register for the promotion at <a href="http://www.bighero6tix.com" target="_blank">www.bighero6tix.com</a> and provide their first and last name, U.S. Cellular account number along with a valid email address. Redemption code will be sent to that email in 3-5 business days. Promotion void if not activated by 12/31/2014 Limit 1 offer per account. Not for resale; void if sold or exchanged. Offer is good while supplies last. Retail Installment Contracts: Retail Installment Contract (Contract) and monthly payments according to the Payment Schedule in the Contract required. If you are in default or terminate your Contract, we may require you to immediately pay the entire unpaid Amount Financed as well as our collection costs, attorneys' fees and court costs related to enforcing your obligations under the Contract. Kansas Customers: In areas in which U.S. Cellular receives support from the Federal Universal Service Fund, all reasonable requests for service must be met. Unresolved questions concerning services availability can be directed to the Kansas Corporation Commission Office of Public Affairs and Consumer Protection at 1-800-662-0027. Limited-time offer. Trademarks and trade names are the property of their respective owners. Additional terms apply. See store or uscellular.com for details. &copy;2014 U.S. Cellular
		</p>
	</footer>
<!--[if IE]>
<script src="/bighero6/html5shiv.js"></script>
<script src="/bighero6/html5shiv-printshiv.js"></script>
<!-->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="lib/js/jquery-ui.min.js"></script>
<script src="main.js"></script>