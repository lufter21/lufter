// global variables
; var browser, elemIsHidden, ajax, animate;

(function() {
	'use strict';
	
	// Get useragent
	document.documentElement.setAttribute('data-useragent', navigator.userAgent.toLowerCase());
	
	// Browser identify
	browser = (function(userAgent) {
		userAgent = userAgent.toLowerCase();
		
		if (/(msie|rv:11\.0)/.test(userAgent)) {
			return 'ie';
		}
	})(navigator.userAgent);
	
	// Add support CustomEvent constructor for IE
	try {
		new CustomEvent("IE has CustomEvent, but doesn't support constructor");
	} catch (e) {
		window.CustomEvent = function(event, params) {
			var evt = document.createEvent("CustomEvent");

			params = params || {
				bubbles: false,
				cancelable: false,
				detail: undefined
			};

			evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
			
			return evt;
		}
		
		CustomEvent.prototype = Object.create(window.Event.prototype);
	}
	
	// Window Resized Event
	const winResizedEvent = new CustomEvent('winResized');
	let rsz = true;
	
	window.addEventListener('resize', function() {
		if (rsz) {
			rsz = false;
			
			setTimeout(function() {
				window.dispatchEvent(winResizedEvent);
				rsz = true;
			}, 1021);
		}
	});
	
	// Closest polyfill
	if (!Element.prototype.closest) {
		(function(ElProto) {
			ElProto.matches = ElProto.matches || ElProto.mozMatchesSelector || ElProto.msMatchesSelector || ElProto.oMatchesSelector || ElProto.webkitMatchesSelector;
			
			ElProto.closest = ElProto.closest || function closest(selector) {
				if (!this) {
					return null;
				}
				
				if (this.matches(selector)) {
					return this;
				}
				
				if (!this.parentElement) {
					return null;
				} else {
					return this.parentElement.closest(selector);
				}
			};
		})(Element.prototype);
	}
	
	// Check element for hidden
	elemIsHidden = function(elem) {
		while (elem) {
			if (!elem) break;
			
			const compStyle = getComputedStyle(elem);
			
			if (compStyle.display == 'none' || compStyle.visibility == 'hidden' || compStyle.opacity == '0') return true;
			
			elem = elem.parentElement;
		}
		
		return false;
	}
	
	// Ajax
	ajax = function(options) {
		const xhr = new XMLHttpRequest();
		
		xhr.open('POST', options.url);
		
		if (typeof options.send == 'string') {
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		}
		
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				options.success(xhr.response);
			} else if (xhr.readyState == 4 && xhr.status != 200) {
				options.error(xhr.response);
			}
		}
		
		xhr.send(options.send);
	}
	
	/*
	Animation
	animate(function(takes 0...1) {}, Int duration in ms[, Str easing[, Fun animation complete]]);
	*/
	animate = function(draw, duration, ease, complete) {
		const start = performance.now();
		
		requestAnimationFrame(function anim(time) {
			let timeFraction = (time - start) / duration;
			
			if (timeFraction > 1) {
				timeFraction = 1;
			}
			
			draw((ease) ? easing(timeFraction, ease) : timeFraction);
			
			if (timeFraction < 1) {
				requestAnimationFrame(anim);
			} else {
				if (complete !== undefined) {
					complete();
				}
			}
		});
	}
	
	function easing(timeFraction, ease) {
		switch (ease) {
			case 'easeInQuad':
			return quad(timeFraction);
			
			case 'easeOutQuad':
			return 1 - quad(1 - timeFraction);
			
			case 'easeInOutQuad':
			if (timeFraction <= 0.5) {
				return quad(2 * timeFraction) / 2;
			} else {
				return (2 - quad(2 * (1 - timeFraction))) / 2;
			}
		}
	}
	
	function quad(timeFraction) {
		return Math.pow(timeFraction, 2)
	}
})();
; var MobNav;

(function() {
	'use strict';

	//fix header
	var headerElem = document.querySelector('.header');

	window.addEventListener('scroll', function() {
		if (window.pageYOffset > 21) {
			headerElem.classList.add('header_fixed');
		} else if (!document.body.classList.contains('popup-is-opened') && !document.body.classList.contains('mob-nav-is-opened')) {
			headerElem.classList.remove('header_fixed');
		}
	});

	//mob menu
	MobNav = {
		options: null,
		winScrollTop: 0,

		fixBody: function(st) {
			if (st) {
				this.winScrollTop = window.pageYOffset;

				document.body.classList.add('mob-nav-is-opened');
				document.body.style.top = -this.winScrollTop +'px';
			} else {
				document.body.classList.remove('mob-nav-is-opened');

				if (this.winScrollTop > 0) {
					window.scrollTo(0, this.winScrollTop);
				}
			}
		},

		open: function(btnElem) {
			var headerElem = document.getElementById(this.options.headerId);

			if (!headerElem) return;

			if (btnElem.classList.contains('opened')) {
				this.close();
			} else {
				btnElem.classList.add('opened');
				headerElem.classList.add('opened');
				this.fixBody(true);
			}
		},

		close: function() {
			var headerElem = document.getElementById(this.options.headerId);

			if (!headerElem) return;

			headerElem.classList.remove('opened');

			var openBtnElements = document.querySelectorAll(this.options.openBtn);

			for (var i = 0; i < openBtnElements.length; i++) {
				openBtnElements[i].classList.remove('opened');
			}

			this.fixBody(false);
		},

		init: function(options) {
			this.options = options;

			document.addEventListener('click', (e) => {
				var openElem = e.target.closest(options.openBtn),
				closeElem = e.target.closest(options.closeBtn),
				menuLinkElement = e.target.closest(options.menuLinkSelector);

				if (openElem) {
					e.preventDefault();
					this.open(openElem);
				} else if (closeElem) {
					e.preventDefault();
					this.close();
				} else if (menuLinkElement) {
					this.close();
				}
			});
		}
	};
})();
/*
* call Menu.init(Str menu item selector, Str sub menu selector);
*/
var Menu;

(function() {
	'use strict';

	Menu = {
		toggle: function(elem, elementStr, subMenuStr) {
			var subMenuElem = elem.querySelector(subMenuStr);

			if (!subMenuElem) {
				return;
			}

			if (elem.classList.contains('active')) {
				subMenuElem.style.height = 0;

				elem.classList.remove('active');
			} else {
				var mainElem = elem.closest('.menu'),
				itemElements = mainElem.querySelectorAll(elementStr),
				subMenuElements = mainElem.querySelectorAll(subMenuStr);

				for (var i = 0; i < itemElements.length; i++) {
					itemElements[i].classList.remove('accord__button_active');
					subMenuElements[i].style.height = 0;
				}

				subMenuElem.style.height = subMenuElem.scrollHeight +'px';

				elem.classList.add('active');
			}
		},

		init: function(elementStr, subMenuStr) {
			document.addEventListener('click', (e) => {
				var elem = e.target.closest(elementStr);

				if (!elem) {
					return;
				}

				this.toggle(elem, elementStr, subMenuStr);
			});
		}
	};
})();
//# sourceMappingURL=script.js.map
