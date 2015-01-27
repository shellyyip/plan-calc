/**
 * @preserve Copyright 2014, Cardinal Path
 *
 * @author Andre Wei <awei@cardinalpath.com>
 */
(function(i,s,o,g,r,a,m){
  i['GoogleAnalyticsObject']=r;
  i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

(function(i,s,o,g,r,a,m){
  a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/plugins/ua/ec.js','ga');


/**
 * USC UA Setup File
 * @preserve Copyright 2014, Cardinal Path
 *
 * @author Andre Wei <awei@cardinalpath.com>
 * version 1.1
 *
 */
  
  if (typeof console === "undefined") {
    window.console = {
      log: function () {}
    };
  }

  var dataLayer = dataLayer || {};
  
  dataLayer.push = dataLayer.slice = function () {};
  
  var _cpua;
  
  var CP_Google_Universal_Analytics = function () {
    
    var self = this;
    this.doc = document;
    this.loc = this.doc.location;
    this.pathname = this.loc.pathname;
    this.query = this.loc.search;
    this.anchor = this.loc.hash;
    
    this.inpage = true;
    
    var _webprop = "UA-32514415-";
    var _domain = "";
    
    if (new RegExp(/149\.122\.16\.76|customeratg-prv\.uscellular\.com|63\.86\.202\.141|awei\.ca|local|127\.0\.0\.1/).test(this.loc.hostname)) {
      _webprop += "4";
    }
    else {
      _webprop += "7";
      
      _domain = (/uscellular\.com$/.test(this.loc.hostname)) ? 'uscellular.com' : 'auto';
    }
    
    var _vpv = "";
    
    var _domLoadedTS = 0;
    var _unloadFired = false;
    var _isLandingPage = false;
    
    //TODO: x-domain tracking
    
    var _xdomains = ['uscellular.com', 'uscellular.scp4me.com', 'uscellular.rewardpromo.com', 'uprepaid-uscellular.net'];
        
    this.init = function () {
      
      var i, currentPageType = '';
      
      // cp_vs is a cookie that persists for 30 minutes so we can tell if a visit has started or not
      self._isLandingPage = (self.readCookie('cp_vs') === null) ? true : false;
      
      self.setVPV();
      
      ga('create', _webprop, {'cookieDomain': 'auto'});
      
      ga('require', 'displayfeatures');
      ga('require', 'ec');
      
      if (dataLayer.page && dataLayer.page.type) {
        currentPageType = dataLayer.page.type;
      }
      
      if (currentPageType === 'order_receipt_page') {
        self.cart.trackTranx();
      } else if ( dataLayer.product && dataLayer.product.id ) {
        self.cart.trackPDP();
      } else if (currentPageType === 'cart_page') {
        self.cart.trackCartPage(self.cart.CART_STEPS.view_cart, dataLayer.cart);
      } else if (currentPageType === 'cart_info_page') {
        self.cart.trackCartPage(self.cart.CART_STEPS.billing_info, dataLayer.cart);
      }
      
      var setObj = {};
      
      ga(function () {
        var custDims = getCustomDims();
        
        for (i = 0; i < custDims.length; i++) {
          setObj['dimension' + custDims[i].slot] = custDims[i].value;
        }
      });
      
      setObj['page'] = _vpv;
      
      ga(function (tracker) {
        var origBuildHitTask = tracker.get('buildHitTask');
        
        tracker.set('buildHitTask', function (model) {
          var fields = ['location', 'page', 'eventCategory', 'eventAction', 'eventLabel'];
          var field;
          
          for (var i = 0; i < fields.length; i++) {
            field = model.get(fields[i]);
            
            if (field && field.indexOf('prepaid') > -1) {
              ga('set', 'dimension10', 'yes');
              break;
            }
          }
          
          origBuildHitTask(model);
        });
      });
      
      // extend the visit started cookie by 30 minutes on every hit
      setObj['hitCallback'] = function () {
        self.createCookie('cp_vs', 'yes', 1800);
      };
      
      ga('set', setObj);
      
      
      ga('send', 'pageview');
      
      ga('require',  'linkid', {'levels': 5});
      
      self.DOMReady(function () {
        if (!window['$']) return;
        
        // add to cart jQuery custom event tracking
        $('body').bind('analytics.add-to-cart', function (e) {
          var data = e.cartInfo;
          var itemType, productBeingAdded, price;
          var items = _cpua.cart.getItems();
          var nameKey, list, prodName = '', brand = '', classification = '';
          var cartInfo = (data.updatedAccount !== undefined) ? data.updatedAccount : data.updatedCartInfo;
          
          // clear items in the cart to prevent double-counting
          _cpua.cart.clearItems();
          
          if (cartInfo !== undefined && cartInfo.lineList !== undefined) {
            for (var i = 0; i < items.length; i++) {
              prodName = '';
              brand = '';
              classification = '';
              productBeingAdded = items[i];
              itemType = productBeingAdded.itemType;
              
              // find associated product name in the list of products in JSON response
              for (var j = 0; j < cartInfo.lineList.length; j++) { 
                var ctnInfo = cartInfo.lineList[j];
                
                if (itemType === 'plan' || itemType === 'device') {
                  nameKey = (itemType === 'plan') ? 'planName' : 'deviceName';
                  
                  if (ctnInfo[itemType] !== null && ctnInfo[itemType] !== undefined && ctnInfo[itemType] !== "") {
                    if (ctnInfo[itemType].prodId === productBeingAdded.id) {
                      prodName = ctnInfo[itemType][nameKey];
                      
                      if (itemType === 'device') {
                        brand = ctnInfo[itemType]['deviceManufacturer'];
                        price = ctnInfo[itemType]['totalDueToday'];
                        classification = (ctnInfo[itemType]['classification']) ? ctnInfo[itemType]['classification'] : '';
                      }
                        
                      break;
                    }
                  }
                }
                else if (itemType === 'feature' || itemType === 'accessory') {
                  list = (itemType === 'feature') ? ctnInfo.features.featureList : ctnInfo.accessories.accessoryList;
                  nameKey = (itemType === 'feature') ? 'category' : 'accessoryName';
                  
                  for (var k = 0; k < list.length; k++) {
                    if (list[k].prodId === productBeingAdded.id) {
                      prodName = list[k][nameKey];
                      classification = ((list[k]['classification']) ? list[k]['classification'] : '');
                      break;
                    }
                  }
                  
                  if (prodName !== '')
                    break;
                }
              }
              
              classification = classification.replace('/', ' - ');
              
              prodName = _cpua.htmlDecode(prodName) + ((productBeingAdded.planType !== '') ? ' - ' + productBeingAdded.planType : '');
              
              ga('ec:addProduct', {
                'id': productBeingAdded.id,
                'name': prodName,
                'category': productBeingAdded.itemType + ((classification !== '') ? '/' + classification  : ''),
                'brand': brand,
                'variant': productBeingAdded.planType,
                'price': price,
                'quantity': productBeingAdded.qty
              });
              ga('ec:setAction', 'add');

              ga('send', 'event', 'cart', 'add to cart', productBeingAdded.itemType + '|' + productBeingAdded.id + '|' + prodName, productBeingAdded.qty);
              
              if (i === 0) {
                // send add to cart vpv
                var vpv = '/vpv/add-to-cart?productId=' + productBeingAdded.id + ((productBeingAdded.planType !== '') ? '&planType=' + productBeingAdded.planType : '');
                
                ga('send', 'page', {'page': vpv});
              }
            }
          }
        });

        // TOS Event        
        if (self._isLandingPage) {
          $(document).ready(function () {
            if (window['performance'])
              self._domLoadedTS = window.performance.timing.domContentLoadedEventStart;
            else
              self._domLoadedTS = new Date().getTime();
          });
          
          $(window).bind('beforeunload.ga', _cpua.trackTOS);
          
          // unbind unload events if submitting forms, clicking on anchor tags
          $('a').live('mousedown', function (e) {
            if ($(this).attr('href') !== '#')
              $(window).unbind('beforeunload.ga');
          });
          
          $('form').live('submit', function (e) {
            $(window).unbind('beforeunload.ga');
          });
        }
      });
    };
    
    this.createCookie = function (name, value, secs) {
      var expires;
      
      if (secs) {
        var date = new Date();
        date.setTime(date.getTime() + (secs*1000));
        expires = "; expires=" + date.toGMTString();
      }
      else expires = "";
      
      var domain = (_domain !== '') ? 'domain=' + _domain + ';' : '';
        
      document.cookie = name + "=" + value + expires + "; path=/; " + domain;
    };

    this.readCookie = function (name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      
      for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)===' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
      }
      
      return null;
    };

    this.eraseCookie = function (name) {
      self.createCookie(name,"",-1);
    };
    
    this.DOMReady = function (callback) {
      var scp = this;
      function cb() {
        if (cb.done) return;
        cb.done = true;
        callback.apply(scp, arguments);
      }
      
      if (/^(interactive|complete)/.test(document.readyState)) return cb();
      this.addEventListener(document, 'DOMContentLoaded', cb);
      this.addEventListener(window, 'load', cb);
    };
    
    this.addEventListener = function ( obj, type, fn ) {
      if ( obj.attachEvent ) {
        obj['e'+type+fn] = fn;
        obj[type+fn] = function(){obj['e'+type+fn]( window.event );};
        obj.attachEvent( 'on'+type, obj[type+fn] );
      } else
        obj.addEventListener( type, fn, false );
    };
    
    this.removeEventListener = function ( obj, type, fn ) {
      if ( obj.detachEvent ) {
        obj.detachEvent( 'on'+type, obj[type+fn] );
        obj[type+fn] = null;
      } else
        obj.removeEventListener( type, fn, false );
    };
    
    this.getQueryParam = function (q) {
      var match = document.location.search.match(q + '=([^&]*)');

      if (match === null)
        return null;
      else
        return match[1];
    };
    
    this.htmlDecode = function (val) {
      var regex = new RegExp(/(&\w+;|<\/?\w+>)/);
      var el;
      while (regex.test(val)) {
        el = document.createElement('div');
        el.innerHTML = val;
        val = getText(el);
      }
      
      return val;
    };
    
    this.getGAPage = function () {
      var page = _vpv;
      var query = self.query;
      
      if (_vpv === '') {
        query = query.replace(/(\?|&)(_requestid|cm_\w+)=[^&]+/g, '').replace(/^&(.*)/, "?$1");
        page = document.location.pathname + query;
      }
      
      return page;
    };
    
    this.setVPV = function (overrideVPV) {
      var vpv = "";
      var planType = "";
      var FT_params = "";
      var FT_query = "";
      var q;
      
      if (typeof overrideVPV === 'string') {
        vpv = overrideVPV;
      } else if (typeof dataLayer.page === 'object') {  
        switch (dataLayer.page.type) {
          case 'error_page':  
            vpv = '/error_pages/' + dataLayer.page.error_code + '.html?page=' + self.pathname + self.query + '&from=' + self.doc.referrer;
            break;
          case 'phone_listing_page':
            vpv = self.pathname + self.query;
            vpv += ((self.query !== '') ? '&' : '?') + "planType=" + dataLayer.product.contract_type;
            break;
          case 'phone_details_page':
            vpv = self.pathname + "?productId=" + dataLayer.product.id + '&planType=' + dataLayer.product.contract_type;
            break;
          case 'plans_page':
            vpv = self.pathname + self.query + ((self.query !== '') ? '&' : '?') + 'planType=' + ((dataLayer.product.plan_type === 'prepaid') ? 'prepaid' : 'postpaid');
            break;
        }
      }
      else {
        // BV reviews URL
        if (self.pathname === '/rnr/write_review.html') {
          vpv = self.pathname + "?bvproductid=" + self.getQueryParam('bvproductid');
        }
        // my account dashboard
        else if (self.pathname === '/uscellular/myaccount/dashBoard.jsp') {
          vpv = self.pathname;
        }
        // default cleanup of urls
        else {
          if (new RegExp(/sf\d+=1/).test(self.query)) {
            q = self.query.replace(/(.*)sf\d+=1&?(.*)/, "$1$2");

            if (new RegExp(/[\?&]$/).test(q))
              q = q.substring(0, q.length - 1);
            
            vpv = self.pathname + q;
          }
        }
      }
      
      _vpv = vpv;
      
      if (_vpv !== '') {
      
        // add back in the FT_Params into VPV
        if ((FT_params = self.query.match(/(FT_(?:Test)?Param(?:IDs|sPix)?=[^&]*)/g)) !== null) {
          FT_query = FT_params.join('&');
          
          _vpv += ((_vpv.indexOf('?') > -1) ? '&' : '?') + FT_query;
        }
      }
    };
    
    var Cart = function () {
      var _cart = this;
      var _items = [];
      this.CART_STEPS = {
      "view_cart": "1",
      "billing_info": "2",
      "credit_review": "3",
      "payment_info": "4",
      "phone_transfer": "5",
      "review": "6"
    };
    
      this.addItem = function (id, planType, itemType, qty) {
        // remove duplicate id's so add to cart not processed twice - not applicable to features
        
        if (itemType.indexOf('feature') === -1) {
          
          for (var i = 0; i < _items.length; i++) {
            if (_items[i].id === id) {
              _items.splice(i, 1);
              break;
            }
          }
        }
        
        _items.push({id: id, planType: planType, itemType: itemType, qty: qty});
      };
      
      this.getItems = function () {
        return _items;
      };
      
      this.clearItems = function () {
        _items = [];
      };
      
      this.trackCartPage = function (step, cart) {
        
        if (cart === undefined) return;
        
        this.addProducts(cart.product, cart.total_lines, false);
        
        ga('ec:setAction','checkout', {'step': step});
      };
      
      this.trackPDP = function () {
        var product = dataLayer.product;
        
        var cat = 'unknown';
        var pageType = dataLayer.page.type;
        var name = '';
        var contractType = '';
        var classification = ((product.classification) ? '/' + product.classification : '').replace('/', ' - ');
        
        if (pageType === 'plans_details_page') {
          cat = 'plans';
          contractType = product.plan_type;
        } else if (pageType === 'phone_details_page') {
          cat = 'devices';
          contractType = product.contract_type;
        }
        
        ga('ec:addProduct', {
          'id': product.id,
          'name': self.htmlDecode(product.name) + ((contractType !== '') ? ' - ' + contractType : ''),
          'category': cat + classification,
          'brand': ((product.manufacturer) ? product.manufacturer : '')
        });

        ga('ec:setAction', 'detail');
      };
      
      this.trackTranx = function () {
        
        var cart = dataLayer.cart;
        var i, rewardsPts, orderPromoCode = '';
        
        var orderid = ((dataLayer.user.userid === '') ? '' : 'customer-') + cart.orderid;
        
        rewardsPts = parseInt(cart.rewards_points_used);
        
        ga('set', {
          'metric1': cart.total_lines, // total lines CM
          'dimension14': (isNaN(rewardsPts) || rewardsPts === 0) ? 'no' : 'yes', // rewards pts used on this tranx
          'metric2': (isNaN(rewardsPts) || rewardsPts === 0) ? '0' : rewardsPts.toString(), // total rewards pts used
          'dimension16': (cart.is_number_transfer) ? cart.is_number_transfer : 'not set' // number transfer
        });
        
        
        try {
          
          this.addProducts(cart.product, cart.total_lines, true);
          
          // fix for data layer
          // if the order-level promo code is available, use that instead of the product promo code
          
          for (i = 0; i < cart.product.length; i++) {
            var product = cart.product[i];
            
            if (product.promo_code !== "" && product.promo_code !== undefined) {
              orderPromoCode = product.promo_code;
              break;
            }
          }
          
          if (cart.promo_code !== '')
            orderPromoCode = cart.promo_code;
            
          ga('ec:setAction', 'purchase', {
            id: orderid,
            affiliation: '',
            revenue: cart.total,
            tax: cart.taxes,
            shipping: cart.shipping,
            coupon: orderPromoCode
          });
          
          var purchaseType = (dataLayer.user.userid === '') ? 'cp_purchase_new' : 'cp_purchase_existing';
          
          //self.trackUniqueAction24Hr(purchaseType);
        } catch (err) {ga('send', 'event', 'errors', 'ecomm', err.message);}
      };
      
      this.addProducts = function (products, total_lines, isTranx) {
        var i, l , product, price, prodName, qty, prodRewardsPts, prodActivationFee, prodClassification, gaProd;
        
        /* hack for data layer bug where shared data plans get reported as 2 line items
         * in the cart object.  The first is qty 1 with the proper monthly pricing.  The second is the remaining qty of lines and monthly pricing of zero
         * Fix is to loop through all products and aggregate the price and send @ the end
         */
        
        if (isTranx === undefined)
          isTranx = false;
          
        var sharedDataPlan = {  price: 0,
                    qty: 0,
                    activationFee: 0,
                    connectionFee: 0,
                    category: 'plans',
                    prodName: '',
                    id: ''};
        
        var activationFee = {   qty: 0,
                    price: 0};
                    
        for (i = 0, l = products.length; i < l; i++) {
          
          product = products[i];
          
          if (product.monthly_price !== '0.00')
            price = product.monthly_price;
          else if (product.unit_sale_price !== '0.00')
            price = product.unit_sale_price;
          else
            price = product.unit_price;
          
          prodName =  self.htmlDecode(product.name) + ((product.contract_type !== '') ? ' - ' + product.contract_type : '');
          
          // business would like to divide shared data price by # lines & report qty as # of lines
          if (product.plan_type === 'shared') {
            price = Math.round(price/total_lines * 100)/100;
            qty = total_lines;
          }
          else
            qty = product.quantity;
          
          prodRewardsPts = parseInt(product.rewards_points_used);
          
          prodClassification = ((product.classification && product.classification !== '') ? '/' + product.classification : '').replace('/', ' - ');
          
          if (product.plan_type === 'shared') {
            sharedDataPlan.id = product.id;
            sharedDataPlan.price += (!isNaN(parseFloat(price))) ? parseFloat(price) : 0;
            sharedDataPlan.qty = total_lines;
            sharedDataPlan.prodName = prodName;
          }
          else {
            gaProd = {
              'id': product.id,
              'name': prodName,
              'category': product.category + prodClassification,
              'brand': product.manufacturer,
              'variant': '',
              'price': price,
              'quantity': qty
            };
            
            if (isTranx) {
              
              gaProd.coupon = product.promo_code;
              gaProd.dimension15 = (isNaN(prodRewardsPts) || prodRewardsPts === 0) ? 'no' : 'yes'; // rewards pts used on this prod
              gaProd.metric3 = (isNaN(prodRewardsPts) || prodRewardsPts === 0) ? '0' : prodRewardsPts.toString(); // total rewards pts used on this prod
            }
            
            ga('ec:addProduct', gaProd);
          }
          
          prodActivationFee = parseFloat(product.activation_fee);
          
          if (!isNaN(prodActivationFee) && prodActivationFee > 0) {
            activationFee.qty += 1;
            activationFee.price += prodActivationFee;
          }
        }
        
        if (sharedDataPlan.id !== '') {
          ga('ec:addProduct', {
            'id': sharedDataPlan.id,
            'name': sharedDataPlan.prodName,
            'category': sharedDataPlan.category,
            'brand': '',
            'variant': '',
            'price': sharedDataPlan.price,
            'quantity': sharedDataPlan.qty
          });
        }
        
        if (activationFee.qty > 0) {
          ga('ec:addProduct', {
            'id': 'activation-fee',
            'name': 'activation fee',
            'category': 'fees',
            'brand': '',
            'variant': '',
            'price': activationFee.price,
            'quantity': activationFee.qty
          });
        }
      };
    };
    
    this.cart = new Cart();
    
    var Storage = function () {
    
      var storage = (typeof(Storage)!=="undefined") ? true : false;
      
      this.setItem =  function (key, val, engine) {
        if (storage) {
          if (engine === 'session')
            sessionStorage.setItem(key, val);
          else
            localStorage.setItem(key, val);
        }
        else {
          if (engine === 'session')
            self.createCookie(key, val);
          else
            self.createCookie(key, val, 3650);
        }
      };
      
      this.getItem = function (key, engine) {
        if (storage) {
          if (engine === 'session')
            return sessionStorage.getItem(key);
          else
            return localStorage.getItem(key);
        }
        else {
          return self.readCookie(key);
        }
      };
      
      this.removeItem = function (key, engine) {
        if (storage) {
          if (engine === 'session')
            sessionStorage.removeItem(key);
          else
            localStorage.removeItem(key);
        }
        else {
          if (engine === 'session')
            self.eraseCookie(key);
          else
            self.eraseCookie(key);
        }
      };
    };
    
    this.storage = new Storage();
    
    this.trackTOS = function () {
      if (!self._unloadFired) {
        var unloadTS = new Date().getTime();
        
        var TOS = (unloadTS - self._domLoadedTS)/1000;
        var bucket = '';
        
        // inactive for more than 30 minutes
        if (TOS >= 1800)
          return;
        
        TOS = Math.floor(TOS);
        
        self._unloadFired = true;
        
        switch (true) {
          case (TOS <= 15):
            bucket = '0:00 to 0:15';
            break;
          case (TOS <= 30):
            bucket = '0:15 to 0:30';
            break;
          case (TOS <= 60):
            bucket = '0:30 to 1:00';
            break;
          case (TOS <= 90):
            bucket = '1:00 to 1:30';
            break;
          case (TOS <= 120):
            bucket = '1:30 to 2:00';
            break;
          case (TOS <= 150):
            bucket = '2:00 to 2:30';
            break;
          case (TOS <= 180):
            bucket = '2:30 to 3:00';
            break;
          case (TOS <= 210):
            bucket = '3:00 to 3:30';
            break;
          case (TOS <= 240):
            bucket = '3:30 to 4:00';
            break;
          case (TOS <= 270):
            bucket = '4:00 to 4:30';
            break;
          case (TOS <= 300):
            bucket = '4:30 to 5:00';
            break;
          case (TOS <= 600):
            bucket = '5:00 to 10:00';
            break;
          default:
            bucket = '10:00+';
            TOS = 0;
            break;
        }
        
        ga('send', 'event', 'Bounced Visits - Time on Page', bucket, self.getGAPage(), TOS, true);
      }
    };
    
    /* function courtesy of jQuery */
    function getText( elem ) {
      var i, node,
        nodeType = elem.nodeType,
        rReturn = /\r\n/g,
        ret = "";

      if ( nodeType ) {
        if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
          // Use textContent || innerText for elements
          if ( typeof elem.textContent === 'string' ) {
            return elem.textContent;
          } else if ( typeof elem.innerText === 'string' ) {
            // Replace IE's carriage returns
            return elem.innerText.replace( rReturn, '' );
          } else {
            // Traverse it's children
            for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
              ret += getText( elem );
            }
          }
        } else if ( nodeType === 3 || nodeType === 4 ) {
          return elem.nodeValue;
        }
      } else {

        // If no nodeType, this is expected to be an array
        for ( i = 0; (node = elem[i]); i++ ) {
          // Do not traverse comment nodes
          if ( node.nodeType !== 8 ) {
            ret += getText( node );
          }
        }
      }
      return ret;
    }
    
    // define custom variables to track on page load
    function getCustomDims() {
      var dims = [];
      
      // client id
      
      var tracker = ga.getByName('t0');
        
      dims.push(  {slot: 11, value: tracker.get('clientId')} );
      
      if (typeof dataLayer.user === 'object') {
        
        var loggedIn = 'not logged in';
        var ban = 'not set';
        var userID = 'not set';
        
        if (dataLayer.user.userid) {
          userID = dataLayer.user.userid;
          loggedIn = 'logged in';
                
        }
        
        dims.push(  {slot: 1, value: userID},
              {slot: 4, value: loggedIn});
        
        if (dataLayer.user.ban) {
          ban = dataLayer.user.ban;
        }
        
        dims.push({slot: 2, value: ban});
        
      }
      
      // FlashTalking parameters
      var ft_paramid = self.getQueryParam('FT_ParamIDs');

      // check if FT parameters exist but missing '?' so it's a part of the pathname
      if (ft_paramid === null) {
        ft_paramid = self.pathname.match(/FT_ParamIDs=([^&]*)/);
        
        if (ft_paramid)
          ft_paramid = ft_paramid[1];
      }
      
      if (ft_paramid !== null) {
        dims.push(  {slot: 8, value: ft_paramid},
              {slot: 9, value: ft_paramid});
      }
      
      // Internal promos
      
      var cm_re = self.getQueryParam('cm_re');
      if (cm_re !== null)
        dims.push({slot: 3, value: cm_re});
      
      var purchaser = 'no';
      
      // purchaser - set on confirmation pages
      if (dataLayer.page && dataLayer.page.type === 'order_receipt_page') {
        purchaser = 'yes';
      }
      
      dims.push({slot: 5, value: purchaser});
      
      // page tracking
      dims.push({slot: 17, value: self.pathname + self.query + self.anchor});
      
      return dims;
    }
    
    
  };
  
  
  try {
    _cpua = new CP_Google_Universal_Analytics();
    _cpua.init();
  } catch (err) {console.log(err);}
