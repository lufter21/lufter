//global variables
var browser;

(function() {
	"use strict";

//get useragent
document.documentElement.setAttribute('data-useragent', navigator.userAgent);

//browser identify
browser = (function(userAgent) {

	userAgent = userAgent.toLowerCase();

	if (/(msie|rv:11\.0)/.test(userAgent)) {
		return 'ie';
	}

}(navigator.userAgent));

//add support CustomEvent constructor for IE
try {
	new CustomEvent("IE has CustomEvent, but doesn't support constructor");
} catch (e) {

	window.CustomEvent = function(event, params) {
		var evt;

		params = params || {
			bubbles: false,
			cancelable: false,
			detail: undefined
		};

		evt = document.createEvent("CustomEvent");

		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);

		return evt;
	}

	CustomEvent.prototype = Object.create(window.Event.prototype);
}

//window Resized Event
var winResizedEvent = new CustomEvent('winResized');
var rsz = true;

window.addEventListener('resize', function() {

	if (rsz) {

		rsz = false;
		setTimeout(function() {
			window.dispatchEvent(winResizedEvent);
			rsz = true;
		}, 1021);

	}

});

//closest polyfill
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
	}(Element.prototype));
}

//check element for hidden
Element.prototype.elementIsHidden = function() {

	var elem = this;

	while (elem) {

		if (!elem) {
			break;
		}

		var compStyles = getComputedStyle(elem);

		if (compStyles.display == 'none' || compStyles.visibility == 'hidden' || compStyles.opacity == '0') {
			return true;
		}

		elem = elem.parentElement;

	}

	return false;
}

}());
;(function() {
	"use strict";

	//fix header
	var headerElem = document.querySelector('.header');

	window.addEventListener('scroll', function() {
		if (window.pageYOffset > 21) {
			headerElem.classList.add('header_fixed');
		} else if (!document.body.classList.contains('popup-is-opened')) {
			headerElem.classList.remove('header_fixed');
		}
	});

}());
/*
call to init:
Toggle.init(Str button selector[, Str toggle class, default: 'toggled']);
*/
var Toggle;

(function() {
	"use strict";

	Toggle = {
		toggledClass: 'toggled',

		toggle: function(elem) {
			var targetElements = document.querySelectorAll(elem.getAttribute('data-target-elements'));

			if (!targetElements.length) {
				return;
			}

			if (elem.classList.contains(this.toggledClass)) {
				for (var i = 0; i < targetElements.length; i++) {
					targetElements[i].classList.remove(this.toggledClass);
				}

				elem.classList.remove(this.toggledClass);
			} else {
				for (var i = 0; i < targetElements.length; i++) {
					targetElements[i].classList.add(this.toggledClass);
				}

				elem.classList.add(this.toggledClass);
			}
		},

		init: function(elementStr, toggledClass) {
			if (toggledClass) {
				this.toggledClass = toggledClass;
			}
			
			document.addEventListener('click', (e) => {
				var elem = e.target.closest(elementStr);

				if (!elem) {
					return;
				}

				e.preventDefault();

				this.toggle(elem);
			});
		}
	};
}());


/*$(document).ready(function() {

	//Toggle
	$('body').on('click', '.js-toggle', function() {
		var _$ = $(this),
		targetElements = _$.attr('data-target-elements'),
		initClickOnElements = _$.attr('data-init-click-on-elements');

		if (initClickOnElements) {
			$(initClickOnElements).not(this).click();
		}

		function openMenu(st) {
			if (st) {
				var pos = $(window).scrollTop();
				$('body').css('top', -pos).attr('data-position', pos).addClass('is-menu-opened');
			} else {
				$('body').removeClass('is-menu-opened').removeAttr('style');
				$('html,body').scrollTop($('body').attr('data-position'));
			}
		}

		function actElements(st) {
			if (targetElements) {

				var $elem = $(targetElements),
				role = _$.attr('data-role');

				if (st) {
					$elem.addClass(this.toggledClass);
				} else {
					$elem.removeClass(this.toggledClass);
				}
				
				if (role && role == 'menu') {
					openMenu(st);
				}
				
			}
		}
		
		if (!_$.hasClass(this.toggledClass)) {
			actElements(1);
			_$.addClass(this.toggledClass);
			var secTxt = _$.attr('data-second-button-text');
			if (secTxt) {
				if (!_$.attr('data-first-button-text')) {
					_$.attr('data-first-button-text', _$.html());
				}
				_$.html(secTxt);
			}
		} else {
			actElements(0);
			_$.removeClass(this.toggledClass);
			var fstTxt = _$.attr('data-first-button-text');
			if (fstTxt) {
				_$.html(fstTxt);
			}
		}

		

		return false;
	});

});*/
//# sourceMappingURL=script.js.map
