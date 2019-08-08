import { addKeyboardAction, getFromLocalStorage, setToLocalStorage } from './developHelpers';

// config
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
	addKeyboardAction(50, toggleGrid);
	// Local Storage
	if (getFromLocalStorage('dev-helper-grid')) {
		toggleGrid();
	}
})();