/**
 * @preserve Copyright 2011, Cardinal Path and DigitalInc.
 *
 * GAS - Google Analytics on Steroids
 * https://github.com/CardinalPath/gas
 *
 * @author Eduardo Cereto <eduardocereto@gmail.com>
 * Licensed under the GPLv3 license.
 */
(function(a,b){function n(){var a=this;a.version="1.8",a._accounts={},a._accounts_length=0,a._queue=d,a._default_tracker="_gas1",a.gh={},a._hooks={_addHook:[a._addHook]},a.push(function(){a.gh=new c})}function o(a){return a===_gas._default_tracker?"":a+"."}function p(b){if(_gas.debug_mode)try{console.log(b)}catch(c){}return a._gaq.push(b)}function q(a,b){if(typeof a!="string")return!1;var c=a.split("?")[0];return c=c.split("."),c=c[c.length-1],c&&this.inArray(b,c)?c:!1}function s(a){while(a&&a.nodeName!=="HTML"){if(a.nodeName==="FORM")break;a=a.parentNode}return a.nodeName==="FORM"?a.name||a.id||"none":"none"}function u(a){_gas.push(["_trackEvent",this.tagName,a.type,this.currentSrc])}function z(){return a.innerHeight||m.clientHeight||e.body.clientHeight||0}function A(){return a.pageYOffset||e.body.scrollTop||m.scrollTop||0}function B(){return Math.max(e.body.scrollHeight||0,m.scrollHeight||0,e.body.offsetHeight||0,m.offsetHeight||0,e.body.clientHeight||0,m.clientHeight||0)}function C(){return(A()+z())/B()*100}function F(a){D&&clearTimeout(D);if(a===!0){E=Math.max(C(),E);return}D=setTimeout(function(){E=Math.max(C(),E)},400)}function G(){F(!0),E=Math.floor(E);if(E<=0||E>100)return;var a=(E>10?1:0)*(Math.floor((E-1)/10)*10+1);a=String(a)+"-"+String(Math.ceil(E/10)*10),_gas.push(["_trackEvent",H.category,l,a,Math.floor(E),!0])}function I(b){if(!!this._maxScrollTracked)return;this._maxScrollTracked=!0,H=b||{},H.category=H.category||"Max Scroll",this._addEventListener(a,"scroll",F),this._addEventListener(a,"beforeunload",G)}function L(a){if(!this._multidomainTracked){this._multidomainTracked=!0;var b=e.location.hostname,c=this,d,f,g,h=e.getElementsByTagName("a");a!=="now"&&a!=="mousedown"&&(a="click");for(d=0;d<h.length;d++){g=h[d];if(k.call(g.href,"http")===0){if(g.hostname==b||k.call(g.hostname,K)>=0)continue;for(f=0;f<J.length;f++)k.call(g.hostname,J[f])>=0&&(a==="now"?g.href=c.tracker._getLinkerUrl(g.href,_gas._allowAnchor):a==="click"?this._addEventListener(g,a,function(a){return _gas.push(["_link",this.href,_gas._allowAnchor]),a.preventDefault?a.preventDefault():a.returnValue=!1,!1}):this._addEventListener(g,a,function(){this.href=c.tracker._getLinkerUrl(this.href,_gas._allowAnchor)}))}}return!1}return}function R(a){P[a.player_id]||(P[a.player_id]={},P[a.player_id].timeTriggers=i.call(O));if(P[a.player_id].timeTriggers.length>0&&a.data.percent*100>=P[a.player_id].timeTriggers[0]){var b=P[a.player_id].timeTriggers.shift();_gas.push(["_trackEvent","Vimeo Video",b+"%",Q[a.player_id]])}}function S(a,b,c){if(!c.contentWindow||!c.contentWindow.postMessage||!JSON)return!1;var d=c.getAttribute("src").split("?")[0],e=JSON.stringify({method:a,value:b});return c.contentWindow.postMessage(e,d),!0}function V(a){if(k.call(a.origin,"//player.vimeo.com")>-1){var b=JSON.parse(a.data);b.event==="ready"?W.call(_gas.gh):b.method?b.method=="getVideoUrl"&&(Q[b.player_id]=b.value):b.event==="playProgress"?R(b):_gas.push(["_trackEvent",U.category,b.event,Q[b.player_id]])}}function W(){var b=e.getElementsByTagName("iframe"),c=0,d,f,g,h=U.force,i=U.percentages;for(var j=0;j<b.length;j++)if(k.call(b[j].src,"//player.vimeo.com")>-1){d="gas_vimeo_"+j,f=b[j].src,g="?",k.call(f,"?")>-1&&(g="&");if(k.call(f,"api=1")<0){if(!h)continue;f+=g+"api=1&player_id="+d}else k.call(f,"player_id=")<-1&&(f+=g+"player_id="+d);c++,b[j].id=d;if(b[j].src!==f){b[j].src=f;break}S("getVideoUrl","",b[j]),S("addEventListener","play",b[j]),S("addEventListener","pause",b[j]),S("addEventListener","finish",b[j]),i&&(O=i,S("addEventListener","playProgress",b[j]))}c>0&&T===!1&&(this._addEventListener(a,"message",V,!1),T=!0)}function _(a){if(Y&&Y.length){var b=a.getVideoData().video_id;$[b]?bb(a):($[b]={},$[b].timeTriggers=i.call(Y)),$[b].timer=setTimeout(ab,1e3,a,b)}}function ab(a,c){if($[c]==b||$[c].timeTriggers.length<=0)return!1;var d=a.getCurrentTime()/a.getDuration()*100;if(d>=$[c].timeTriggers[0]){var e=$[c].timeTriggers.shift();_gas.push(["_trackEvent",Z.category,e+"%",a.getVideoUrl()])}$[c].timer=setTimeout(ab,1e3,a,c)}function bb(a){var b=a.getVideoData().video_id;$[b]&&$[b].timer&&(ab(a,b),clearTimeout($[b].timer))}function cb(a){var b="";switch(a.data){case 0:b="finish",bb(a.target);break;case 1:b="play",_(a.target);break;case 2:b="pause",bb(a.target)}b&&_gas.push(["_trackEvent",Z.category,b,a.target.getVideoUrl()])}function db(a){_gas.push(["_trackEvent",Z.category,"error ("+a.data+")",a.target.getVideoUrl()])}function eb(){var a=e.getElementsByTagName("object"),b,c,d,f=/(https?:\/\/www\.youtube(-nocookie)?\.com[^/]*).*\/v\/([^&?]+)/;for(var g=0;g<a.length;g++){b=a[g].getElementsByTagName("param");for(var h=0;h<b.length;h++)if(b[h].name=="movie"&&b[h].value){d=b[h].value.match(f),d&&d[1]&&d[3]&&(c=e.createElement("iframe"),c.src=d[1]+"/embed/"+d[3]+"?enablejsapi=1",c.width=a[g].width,c.height=a[g].height,c.setAttribute("frameBorder","0"),c.setAttribute("allowfullscreen",""),a[g].parentNode.insertBefore(c,a[g]),a[g].parentNode.removeChild(a[g]),g--);break}}}function fb(b){var c=b.force,d=b.percentages;if(c)try{eb()}catch(f){_gas.push(["_trackException",f,"GAS Error on youtube.js:_ytMigrateObjectEmbed"])}var g=[],h=e.getElementsByTagName("iframe");for(var i=0;i<h.length;i++)if(k.call(h[i].src,"//www.youtube.com/embed")>-1){if(k.call(h[i].src,"enablejsapi=1")<0){if(!c)continue;k.call(h[i].src,"?")<0?h[i].src+="?enablejsapi=1":h[i].src+="&enablejsapi=1"}g.push(h[i])}if(g.length>0){d&&d.length&&(Y=d),a.onYouTubePlayerAPIReady=function(){var b;for(var c=0;c<g.length;c++)b=new a.YT.Player(g[c]),b.addEventListener("onStateChange",cb),b.addEventListener("onError",db)};var j=e.createElement("script"),l="http:";e.location.protocol==="https:"&&(l="https:"),j.src=l+"//www.youtube.com/player_api",j.type="text/javascript",j.async=!0;var m=e.getElementsByTagName("script")[0];m.parentNode.insertBefore(j,m)}}var c=function(){this._setDummyTracker()};c.prototype._setDummyTracker=function(){if(!this.tracker){var b=a._gat._getTrackers();b.length>0&&(this.tracker=b[0])}},c.prototype.inArray=function(a,b){if(a&&a.length)for(var c=0;c<a.length;c++)if(a[c]===b)return!0;return!1},c.prototype._sanitizeString=function(a,b){return a=a.toLowerCase().replace(/^\ +/,"").replace(/\ +$/,"").replace(/\s+/g,"_").replace(/[Ã¡ï¿½ Ã¢Ã£Ã¥Ã¤Ã¦Âª]/g,"a").replace(/[Ã©Ã¨ÃªÃ«Ð„â‚¬]/g,"e").replace(/[Ã­Ã¬Ã®Ã¯]/g,"i").replace(/[Ã³Ã²Ã´ÃµÃ¶Ã¸Âº]/g,"o").replace(/[ÃºÃ¹Ã»Ã¼]/g,"u").replace(/[Ã§Â¢Â©]/g,"c"),b&&(a=a.replace(/[^a-z0-9_-]/g,"_")),a.replace(/_+/g,"_")},c.prototype._addEventListener=function(b,c,d,e){var f=function(c){if(!c||!c.target)c=a.event,c.target=c.srcElement;return d.call(b,c)};return b.addEventListener?(b.addEventListener(c,f,!!e),!0):b.attachEvent?b.attachEvent("on"+c,f):(c="on"+c,typeof b[c]=="function"&&(f=function(a,b){return function(){a.apply(this,arguments),b.apply(this,arguments)}}(b[c],f)),b[c]=f,!0)},c.prototype._liveEvent=function(a,b,c){var d=this;a=a.toUpperCase(),a=a.split(","),d._addEventListener(e,b,function(b){for(var e=b.target;e.nodeName!=="HTML";e=e.parentNode)if(d.inArray(a,e.nodeName)||e.parentNode===null)break;e&&d.inArray(a,e.nodeName)&&c.call(e,b)},!0)},c.prototype._DOMReady=function(b){var c=this,d=function(){if(arguments.callee.done)return;arguments.callee.done=!0,b.apply(c,arguments)};if(/^(interactive|complete)/.test(e.readyState))return d();this._addEventListener(e,"DOMContentLoaded",d,!1),this._addEventListener(a,"load",d,!1)},a._gaq=a._gaq||[];var d=a._gas||[];if(d._accounts_length>=0)return;var e=a.document,f=Object.prototype.toString,g=Object.prototype.hasOwnProperty,h=Array.prototype.push,i=Array.prototype.slice,j=String.prototype.trim,k=String.prototype.indexOf,l=e.location.href,m=e.documentElement;n.prototype._addHook=function(a,b){return typeof a=="string"&&typeof b=="function"&&(typeof _gas._hooks[a]=="undefined"&&(_gas._hooks[a]=[]),_gas._hooks[a].push(b)),!1},n.prototype._execute=function(){var a=i.call(arguments),c=this,d=a.shift(),e=!0,f,h,j,l,m,n=0;if(typeof d=="function")return p(function(a,b){return function(){a.call(b)}}(d,c.gh));if(typeof d=="object"&&d.length>0){h=d.shift(),k.call(h,".")>=0?(l=h.split(".")[0],h=h.split(".")[1]):l=b,j=c._hooks[h];if(j&&j.length>0)for(f=0;f<j.length;f++)try{m=j[f].apply(c.gh,d),m===!1?e=!1:m&&m.length>0&&(d=m)}catch(q){h!=="_trackException"&&c.push(["_trackException",q])}if(e===!1)return 1;if(h==="_setAccount"){for(f in c._accounts)if(c._accounts[f]==d[0]&&l===b)return 1;return l=l||"_gas"+String(c._accounts_length+1),typeof c._accounts["_gas1"]=="undefined"&&k.call(l,"_gas")!=-1&&(l="_gas1"),c._accounts[l]=d[0],c._accounts_length+=1,l=o(l),n=p([l+h,d[0]]),c.gh._setDummyTracker(),n}if(h==="_link"||h==="_linkByPost"||h==="_require")return a=i.call(d),a.unshift(h),p(a);var r;if(l&&c._accounts[l])return r=o(l)+h,a=i.call(d),a.unshift(r),p(a);if(c._accounts_length>0){for(f in c._accounts)g.call(c._accounts,f)&&(r=o(f)+h,a=i.call(d),a.unshift(r),n+=p(a));return n?1:0}return a=i.call(d),a.unshift(h),p(a)}},n.prototype.push=function(){var b=this,c=i.call(arguments);for(var d=0;d<c.length;d++)(function(b,c){a._gaq.push(function(){c._execute.call(c,b)})})(c[d],b)},a._gas=_gas=new n,_gas.push(["_addHook","_trackException",function(a,b){return _gas.push(["_trackEvent","Exception "+(a.name||"Error"),b||a.message||a,l]),!1}]),_gas.push(["_addHook","_setDebug",function(a){_gas.debug_mode=!!a}]),_gas.push(["_addHook","_popHook",function(a){var b=_gas._hooks[a];return b&&b.pop&&b.pop(),!1}]),_gas.push(["_addHook","_gasSetDefaultTracker",function(a){return _gas._default_tracker=a,!1}]),_gas.push(["_addHook","_trackPageview",function(){var a=i.call(arguments);return a.length>=2&&typeof a[0]=="string"&&typeof a[1]=="string"?[{page:a[0],title:a[1]}]:a}]);var r=function(a){var b=this;if(!b._downloadTracked){b._downloadTracked=!0,a?typeof a=="string"?a={extensions:a.split(",")}:a.length>=1&&(a={extensions:a}):a={extensions:[]},a.category=a.category||"Download";var c="xls,xlsx,doc,docx,ppt,pptx,pdf,txt,zip";return c+=",rar,7z,exe,wma,mov,avi,wmv,mp3,csv,tsv",c=c.split(","),a.extensions=a.extensions.concat(c),b._liveEvent("a","mousedown",function(c){var d=this;if(d.href){var e=q.call(b,d.href,a.extensions);e&&_gas.push(["_trackEvent",a.category,e,d.href])}}),!1}return};_gas.push(["_addHook","_gasTrackDownloads",r]),_gas.push(["_addHook","_trackDownloads",r]),_gas.push(["_addHook","_trackEvent",function(){var a=i.call(arguments);return a[3]&&(a[3]=(a[3]<0?0:Math.round(a[3]))||0),a}]);var t=function(a){if(!!this._formTracked)return;this._formTracked=!0;var b=this;typeof a!="object"&&(a={}),a.category=a.category||"Form Tracking";var c=function(b){var c=b.target,d=c.name||c.id||c.type||c.nodeName,e=s(c),f="form ("+e+")",g=d+" ("+b.type+")";_gas.push(["_trackEvent",a.category,f,g])};b._DOMReady(function(){var a=["input","select","textarea","hidden"],d=["form"],f=[],g,h;for(g=0;g<a.length;g++){f=e.getElementsByTagName(a[g]);for(h=0;h<f.length;h++)b._addEventListener(f[h],"change",c)}for(g=0;g<d.length;g++){f=e.getElementsByTagName(d[g]);for(h=0;h<f.length;h++)b._addEventListener(f[h],"submit",c)}})};_gas.push(["_addHook","_gasTrackForms",t]),_gas.push(["_addHook","_trackForms",t]);var v=function(a){var b=this;b._liveEvent(a,"play",u),b._liveEvent(a,"pause",u),b._liveEvent(a,"ended",u)},w=function(){if(!!this._videoTracked)return;this._videoTracked=!0,v.call(this,"video")},x=function(){if(!!this._audioTracked)return;this._audioTracked=!0,v.call(this,"audio")};_gas.push(["_addHook","_gasTrackVideo",w]),_gas.push(["_addHook","_gasTrackAudio",x]),_gas.push(["_addHook","_trackVideo",w]),_gas.push(["_addHook","_trackAudio",x]);var y=function(a){if(!this._mailtoTracked)return this._mailtoTracked=!0,a||(a={}),a.category=a.category||"Mailto",this._liveEvent("a","mousedown",function(b){var c=b.target;c&&c.href&&c.href.toLowerCase&&k.call(c.href.toLowerCase(),"mailto:")===0&&_gas.push(["_trackEvent",a.category,c.href.substr(7)])}),!1;return};_gas.push(["_addHook","_gasTrackMailto",y]),_gas.push(["_addHook","_trackMailto",y]);var D=null,E=0,H;_gas.push(["_addHook","_gasTrackMaxScroll",I]),_gas.push(["_addHook","_trackMaxScroll",I]),_gas._allowAnchor=!1,_gas.push(["_addHook","_setAllowAnchor",function(a){_gas._allowAnchor=!!a}]),_gas.push(["_addHook","_link",function(a,c){return c===b&&(c=_gas._allowAnchor),[a,c]}]),_gas.push(["_addHook","_linkByPost",function(a,c){return c===b&&(c=_gas._allowAnchor),[a,c]}]);var J=[],K=b;_gas.push(["_addHook","_setDomainName",function(a){if(k.call("."+e.location.hostname,a)<0)return J.push(a),!1;K=a}]),_gas.push(["_addHook","_addExternalDomainName",function(a){return J.push(a),!1}]);var M=function(){var a=this,b=i.call(arguments);a._DOMReady(function(){L.apply(a,b)})};_gas.push(["_addHook","_gasMultiDomain",M]),_gas.push(["_addHook","_setMultiDomain",M]);var N=function(a){if(!!this._outboundTracked)return;this._outboundTracked=!0;var b=this;a||(a={}),a.category=a.category||"Outbound",b._liveEvent("a","mousedown",function(b){var c=this;if((c.protocol=="http:"||c.protocol=="https:")&&k.call(c.hostname,e.location.hostname)===-1){var d=c.pathname+c.search+"",f=k.call(d,"__utm");f!==-1&&(d=d.substring(0,f)),_gas.push(["_trackEvent",a.category,c.hostname,d])}})};_gas.push(["_addHook","_gasTrackOutboundLinks",N]),_gas.push(["_addHook","_trackOutboundLinks",N]);var O=[],P={},Q={},T=!1,U,X=function(a){var b=this;if(typeof a=="boolean"||a==="force")a={force:!!a};return a=a||{},a.category=a.category||"Vimeo Video",a.percentages=a.percentages||[],a.force=a.force||!1,U=a,b._DOMReady(function(){W.call(b)}),!1};_gas.push(["_addHook","_gasTrackVimeo",X]),_gas.push(["_addHook","_trackVimeo",X]);var Y=[],Z,$={},gb=function(a){var b=i.call(arguments);b[0]&&(typeof b[0]=="boolean"||b[0]==="force")&&(a={force:!!b[0]},b[1]&&b[1].length&&(a.percentages=b[1])),a=a||{},a.force=a.force||!1,a.category=a.category||"YouTube Video",a.percentages=a.percentages||[],Z=a;var c=this;return c._DOMReady(function(){fb.call(c,a)}),!1};_gas.push(["_addHook","_gasTrackYoutube",gb]),_gas.push(["_addHook","_trackYoutube",gb]);while(_gas._queue.length>0)_gas.push(_gas._queue.shift());_gaq&&_gaq.length>=0&&function(){var a=e.createElement("script");a.type="text/javascript",a.async=!0,a.src=("https:"==e.location.protocol?"https://":"http://")+"stats.g.doubleclick.net/dc.js";var b=e.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)}()})(window);

