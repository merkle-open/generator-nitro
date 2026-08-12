/* eslint-disable no-empty */

const actions = {};

export function addKeyboardAction(key, action) {
	actions[key.toLowerCase()] = action;
}

document.addEventListener('keydown', (e) => {
	const modifierPressed = e.ctrlKey || e.metaKey || e.altKey;

	if (!modifierPressed) {
		return;
	}

	actions[e.key.toLowerCase()]?.();
});

export function getFromLocalStorage(key) {
	try {
		return window.JSON.parse(localStorage.getItem(key));
	} catch {}
}

export function setToLocalStorage(key, value) {
	try {
		return localStorage.setItem(key, window.JSON.stringify(value));
	} catch {}
}

/* eslint-enable no-empty */
