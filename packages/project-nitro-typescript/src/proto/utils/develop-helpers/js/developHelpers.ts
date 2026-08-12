/* eslint-disable no-empty */

type KeyboardAction = () => void;

const actions: Record<string, KeyboardAction> = {};

export function addKeyboardAction(
	key: string,
	action: KeyboardAction
): void {
	actions[key.toLowerCase()] = action;
}

document.addEventListener('keydown', (e) => {
	const modifierPressed =
		e.ctrlKey ||
		e.metaKey ||
		e.altKey;

	if (!modifierPressed) {
		return;
	}

	actions[e.key.toLowerCase()]?.();
});

export function getFromLocalStorage<TObj = unknown>(key: number | string): TObj | void {
	try {
		const item = localStorage.getItem(`${key}`);
		if (!item) return;
		return window.JSON.parse(item);
	} catch {}
}

export function setToLocalStorage(key: number | string, value: any): void {
	try {
		return localStorage.setItem(`${key}`, (window as any).JSON.stringify(value));
	} catch {}
}

/* eslint-enable no-empty */