(function() {
  setTimeout(function () {
    if (typeof _gat != 'object') {
      (function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();
    }
  }, 2500);
})();
/**
 * USC GAS Setup File
 * @preserve Copyright 2011, Cardinal Path
 *
 * @author Eduardo Cereto <eduardocereto@gmail.com>
 * version 1.17
 *
 * TODOS:
 * 
 */
 
  var CP_Google_Analytics = function () {
    
    var self = this;
    this.doc = document;
    this.loc = this.doc.location;
    this.pathname = this.loc.pathname;
    this.query = this.loc.search;
    this.anchor = this.loc.hash;
    this.inpage = true;
    
    var _webprop = "UA-32514415-";
    var _domain = "";
    
    if (new RegExp(/149\.122\.16\.76|customeratg-prv\.uscellular\.com|63\.86\.202\.141|awei\.ca/).test(this.loc.hostname)) {
      _webprop += "2";
    }
    else {
      _webprop += "1";
      _domain = "uscellular.com";
    }
    
    var _vpv = "";
    
    // iframes?
    var _trackIframe = "no";
    
    var _domLoadedTS = 0;
    var _unloadFired = false;
    var _isLandingPage;
      
    var _xdomains = ['uscellular.com', 'uscellular.scp4me.com', 'uscellular.rewardpromo.com', 'uprepaid-uscellular.net'];
    
    this.DEFINED_ACTIONS = {
      cp_cart_prospect: 'visit cart - prospective customer',
      cp_cart_existing: 'visit cart - existing customer',
      cp_store_loc: 'visit store locator',
      cp_email_signup: 'sign up for email',
      cp_purchase_new: 'purchase - new customer',
      cp_purchase_existing: 'purchase - existing customer'
    };
    
    this.init = function () {
      
      var query = document.location.search;
      var pathname = document.location.pathname;
      var hostname = document.location.hostname;
      var cookie = document.cookie;
      
      var i, FT_params, FT_query;
      var FT_query = '';
      
      self._isLandingPage = (self.readCookie('__utmb') == null) ? true : false;
      
      self.setVPV();
      
      _gas.push(['_addHook', '_trackEvent', function(cat, act, lab, val, ni) {
        if (typeof cat != 'string' || typeof act != 'string')
          return false;
          
        if (lab === undefined)
          lab = '';
        
        if (val === undefined)
          val = 0;
          
        if (cat == 'Outbound') {
          if (/^(www\.|customer\.)?uscellular\.com/.test(hostname) && /^(www\.|customer\.)?uscellular\.com/.test(act))
            return false;
        }
        
        return [cat, act, lab, val, ni];
      }]);
      
      _gas.push(['_addHook', '_trackPageview', function (vpv) {
        var url = '';
        
        _vpv = vpv;
        
        _gas.push(['cp._set', 'page', vpv]);
        
        if (typeof vpv == 'string')
          url = vpv;
        else
          url = document.location.href;
          
        
        if (url.toLowerCase().indexOf('prepaid') > -1)
          self.setPrepaidCV();
          
        return [vpv];
      }]);
      
      if (self.readCookie('cp-test') != null)
        _webprop = 'UA-32514415-2';
        
      _gas.push(['cp._setAccount', _webprop]);
      
      if (_vpv != '') {
      
        // add back in the FT_Params into VPV
        if ((FT_params = query.match(/(FT_(?:Test)?Param(?:IDs|sPix)?=[^&]*)/g)) != null) {
          for (i in FT_params) {
            FT_query += "&" + FT_params[i];
          }
          
          if (new RegExp(/\?/).test(_vpv))
            _vpv += FT_query;
          else
            _vpv += '?' + FT_query.substring(1, FT_query.length);
        }
      }
      
      if (!/utm_/.test(self.query) && /utm_/.test(self.pathname))
        _gas.push(['cp._set', 'campaignParams', self.pathname]);
      
      _gas.push(['cp._setAllowLinker', true]);
            _gas.push(['cp._setAllowAnchor', true]);
      
            if (_domain != '')
                _gas.push(['cp._setDomainName', _domain]);
            
      for (i in _xdomains)
        _gas.push(['cp._setDomainName', _xdomains[i]]);
        
      //_gas.push(['cp._gasMultiDomain', 'click']);
      
      var custvars = getCustomVars();
      
      for (i in custvars) {
        _gas.push(['cp._setCustomVar', custvars[i].slot, custvars[i].name, custvars[i].value, custvars[i].scope]);
      }
      
      if (window.top == window.self || _trackIframe == "yes") {
      
        
        _gas.push(['_initData']);
        _gas.push(function () {
          
          var id = self.getGAID();
          
          if (id != '')
            _gas.push(['_setCustomVar', 11, 'ga visitor id', id, 2]);
          
          _gas.push(['cp._trackPageview', _vpv]);
          
          if (typeof dataLayer.page != 'undefined') {
            // e-comm tracking
            if (dataLayer.page.type == 'order_receipt_page')
              _gas.push(trackEcomm);
          }
          
          /* BEGIN: DOMReady Calls */
          _gas.gh._DOMReady(function () {
            
            // add to cart jQuery custom event tracking
            $('body').bind('analytics.add-to-cart', function (e) {
              var data = e.cartInfo;
              var itemType, productBeingAdded;
              var items = _cpga.cart.getItems();
              var nameKey, list, prodName = '';
              var cartInfo = (data.updatedAccount != undefined) ? data.updatedAccount : data.updatedCartInfo;
              
              // clear items in the cart to prevent double-counting
              _cpga.cart.clearItems();
              
              if (cartInfo != undefined && cartInfo.lineList != undefined) {
                for (var i = 0; i < items.length; i++) {
                  prodName = '';
                  productBeingAdded = items[i];
                  itemType = productBeingAdded.itemType;
                  
                  // find associated product name in the list of products in JSON response
                  for (var j = 0; j < cartInfo.lineList.length; j++) { 
                    var ctnInfo = cartInfo.lineList[j];
                    
                    if (itemType == 'plan' || itemType == 'device') {
                      nameKey = (itemType == 'plan') ? 'planName' : 'deviceName';
                      
                      if (ctnInfo[itemType] != null && ctnInfo[itemType] != undefined && ctnInfo[itemType] != "") {
                        if (ctnInfo[itemType].prodId == productBeingAdded.id) {
                          prodName = ctnInfo[itemType][nameKey];
                          break;
                        }
                      }
                    }
                    else if (itemType == 'feature' || itemType == 'accessory') {
                      list = (itemType == 'feature') ? ctnInfo.features.featureList : ctnInfo.accessories.accessoryList;
                      nameKey = (itemType == 'feature') ? 'category' : 'accessoryName';
                      
                      for (var k = 0; k < list.length; k++) {
                        if (list[k].prodId == productBeingAdded.id) {
                          prodName = list[k][nameKey];
                          break;
                        }
                      }
                      
                      if (prodName != '')
                        break;
                    }
                  }
                
                  prodName = _cpga.htmlDecode(prodName) + ((productBeingAdded.planType != '') ? ' - ' + productBeingAdded.planType : '');
                  
                  _gas.push(['cp._trackEvent', 'cart', 'add to cart', productBeingAdded.itemType + '|' + productBeingAdded.id + '|' + prodName, productBeingAdded.qty]);
                  
                  if (i == 0) {
                    // send add to cart vpv
                    var vpv = '/vpv/add-to-cart?productId=' + productBeingAdded.id + ((productBeingAdded.planType != '') ? '&planType=' + productBeingAdded.planType : '');
                    
                    _gas.push(['cp._trackPageview', vpv]);
                  }
                }
              }
            });

            // iframe postMessage
            if (!!window.postMessage) {
              $(window).bind('message', function(e) {
                try {
                  data = JSON.parse(e.originalEvent.data);
                  
                  if (typeof data == 'object' && data.GATracking) {
                    _gas.push(data.GATrackingArr);
                  }
                } catch (e) {}
              });
            }
            
            // TOS Event
            
            if (self.isLandingPage()) {
              $(document).ready(function () {
                if (typeof performance == 'object' && typeof performance.timing == 'object')
                  self._domLoadedTS = performance.timing.domContentLoadedEventStart;
                else
                  self._domLoadedTS = new Date().getTime();
              });
              
              $(window).bind('beforeunload.ga', _cpga.trackTOS);
              
              // unbind unload events if submitting forms, clicking on anchor tags
              $('a').live('mousedown', function (e) {
                if ($(this).attr('href') != '#')
                  $(window).unbind('beforeunload.ga');
              });
              
              $('form').live('submit', function (e) {
                $(window).unbind('beforeunload.ga');
              });
            }
          });
          /* END: DOMReady Calls */
        });
      }
      
      _gas.push(['cp._gasTrackOutboundLinks']);
      _gas.push(['cp._gasTrackMailto']);
      _gas.push(['cp._gasTrackDownloads']);
    };
    
    this.getGAID = function () {
      var utma = self.readCookie('__utma');
      var id = '';
      
      if (utma !== null) {
        utma = utma.split('.');
        
        if (utma.length == 6)
          id = utma[1];
      }
      
      return id;
    }
    
    this.setPrepaidCV = function () {
      _gas.push(['cp._setCustomVar', 10, 'interested in prepaid', 'yes', 2]);
    }
    
    this.isLandingPage = function () {
      return self._isLandingPage;
    }
    
    this.createCookie = function (name, value, days) {
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        var expires = "; expires=" + date.toGMTString();
      }
      else var expires = "";
      
      var domain = (_domain != '') ? 'domain=' + _domain + ';' : '';
        
      document.cookie = name + "=" + value + expires + "; path=/; " + domain;
    };

    this.readCookie = function (name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      
      for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      
      return null;
    };

    this.eraseCookie = function (name) {
      self.createCookie(name,"",-1);
    };
    
    this.addEventListener = function ( obj, type, fn ) {
      if ( obj.attachEvent ) {
        obj['e'+type+fn] = fn;
        obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
        obj.attachEvent( 'on'+type, obj[type+fn] );
      } else
        obj.addEventListener( type, fn, false );
    }
    
    this.removeEventListener = function ( obj, type, fn ) {
      if ( obj.detachEvent ) {
        obj.detachEvent( 'on'+type, obj[type+fn] );
        obj[type+fn] = null;
      } else
        obj.removeEventListener( type, fn, false );
    }
    
    this.trackTOS = function () {
      if (!self._unloadFired) {
        var unloadTS = new Date().getTime();
        
        var TOS = (unloadTS - self._domLoadedTS)/1000;
        var bucket = '';
        
        if (self.readCookie('__utmb') == null)
          return;
          
        self._unloadFired = true;
        
        switch (true) {
          case (TOS <= 15):
            bucket = '0:00 to 0:15';
            break;
          case (TOS <= 30):
            bucket = '0:15 to 0:30';
            break;
          case (TOS <= 60):
            bucket = '0:30 to 1:00';
            break;
          case (TOS <= 90):
            bucket = '1:00 to 1:30';
            break;
          case (TOS <= 120):
            bucket = '1:30 to 2:00';
            break;
          case (TOS <= 150):
            bucket = '2:00 to 2:30';
            break;
          case (TOS <= 180):
            bucket = '2:30 to 3:00';
            break;
          case (TOS <= 210):
            bucket = '3:00 to 3:30';
            break;
          case (TOS <= 240):
            bucket = '3:30 to 4:00';
            break;
          case (TOS <= 270):
            bucket = '4:00 to 4:30';
            break;
          case (TOS <= 300):
            bucket = '4:30 to 5:00';
            break;
          case (TOS <= 600):
            bucket = '5:00 to 10:00';
            break;
          default:
            bucket = '10:00+';
            TOS = 0;
            break;
        }
        
        _gas.push(['_trackEvent', 'Bounced Visits - Time on Page', bucket, self.getGAPage(), TOS, true]);
      }
    };
    
    this.trackUniqueAction24Hr = function (act) {
      
      if (act in self.DEFINED_ACTIONS) {
        var cookieVal = self.readCookie(act);
        var campInfo = self.readCookie('__utmz');
        
        if (cookieVal == null || cookieVal != campInfo) {
          _gas.push(['cp._trackEvent', 'unique actions (24 Hr)', self.DEFINED_ACTIONS[act], '', 0, true]);
          self.createCookie(act, campInfo, 1);
        }
      }
    };
    
    this.getGAPage = function () {
      var page = _vpv;
      var query = document.location.search;
      
      if (_vpv == '') {
        query = query.replace(/(\?|&)(_requestid|cm_\w+)=[^&]+/g, '').replace(/^&(.*)/, "?$1");
        page = document.location.pathname + query;
      }
      
      return page;
    };
    
    this.htmlDecode = function (val) {
      var regex = new RegExp(/(&\w+;|<\/?\w+>)/);
      var el;
      while (regex.test(val)) {
        el = document.createElement('div');
        el.innerHTML = val;
        val = getText(el);
      }
      
      return val;
    };
    
    this.setVPV = function (overrideVPV) {
      var sep = "?"
      var vpv = "";
      var planType = "";
      
      if (typeof overrideVPV == 'string') {
        vpv = overrideVPV;
      }
      else if (typeof dataLayer.page == 'object') { 
        switch (dataLayer.page.type) {
          case 'error_page':
            // datalayer incorrect for 404.  returns 200 error code so force to 404
            if (dataLayer.page.error_code == '200')
              dataLayer.page.error_code = '404';
              
            vpv = '/error_pages/' + dataLayer.page.error_code + '.html?page=' + self.pathname + self.query + '&from=' + self.doc.referrer;
            break;
          case 'phone_listing_page':
            if ((!(new RegExp(/https?:\/\/(www\.)?uscellular\.com\//).test(self.doc.referrer)) && self._isLandingPage) ||
              new RegExp(/cm_re=/).test(self.query)) {
              vpv = self.pathname + self.query;
            }
            else {
              vpv = self.pathname;
              var q = self.query.match(/(\?(?:type=phones|phone-selector-sale=1|sort=0&deals-and-offers=device-deals-Web%20Only%20Price|sort=0&device-category=device-category-phone&deals-and-offers=device-deals-Web%20Clearance)(?:&brand-os=[^&]*)?)(?:&_requestid=\d+)?$/);

              if (q != null) {
                vpv += q[1];
              }

            }

            if(vpv.indexOf('?') > -1)
              sep = "&";

            vpv += sep + "planType=" + dataLayer.product.contract_type;
            break;
          case 'phone_details_page':
            vpv = self.pathname + "?productId=" + dataLayer.product.id + '&planType=' + dataLayer.product.contract_type;
            break;
          case 'plans_page':
            if (self.query != '')
                sep = '&';
            
            vpv = self.pathname + self.query + sep + 'planType=' + ((dataLayer.product.plan_type == 'prepaid') ? 'prepaid' : 'postpaid');
            
            break;
        }
      }
      else {
        // BV reviews URL
        if (self.pathname == '/rnr/write_review.html') {
          vpv = self.pathname + "?bvproductid=" + self.getQueryParam('bvproductid')
        }
        // my account dashboard
        else if (self.pathname == '/uscellular/myaccount/dashBoard.jsp') {
          vpv = self.pathname;
        }
        // default cleanup of urls
        else {
          if (new RegExp(/sf\d+=1/).test(self.query)) {
            var q = self.query.replace(/(.*)sf\d+=1&?(.*)/, "$1$2");

            if (new RegExp(/[\?&]$/).test(q))
              q = q.substring(0, q.length - 1);
            
            vpv = pathname + q;
          }
        }
      }
      
      _vpv = vpv;
    }
    
    this.getQueryParam = function (q) {
      var match = document.location.search.match(q + '=([^&]*)');

      if (match === null)
        return null;
      else
        return match[1];
    }
    
    var Cart = function () {
      var _cart = this;
      var _items = [];
      
      this.addItem = function (id, planType, itemType, qty) {
        // todo: remove duplicate id's so add to cart not processed twice
        _items.push({id: id, planType: planType, itemType: itemType, qty: qty});
      };
      
      this.getItems = function () {
        return _items;
      };
      
      this.clearItems = function () {
        _items = [];
      }
    };
    
    this.cart = new Cart();
    
    var Storage = function () {
    
      var storage = (typeof(Storage)!=="undefined") ? true : false;
      
      this.setItem =  function (key, val, engine) {
        if (storage) {
          if (engine == 'session')
            sessionStorage.setItem(key, val);
          else
            localStorage.setItem(key, val);
        }
        else {
          if (engine == 'session')
            _self.createCookie(key, val);
          else
            _self.createCookie(key, val, 3650);
        }
      };
      
      this.getItem = function (key, engine) {
        if (storage) {
          if (engine == 'session')
            return sessionStorage.getItem(key);
          else
            return localStorage.getItem(key);
        }
        else {
          return _self.readCookie(key);
        }
      };
      
      this.removeItem = function (key, engine) {
        if (storage) {
          if (engine == 'session')
            sessionStorage.removeItem(key);
          else
            localStorage.removeItem(key);
        }
        else {
          if (engine == 'session')
            _self.eraseCookie(key);
          else
            _self.eraseCookie(key);
        }
      };
    };
    
    this.storage = new Storage();
    
    /* function courtesy of jQuery */
    getText = function( elem ) {
      var i, node,
        nodeType = elem.nodeType,
        rReturn = /\r\n/g;
        ret = "";

      if ( nodeType ) {
        if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
          // Use textContent || innerText for elements
          if ( typeof elem.textContent === 'string' ) {
            return elem.textContent;
          } else if ( typeof elem.innerText === 'string' ) {
            // Replace IE's carriage returns
            return elem.innerText.replace( rReturn, '' );
          } else {
            // Traverse it's children
            for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
              ret += getText( elem );
            }
          }
        } else if ( nodeType === 3 || nodeType === 4 ) {
          return elem.nodeValue;
        }
      } else {

        // If no nodeType, this is expected to be an array
        for ( i = 0; (node = elem[i]); i++ ) {
          // Do not traverse comment nodes
          if ( node.nodeType !== 8 ) {
            ret += getText( node );
          }
        }
      }
      return ret;
    };
    
    trackEcomm = function () {
      
      var t = _gat._getTrackerByName('cp');
      var cart = dataLayer.cart;
      var product, price, prodName, qty;
      
      var orderid = ((dataLayer.user.userid == '') ? '' : 'customer-') + cart.orderid;
      
      t._setCustomVar(5, 'purchaser', 'yes', 1);
      
      t._addTrans(orderid, "", cart.total, cart.taxes, cart.shipping);
      
      /* hack for data layer bug where shared data plans get reported as 2 line items
       * in the cart object.  The first is qty 1 with the proper monthly pricing.  The second is the remaining qty of lines and monthly pricing of zero
       * Fix is to loop through all products and aggregate the price and send @ the end
       */
      
      var sharedDataPlan = {  price: 0,
                  qty: 0,
                  category: 'plans',
                  prodName: '',
                  id: ''};
      
      for (var i = 0, l = cart.product.length; i < l; i++) {
        product = cart.product[i];
        
        if (product.monthly_price != '0.00')
          price = product.monthly_price;
        else if (product.unit_sale_price != '0.00')
          price = product.unit_sale_price;
        else
          price = product.unit_price;
        
        prodName =  self.htmlDecode(product.name) + ((product.contract_type != '') ? ' - ' + product.contract_type : '');
        
        // business would like to divide shared data price by # lines & report qty as # of lines
        if (product.plan_type == 'shared') {
          price = Math.round(price/cart.total_lines * 100)/100;
          qty = cart.total_lines
        }
        else
          qty = product.quantity;
        
        if (product.plan_type == 'shared') {
          sharedDataPlan.id = product.id;
          sharedDataPlan.price += (!isNaN(parseFloat(price))) ? parseFloat(price) : 0;
          sharedDataPlan.qty = cart.total_lines;
          sharedDataPlan.prodName = prodName;
        }
        else
          t._addItem(orderid, product.id, prodName, product.category, price, qty);
      }
      
      if (sharedDataPlan.id !== '') {
        t._addItem(orderid, sharedDataPlan.id, sharedDataPlan.prodName, sharedDataPlan.category, sharedDataPlan.price, sharedDataPlan.qty);
      }
      
      t._trackTrans();
      
      var purchaseType = (dataLayer.user.userid == '') ? 'cp_purchase_new' : 'cp_purchase_existing';
      
      self.trackUniqueAction24Hr(purchaseType);
    };
    
    // define custom variables to track on page load
    getCustomVars = function () {
      var custvars = [];
      
      if (typeof dataLayer.user == 'object') {
      
        if (dataLayer.user.userid)
          custvars.push({slot: 1, name: 'existing customers', value: dataLayer.user.userid, scope: 1},
             {slot: 4, name: 'login status', value: 'logged in', scope: 2});

        if (dataLayer.user.ban)
          custvars.push({slot: 2, name: 'ban', value: dataLayer.user.ban, scope: 1});
        
      }
      
      // FlashTalking parameters
      var ft_paramid = self.getQueryParam('FT_ParamIDs');

      // check if FT parameters exist but missing '?' so it's a part of the pathname
      if (ft_paramid == null) {
        ft_paramid = self.pathname.match(/FT_ParamIDs=([^&]*)/);
        
        if (ft_paramid)
          ft_paramid = ft_paramid[1];
      }
      
      if (ft_paramid !== null) {
        custvars.push(  {slot: 8, name: 'FT_ParamIDs - visit-level', value: ft_paramid, scope: 2},
                {slot: 9, name: 'FT_ParamIDs - visitor-level', value: ft_paramid, scope: 1});
      }
      
      // Internal promos
      
      var cm_re = self.getQueryParam('cm_re');
      if (cm_re != null)
        custvars.push({slot: 3, name: 'internal promo viewed', value: cm_re, scope: 2});
      
      // purchaser - set on confirmation pages
      // sunday sky id
      // idomoo id
      
      return custvars;
    }
  }

  var _gas = _gas || [];
  
  try {
    _cpga = new CP_Google_Analytics();
    _cpga.init();
  } catch(e) {}