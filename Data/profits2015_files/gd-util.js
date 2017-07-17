if (typeof GDUtil == 'undefined') {
	/**
	 * The GDUtil global namespace object.
	 */
	var GDUtil = {};

	/**
	 * Cross-browser init code adapted from jQuery.onReady();
	 */
	GDUtil.onReady = function(funcOnReady) {
		if (document.addEventListener) {
			document.addEventListener('DOMContentLoaded', funcOnReady, false);
		} else if (document.attachEvent) {
			// ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent("onreadystatechange",
					function() {
						if (document.readyState === 'complete') {
							document.detachEvent('onreadystatechange',
									arguments.callee);
							funcOnReady();
						}
					});

			// If IE and not an iframe - continually check to see if the
			// document is ready
			if ((document.documentElement.doScroll) && (window == window.top)) {
				(function() {
					try {
						// If IE is used, use the trick by Diego Perini
						// (http://javascript.nwbox.com/IEContentLoaded/)
						document.documentElement.doScroll("left");
					} catch (error) {
						setTimeout(arguments.callee, 0);
						return;
					}

					// and execute any waiting functions
					funcOnReady();
				})();
			}
		}
	};

	GDUtil.hasPlaceholderSupport = function() {
		var input = document.createElement('input');
		return ('placeholder' in input);
	};

	// From:
	// http://yordanstoev.com/blog/2012/01/20/no-jquery-html5-placeholder-fix/
	GDUtil.addPlaceholderSupport = function() {
		var placeholderColor = "#939393";
		var inputTextColor = "#000";
		var inputs = document.getElementsByTagName('input');

		for ( var i = 0, count = inputs.length; i < count; i++) {
			if (inputs[i].getAttribute('placeholder')) {

				if (inputs[i].value == "") {
					inputs[i].style.color = placeholderColor;
					inputs[i].value = inputs[i].getAttribute("placeholder");
				}

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
	
	GDUtil.addEvent = function(obj, type, fn) {
		if (obj.attachEvent) {
			obj['e'+type+fn] = fn;
			obj[type+fn] = function() {
								obj['e'+type+fn](window.event);
							};
			obj.attachEvent('on'+type, obj[type+fn]);
		}
		else {
				obj.addEventListener( type, fn, false );
		}
	};
	
	/*
	 * Resolve IE inconsistencies with a DHTML event.  This function should be called within every event handler
	 * to resolve IE/standards discrepancies.  This is NOT necessary with events that come through jQuery.
	 *
	 * @param event		The event that was passed to the event handler.  (For IE, this will be undefined.)
	 *
	 * @return			The event to process.
	 */
	GDUtil.fixEvent = function (event) {
		/*
		 * IE doesn't pass the event to the handler, but rather attaches it to the window.
		 */
		if (!event) {
			event = window.event;
		}
	
		if (event.target) {
			/*
			 * Check to see if the target is a TEXT_NODE, and if so, apply the event to the text node's
			 * parent.
			 */
			if (event.target.nodeType === 3) {
				event.target = event.target.parentNode;
			}
		}
		else if (event.srcElement) {
			/*
			 * srcElement is an IE-only property, and is the equivalent of the 'target' property on
			 * the standard event model.
			 */
			event.target = event.srcElement;
		}
	
		return event;
	};

	/**
	 * Find elements containing the specified 'searchClass' name, as children of
	 * the specified node, and (optionally) limited to the specified tag type.
	 * 
	 * Developed by Robert Nyman, http://www.robertnyman.com Code/licensing:
	 * http://code.google.com/p/getelementsbyclassname/
	 */
	GDUtil.getElementsByClassName = function(className, tag, elm) {
		if (document.getElementsByClassName) {
			getElementsByClassName = function(className, tag, elm) {
				elm = elm || document;
				var elements = elm.getElementsByClassName(className), nodeName = (tag) ? new RegExp(
						"\\b" + tag + "\\b", "i")
						: null, returnElements = [], current;
				for ( var i = 0, il = elements.length; i < il; i += 1) {
					current = elements[i];
					if (!nodeName || nodeName.test(current.nodeName)) {
						returnElements.push(current);
					}
				}
				return returnElements;
			};
		} else if (document.evaluate) {
			getElementsByClassName = function(className, tag, elm) {
				tag = tag || "*";
				elm = elm || document;
				var classes = className.split(" "), classesToCheck = "", xhtmlNamespace = "http://www.w3.org/1999/xhtml", namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace) ? xhtmlNamespace
						: null, returnElements = [], elements, node;
				for ( var j = 0, jl = classes.length; j < jl; j += 1) {
					classesToCheck += "[contains(concat(' ', @class, ' '), ' "
							+ classes[j] + " ')]";
				}
				try {
					elements = document.evaluate(".//" + tag + classesToCheck,
							elm, namespaceResolver, 0, null);
				} catch (e) {
					elements = document.evaluate(".//" + tag + classesToCheck,
							elm, null, 0, null);
				}
				while ((node = elements.iterateNext())) {
					returnElements.push(node);
				}
				return returnElements;
			};
		} else {
			getElementsByClassName = function(className, tag, elm) {
				tag = tag || "*";
				elm = elm || document;
				var classes = className.split(" "), classesToCheck = [], elements = (tag === "*" && elm.all) ? elm.all
						: elm.getElementsByTagName(tag), current, returnElements = [], match;
				for ( var k = 0, kl = classes.length; k < kl; k += 1) {
					classesToCheck.push(new RegExp("(^|\\s)" + classes[k]
							+ "(\\s|$)"));
				}
				for ( var l = 0, ll = elements.length; l < ll; l += 1) {
					current = elements[l];
					match = false;
					for ( var m = 0, ml = classesToCheck.length; m < ml; m += 1) {
						match = classesToCheck[m].test(current.className);
						if (!match) {
							break;
						}
					}
					if (match) {
						returnElements.push(current);
					}
				}
				return returnElements;
			};
		}
		return getElementsByClassName(className, tag, elm);
	};
	
	/*
	 * Add the specified class name to the element.
	 */
	GDUtil.addClass = function(element, className) {
		if ((typeof(element) !== 'object') || (element === null) || !GDUtil.defined(element.className)) {
			return false;
		}
	
		if ((element.className === null) || (element.className === '')) {
			element.className = className;
			return true;
		}
	
		if (GDUtil.hasClass(element, className)) {
			return true;
		}
	
		element.className = element.className + ' ' + className;
	
		return true;
	};
	
	
	/*
	 * Remove the specified class name from the element.
	 */
	GDUtil.removeClass = function(element, className) {
		if ((typeof(element) !== 'object') || (element === null) || !GDUtil.defined(element.className) ||
			(element.className === null)) {
			return false;
		}
	
		if (!GDUtil.hasClass(element, className)) {
			return false;
		}
	
		var		re = new RegExp('(^|\\s+)' + className + '(\\s+|$)');
	
		element.className = element.className.replace(re, ' ');
	
		return true;
	};
	
	
	/*
	 * A wrapper that works around IE 6 & 7 lacking a 'hasAttribute' method.
	 */
	GDUtil.hasAttribute = function(element, name) {
		if (typeof element !== 'object') {
			return false;
		}
	
		if (typeof element.hasAttribute === 'function') {
			return element.hasAttribute(name);
		}
		else {
			var		thisAttr = element.attributes[name];
	
			return !!thisAttr;
		}
	};

	
	// Taken from: http://stackoverflow.com/a/15226442/839847
	GDUtil.hasClass = function( target, className ) {
	    return new RegExp('(\\s|^)' + className + '(\\s|$)').test(target.className);
	};
	
	// Taken from: http://stackoverflow.com/a/12947816/839847
	GDUtil.commaSeparateNumber = function(val){
		while (/(\d+)(\d{3})/.test(val.toString())){
			val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
		}
		return val;
	};
	
	// Taken from: http://stackoverflow.com/a/1026087/839847
	GDUtil.capitalizeFirst = function(string) {
	    return string.charAt(0).toUpperCase() + string.slice(1);
	};
	
	// From: http://stackoverflow.com/a/7592235/839847
	GDUtil.capitalize = function(string) {
	    return string.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
	};
	
	// Taken from: http://stackoverflow.com/a/6163180/839847
	GDUtil.stripSpaces = function(string) {
	    return string.replace(/\s+/g, '');
	};
	
	// Determine if a reference is defined
	GDUtil.defined = function(ref) {
		return (typeof(ref) !== 'undefined');
	};
	
	// Add the following code to add trim functionality to strings in browsers that don't already provide this method (IE8)
	//  From: http://stackoverflow.com/a/2308157/839847
	if(typeof String.prototype.trim !== 'function') {
		String.prototype.trim = function() {
			return this.replace(/^\s+|\s+$/g, ''); 
		};
	}

}
