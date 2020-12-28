import '@khanacademy/tota11y/dist/tota11y';
import { addKeyboardAction, getFromLocalStorage, setToLocalStorage } from './developHelpers';

// toggle tota11y helper on CTRL+4 / ALT+4
(function tota11yHelper() {
	const style = document.createElement('style');
	style.innerHTML = '.tota11y { display: none; }';
	document.head.appendChild(style);
	function toggleTota11y() {
		if (style.parentElement) {
			style.parentElement.removeChild(style);
		} else {
			document.head.appendChild(style);
		}
		setToLocalStorage('dev-helper-tota11y', !Boolean(style.parentElement));
	}

	// 52 = keycode for 4
	addKeyboardAction(52, toggleTota11y);
	// Local Storage
	if (getFromLocalStorage('dev-helper-tota11y')) {
		toggleTota11y();
	}
})();
