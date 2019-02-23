//document is ready
document.addEventListener('DOMContentLoaded', function () {
	// mobile nav
	if (window.innerWidth < 1200) {
		MobNav.init({
			openBtn: '.js-open-menu',
			closeBtn: '.js-close-menu',
			headerId: 'header',
			menuLinkSelector: '.menu a.js-anchor'
		});
	}
});