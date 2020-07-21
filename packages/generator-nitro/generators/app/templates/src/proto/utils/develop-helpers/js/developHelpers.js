/* eslint-disable max-len, no-inline-comments, no-empty, require-jsdoc */

const keys = (function () {
	const controlKeys = {
		17: false, // ctrl
		18: false, // alt
	};
	const _keys = {};

	function isControlKeyPressed() {
		return (
			Object.keys(controlKeys).filter((keyCode) => {
				return controlKeys[keyCode];
			}).length > 0
		);
	}

	document.documentElement.addEventListener('keydown', (e) => {
		if (controlKeys[e.which] === false) {
			controlKeys[e.which] = true;
		} else if (isControlKeyPressed() && _keys[e.which]) {
			_keys[e.which]();
		}
	});
	document.documentElement.addEventListener('keyup', (e) => {
		if (controlKeys[e.which] === true) {
			controlKeys[e.which] = false;
		}
	});
	return _keys;
})();

export function addKeyboardAction(key, method) {
	keys[key] = method;
}

export function getFromLocalStorage(key) {
	try {
		return window.JSON.parse(localStorage.getItem(key));
	} catch (e) {}
}

export function setToLocalStorage(key, value) {
	try {
		return localStorage.setItem(key, window.JSON.stringify(value));
	} catch (e) {}
}

/* eslint-enable max-len, no-inline-comments, no-empty, require-jsdoc */
