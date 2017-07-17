/*
 * NOTE NOTE NOTE - in order to make inclusion of this .js easy, it has been placed in the root of htdocs - there should be a copy of this file there...
 */

/*
 * Define a function called 'JobsWidget' and immediately invoke it.
 */
if ( typeof JobsWidget == 'undefined') {
	/**
	 * The JobsWidget global namespace object.
	 */
	var JobsWidget = {};

	// partner id of the partner...
	JobsWidget.partnerId = 6985;

	/**
	 * @const
	 */
	JobsWidget.MAX_HEIGHT = 500;
	JobsWidget.MIN_HEIGHT = 200;
	JobsWidget.MAX_WIDTH = 350;
	JobsWidget.MIN_WIDTH = 217;

	/*
	 * A copy of jQuery's hasClass function
	 */
	JobsWidget.hasClass = function(element, selector) {
		var className = " " + selector + " ";

		if(element) {
			for (var i = 0, l = element.length; i < l; i++) {
				if ((" " + element[i].className + " ").replace(rclass, " ").indexOf(className) > -1) {
					return true;
				}
			}
		}

		return false;
	};
	
	/*
	 * Returns the size of the widget as a map containing 'x' and 'y' values.
	 * 	This assumes that the widget format contains a substring of the format '123x456').
	 * If isDefaultForm is false, the height of the widget is restricted to a minimum height,
	 * 	otherwise the height is whatever value is specified in the URL
	 */
	JobsWidget.getSizeFromFormat = function(fmt, isDefaultForm) {
		var size = {
			x : 300,
			y : 250
		};

		if (fmt) {
			var sizePattern = /(\d+)x(\d+)/i;
			var matchResults = sizePattern.exec(fmt);

			if (matchResults != null) {
				var heightVal = parseInt(matchResults[2]);
				if (isDefaultForm !== true) {
					heightVal = Math.max(JobsWidget.MIN_HEIGHT, Math.min(JobsWidget.MAX_HEIGHT, heightVal));
				}
				var widthVal = Math.max(JobsWidget.MIN_WIDTH, Math.min(JobsWidget.MAX_WIDTH, parseInt(matchResults[1])));

				size = {
					x : widthVal,
					y : heightVal
				};
			}
		}

		return size;
	};

	/*
	 * If the current widget is instantiated without query params,
	 *	the default search form will be displayed.
	 *
	 */
	JobsWidget.isDefaultForm = function(widgetUrl) {
		var qPattern = /(\?|&)(q|e|l|i)\=.*/i;
		var matchResults = qPattern.exec(widgetUrl);

		return matchResults == null;
	};
	
	/*
	 * Initialize a widget object based on its initial (top-level) DOM element.
	 */
	JobsWidget.initialize = function(widget) {
		if (widget.widgetInitialized) {
			return;
		}

		widget.widgetInitialized = true;

		widget.URL = widget.getElementsByTagName('a')[0].href;
		widget.isDefaultForm = JobsWidget.isDefaultForm(widget.URL);

		/*
		 * remove t.a=c & add t.a=i to/from URL
		 *
		 * t.a=c for a click on a link
		 * t.a=i for an impression when we retrieve the embed widget
		 */
		widget.URL = widget.URL.replace('&t.a=c', '');
		widget.URL = widget.URL.replace('?t.a=c', '');
		//in case t.a is first param.

		if (widget.URL.indexOf('&') > 0 || widget.URL.indexOf('=') > 0) {
			widget.URL += '&';
		} else {
			widget.URL += '?';
		}
		widget.URL += 't.a=i';

		/*
		 * Get format, type, size
		 */
		var fmt = JobsWidget.parseUri(widget.URL).queryKey['format'];

		widget.size = JobsWidget.getSizeFromFormat(fmt, widget.isDefaultForm);

		// create main widget div & spinner divs
		widget.mainDiv = JobsWidget.createSpinner(widget);

		// create iframe and set src
		widget.iframe = JobsWidget.createIFrame(widget);

		widget.style.width = widget.size.x + 'px';
		widget.style.height = widget.size.y + 'px';
		widget.style.minWidth = widget.size.x + 'px';
		widget.style.minHeight = widget.size.y + 'px';
		widget.style.maxWidth = widget.size.x + 'px';
		widget.style.maxHeight = widget.size.y + 'px';
		widget.style.marginBottom = '5px';

		/*
		 * clear widget and show spinner
		 */
		widget.innerHTML = '';
		widget.appendChild(widget.mainDiv);
		widget.mainDiv.style.display = 'block';

		// actually kicks off load of iframe
		widget.mainDiv.appendChild(widget.iframe);
	};

	JobsWidget.createSpinner = function(widget) {
		//need protocol, host & port for spinner
		var parsedURL = JobsWidget.parseUri(widget.URL);
		var protocol = parsedURL.protocol;
		var host = parsedURL.host;
		var port = parsedURL.port;

		if (port && !(port == '80' || port == '443')) {
			host += ':' + port;
		}

		var URLprefix = protocol + '://' + host;

		var mainWidgetDiv = document.createElement('div');

		mainWidgetDiv.style.position = 'absolute';
		mainWidgetDiv.style.overflow = 'hidden';
		//ie6 iframe blows out the div w/o this
		mainWidgetDiv.style.width = widget.size.x + 'px';
		mainWidgetDiv.style.height = widget.size.y + 'px';
		mainWidgetDiv.style.backgroundColor = 'transparent';
		mainWidgetDiv.style.textDecoration = 'none';
		mainWidgetDiv.style.border = 'none';
		mainWidgetDiv.style.display = 'none';

		mainWidgetDiv.innerHTML = "<div style='position:relative;width:100%;height:100%;background-color:white;'>" + "<h3 style='padding-top:40px;margin:0;text-align:center;font-family: Arial, sans-serif;font-size:14px;color:black;'>Loading...</h3>" + "<p style='text-align:center;margin-top:15px;'><img height='24' width='24' src='" + URLprefix + "/images/spinner.gif' style='border:none;' /></p>" + "<div style='position: absolute; bottom: 2px; height: auto; width: 100%; background-color: white; color: #aaa'>" + "<p style='margin:0;padding:1px 0 1px 0;font-size:11px;font-family:Arial, sans-serif;color:#aaa;line-height:20px;padding-left:9px;margin-top:2px;padding-top:2px;border-top:1px dotted #aaa;'>" + "&nbsp;" + "<a href='http://www.glassdoor.com?t.p=" + JobsWidget.partnerId + "' target='_pn' style='position: absolute; right: 4px;'>" + "<img alt='glassdoor' style='height:19px;width:80px;border: none; vertical-align:middle;' src='" + URLprefix + "/images/gd-logo-80.png'></a>" + "</p>" + "</div>"; "</div>";

		return mainWidgetDiv;
	};

	JobsWidget.createIFrame = function(widget) {
		/*
		 * create the widget iframe
		 */
		var iframe = document.createElement('iframe');

		iframe.scrolling = 'no';
		iframe.frameborder = '0';

		/*
		 * visibility = 'hidden' -- > FF bug, re: http://www.mail-archive.com/jquery-en@googlegroups.com/msg22450.html
		 */
		iframe.style.visibility = 'hidden';
		iframe.style.border = 'none';
		iframe.style.overflow = 'hidden';
		iframe.style.width = widget.size.x + 'px';
		iframe.style.height = widget.size.y + 'px';

		/*
		 * Add a parameter telling the widget router to return the 'embed' contents, rather than
		 * redirecting to the associated URL.
		 */
		iframe.src = widget.URL + "&type=widget";
		iframe.name = "widgetIFrame";
		iframe.widget = widget;

		if (iframe.addEventListener) {// firefox, safari, chrome, 'real' browsers
			iframe.onload = function() {
				var thisWidget = widget;

				JobsWidget.replaceSpinner(thisWidget);

				// Remove the onload event so form submissions within the iframe won't trigger it
				iframe.onload = null;
			};
		} else if (iframe.attachEvent) {// fracking internet explorer
			iframe.frameBorder = '0';
			var myfunc = function() {
				var thisWidget = widget;

				if (iframe.readyState == 'complete') {
					JobsWidget.replaceSpinner(thisWidget);
					iframe.onreadystatechange = null;
				}
			};

			iframe.onreadystatechange = myfunc;
		}

		return iframe;
	};

	JobsWidget.replaceSpinner = function(widget) {
		// This is the iframe.onload callback
		var mainDiv = widget.mainDiv;

		mainDiv.removeChild(mainDiv.firstChild);
		//	The spinner div is the only child

		widget.iframe.style.visibility = 'visible';
	};

	JobsWidget.generateQueryStr = function($q, $l, $e, $i, $ticker, $title) {
		// Return a query string that will generate a widget.
		// NOTE: We include the
		return "q=" + $q + "&l=" + $l + "&e=" + $e + "&i=" + $i + "&ticker=" + $ticker + "&t=" + $title;
	};

	JobsWidget.refreshWidget = function($q, $l, $e, $i, $ticker, $title) {
		$q = $q ? encodeURIComponent(GDUtil.capitalize($q)) : "";
		$l = $l ? encodeURIComponent(GDUtil.capitalize($l)) : "";
		$e = $e ? encodeURIComponent(GDUtil.capitalize($e)) : "";
		$i = $i ? encodeURIComponent(GDUtil.capitalize($i)) : "";
		$ticker = $ticker ? encodeURIComponent($ticker) : "";
		$title = $title ? encodeURIComponent($title) : "";

		var widgetEl = GDUtil.getElementsByClassName('jobsWidget')[0];

		widgetEl.removeChild(widgetEl.getElementsByTagName('div')[0]);

		// We want to keep the dimensions of the widget because it determines how many job results are displayed
		var widgetHeight = parseInt(widgetEl.style.height);
		var widgetWidth = parseInt(widgetEl.style.width);

		var widgetLink = document.createElement("a");
		widgetLink.setAttribute('href', '/?format=' + widgetWidth + 'x' + widgetHeight + "&" + JobsWidget.generateQueryStr($q, $l, $e, $i, $ticker, $title));
		widgetEl.appendChild(widgetLink);

		widgetEl.widgetInitialized = false;
		JobsWidget.initialize(widgetEl);
	};
	
	/**
	 *	Cross-browser init code adapted from jQuery.onReady();
	 */
	JobsWidget.onReady = function(funcOnReady) {
		if (document.addEventListener) {
			document.addEventListener('DOMContentLoaded', funcOnReady, false);
		} else if (document.attachEvent) {
			// ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent("onreadystatechange", function() {
				if (document.readyState === 'complete') {
					document.detachEvent('onreadystatechange', arguments.callee);
					funcOnReady();
				}
			});

			// If IE and not an iframe - continually check to see if the document is ready
			if ((document.documentElement.doScroll) && (window == window.top)) {
				(function() {
					try {
						// If IE is used, use the trick by Diego Perini (http://javascript.nwbox.com/IEContentLoaded/)
						document.documentElement.doScroll("left");
					} catch( error ) {
						setTimeout(arguments.callee, 0);
						return;
					}

					// and execute any waiting functions
					funcOnReady();
				})();
			}
		}
	};
	
	/**
	 *	parseUri 1.2.1
	 *	http://blog.stevenlevithan.com/archives/parseuri
	 *	(c) 2007 Steven Levithan <stevenlevithan.com>
	 *	MIT License
	 **/
	JobsWidget.parseUri = function(str) {
		var o = JobsWidget.parseUri.options;
		var m = o.parser[o.strictMode ? "strict" : "loose"].exec(str);
		var uri = {};
		var i = 14;

		while (i--) {
			uri[o.key[i]] = m[i] || '';
		}

		uri[o.q.name] = {};
		uri[o.key[12]].replace(o.q.parser, function($0, $1, $2) {
			if ($1) {
				uri[o.q.name][$1] = $2;
			}
		});

		return uri;
	};

	JobsWidget.parseUri.options = {
		strictMode : false,
		key : ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
		q : {
			name : "queryKey",
			parser : /(?:^|&)([^&=]*)=?([^&]*)/g
		},
		parser : {
			strict : /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
			loose : /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
		}
	};

	JobsWidget.hasPlaceholderSupport = function() {
		var input = document.createElement('input');
		return ('placeholder' in input);
	};
	
	// From: http://yordanstoev.com/blog/2012/01/20/no-jquery-html5-placeholder-fix/
	JobsWidget.addPlaceholderSupport = function() {
		var placeholderColor = "#939393";
		var inputTextColor = "#000";
		var inputs = document.getElementsByTagName('input');

		for (var i = 0, count = inputs.length; i < count; i++) {
			if (inputs[i].getAttribute('placeholder')) {
				inputs[i].style.color = placeholderColor;
				inputs[i].value = inputs[i].getAttribute("placeholder");

				inputs[i].onclick = function() {
					if (this.value == this.getAttribute("placeholder")) {
						this.value = '';
						this.style.color = inputTextColor;
					}
				};

				inputs[i].onfocus = inputs[i].onblur = function() {
					if (this.value == '') {
						this.value = this.getAttribute("placeholder");
						this.style.color = placeholderColor;
					} else if (this.value == this.getAttribute("placeholder")) {
						this.value = '';
						this.style.color = inputTextColor;
					} else {
						this.style.color = inputTextColor;
					}
				};
			}
		}
	};

	JobsWidget.initAllWidgets = function() {
		/*
		 * Loop thru elements with classname JobsWidget and create new widget objects.
		 * (We set an attribute ''
		 */

		var widgets = GDUtil.getElementsByClassName('jobsWidget');

		for (var loop = 0; loop < widgets.length; loop++) {
			var thisWidget = widgets[loop];

			if (!thisWidget.gdInitialized) {
				JobsWidget.initialize(thisWidget);
				thisWidget.gdInitialized = 'true';
			}
		}

		if (!window.gdInitialized) {
			/*
			 * We do a second pass at initializing the widgets, just in case any were missed.  We set a
			 * flag on 'window' just to make sure we only do this once.
			 */
			window.gdInitialized = 'true';
			JobsWidget.onReady(JobsWidget.initAllWidgets);
		}
	};
}

JobsWidget.initAllWidgets();
