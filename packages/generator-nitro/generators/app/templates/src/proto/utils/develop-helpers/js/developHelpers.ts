/* eslint-disable max-len, no-inline-comments, no-empty, require-jsdoc */

const keys = (function(): { [key: string]: any } {
	const controlKeys = {
		17: false, // ctrl
		18: false, // alt
	};

	const _keys = {};

	function isControlKeyPressed(): boolean {
		return (
			Object.keys(controlKeys).filter((keyCode): string => {
				return controlKeys[keyCode];
			}).length > 0
		);
	}

	document.documentElement.addEventListener('keydown', (e: KeyboardEvent): void => {
		if (controlKeys[e.which] === false) {
			controlKeys[e.which] = true;
		} else if (isControlKeyPressed() && _keys[e.which]) {
			_keys[e.which]();
		}
	});

	document.documentElement.addEventListener('keyup', (e: KeyboardEvent): void => {
		if (controlKeys[e.which] === true) {
			controlKeys[e.which] = false;
		}
	});

	return _keys;
})();

export function addKeyboardAction(key: number | string, method: Function): void {
	keys[key] = method;
}

export function getFromLocalStorage(key: number | string): object | void {
	try {
		return (window as any).JSON.parse(localStorage.getItem(`${key}`));
	} catch (e) {}
}

export function setToLocalStorage(key: number | string, value: any): void {
	try {
		return localStorage.setItem(`${key}`, (window as any).JSON.stringify(value));
	} catch (e) {}
}

/* eslint-enable max-len, no-inline-comments, no-empty, require-jsdoc */
