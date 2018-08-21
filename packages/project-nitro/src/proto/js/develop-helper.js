/* eslint-disable max-len, no-inline-comments, no-empty, require-jsdoc */

(function() {
	// config
	const breakpointMarkup = [
		'<span class="d-block d-sm-none">Extra small devices (xs)</span>',
		'<span class="d-none d-sm-block d-md-none">Small devices (sm)</span>',
		'<span class="d-none d-md-block d-lg-none">Medium devices (md)</span>',
		'<span class="d-none d-lg-block d-xl-none">Large devices (lg)</span>',
		'<span class="d-none d-xl-block">Extra large devices (xl)</span>',
	].join('');

	const gridMarkup = [
		'<div class="container" style="height:100%">',
		'<div class="row" style="height:100%;outline:none">',
		'<div class="col-1" style="height: 100%;background:rgba(0,109,115,0.1);outline:none"><div style="height:100%;background:rgba(107,186,195,0.4)"></div></div>',
		'<div class="col-1" style="height: 100%;background:rgba(0,109,115,0.1);outline:none"><div style="height:100%;background:rgba(107,186,195,0.4)"></div></div>',
		'<div class="col-1" style="height: 100%;background:rgba(0,109,115,0.1);outline:none"><div style="height:100%;background:rgba(107,186,195,0.4)"></div></div>',
		'<div class="col-1" style="height: 100%;background:rgba(0,109,115,0.1);outline:none"><div style="height:100%;background:rgba(107,186,195,0.4)"></div></div>',
		'<div class="col-1" style="height: 100%;background:rgba(0,109,115,0.1);outline:none"><div style="height:100%;background:rgba(107,186,195,0.4)"></div></div>',
		'<div class="col-1" style="height: 100%;background:rgba(0,109,115,0.1);outline:none"><div style="height:100%;background:rgba(107,186,195,0.4)"></div></div>',
		'<div class="col-1" style="height: 100%;background:rgba(0,109,115,0.1);outline:none"><div style="height:100%;background:rgba(107,186,195,0.4)"></div></div>',
		'<div class="col-1" style="height: 100%;background:rgba(0,109,115,0.1);outline:none"><div style="height:100%;background:rgba(107,186,195,0.4)"></div></div>',
		'<div class="col-1" style="height: 100%;background:rgba(0,109,115,0.1);outline:none"><div style="height:100%;background:rgba(107,186,195,0.4)"></div></div>',
		'<div class="col-1" style="height: 100%;background:rgba(0,109,115,0.1);outline:none"><div style="height:100%;background:rgba(107,186,195,0.4)"></div></div>',
		'<div class="col-1" style="height: 100%;background:rgba(0,109,115,0.1);outline:none"><div style="height:100%;background:rgba(107,186,195,0.4)"></div></div>',
		'<div class="col-1" style="height: 100%;background:rgba(0,109,115,0.1);outline:none"><div style="height:100%;background:rgba(107,186,195,0.4)"></div></div>',
		'</div>',
		'</div>',
	].join('');

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

	// Keys is an object which holds callbacks for ctrl+[keycode] | alt+[keycode]
	const keys = (function() {
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

	function getFromLocalStorage(key) {
		try {
			return window.JSON.parse(localStorage.getItem(key));
		} catch (e) {}
	}

	function setToLocalStorage(key, value) {
		try {
			return localStorage.setItem(key, window.JSON.stringify(value));
		} catch (e) {}
	}

	// toggle breakpoint helper on CTRL+1 | ALT+1
	(function breakpointHelper() {
		const div = document.createElement('div');
		div.innerHTML = breakpointMarkup;
		div.setAttribute(
			'style',
			[
				'display:none',
				'position:fixed',
				'max-width:40vw',
				'left:10px',
				'bottom:10px',
				'padding:7px 10px',
				'pointer-events:none',
				'z-index:2147483646',
				'opacity:0.8',
				'background:rgba(200,200,200,0.9)',
				'border:1px solid rgba(200,200,200,1)',
			].join(';')
		);
		document.body.appendChild(div);
		function toggleBreakpointHelper() {
			const showEvents = div.style.display === 'none';
			div.style.display = showEvents ? 'inline-block' : 'none';
			setToLocalStorage('dev-helper-breakpoints', showEvents);
		}

		// 49 = keycode for 1
		keys[49] = toggleBreakpointHelper;
		// Local Storage
		if (getFromLocalStorage('dev-helper-breakpoints')) {
			toggleBreakpointHelper();
		}
	})();

	// toggle grid helper on CTRL+2 / ALT+2
	(function gridHelper() {
		const div = document.createElement('div');
		div.innerHTML = gridMarkup;
		div.setAttribute(
			'style',
			[
				'position:fixed',
				'top:0',
				'left:0',
				'display:none',
				'right:0',
				'bottom: 0',
				'pointer-events:none',
				'z-index: 2147483647',
			].join(';')
		);
		document.body.appendChild(div);
		function toggleGrid() {
			const visible = div.style.display === 'none';
			div.style.display = visible ? 'block' : 'none';
			setToLocalStorage('dev-helper-grid', visible);
		}

		// 50 = keycode for 2
		keys[50] = toggleGrid;
		// Local Storage
		if (getFromLocalStorage('dev-helper-grid')) {
			toggleGrid();
		}
	})();

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
		keys[51] = toggleBootstrapOutlines;
		// Local Storage
		if (getFromLocalStorage('dev-helper-bootstrap-grid')) {
			toggleBootstrapOutlines();
		}
	})();
})();
/* eslint-enable max-len, no-inline-comments, no-empty, require-jsdoc */
