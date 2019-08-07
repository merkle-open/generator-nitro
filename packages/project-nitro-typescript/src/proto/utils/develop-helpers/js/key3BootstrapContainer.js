import { addKeyboardAction, getFromLocalStorage, setToLocalStorage } from './developHelpers';

(function() {
	// config
	const bootstrapStyles = [
		'.container {' +
			'  outline: 9px solid rgba(244, 229, 65, 0.4);' +
			'}' +
			'.row {' +
			'  outline: 6px solid rgba(244, 184, 65, 0.4);' +
			'}' +
			'.col, .col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12,' +
			'.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12,' +
			'.col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12,' +
			'.col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12,' +
			'.col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12 {' +
			'  outline: 3px solid rgba(244, 65, 88, 0.6);' +
			'}',
	].join('\n');

	// toggle bootstrap grid on CTRL+3 / ALT+3
	(function bootstrapHelper() {
		const style = document.createElement('style');
		style.innerHTML = bootstrapStyles;
		function toggleBootstrapOutlines() {
			if (style.parentElement) {
				style.parentElement.removeChild(style);
			} else {
				document.head.appendChild(style);
			}
			setToLocalStorage('dev-helper-bootstrap-grid', Boolean(style.parentElement));
		}

		// 51 = keycode for 3
		addKeyboardAction(51, toggleBootstrapOutlines);
		// Local Storage
		if (getFromLocalStorage('dev-helper-bootstrap-grid')) {
			toggleBootstrapOutlines();
		}
	})();
})();
