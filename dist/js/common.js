/*
 In common.js use only ECMAScript 5.1
*/
//document is ready
document.addEventListener('DOMContentLoaded', function() {
	(function initFun() {
		flexImg('.flex-img');

		CoverImg.reInit();

		window.addEventListener('winResized', initFun);
	}());

	//init cover images
	CoverImg.init();
     
	//init toggle button
	Toggle.init('.js-toggle');
});