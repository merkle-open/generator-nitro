import { addKeyboardAction, getFromLocalStorage, setToLocalStorage } from './developHelpers';

// config
const breakpointMarkup = [
	'<span class="d-block d-sm-none">Extra small devices (xs)</span>',
	'<span class="d-none d-sm-block d-md-none">Small devices (sm)</span>',
	'<span class="d-none d-md-block d-lg-none">Medium devices (md)</span>',
	'<span class="d-none d-lg-block d-xl-none">Large devices (lg)</span>',
	'<span class="d-none d-xl-block d-xxl-none">Extra large devices (xl)</span>',
	'<span class="d-none d-xxl-block">Extra Extra large devices (xxl)</span>',
].join('');

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
		].join(';'),
	);
	document.body.appendChild(div);
	function toggleBreakpointHelper() {
		const showEvents = div.style.display === 'none';
		div.style.display = showEvents ? 'inline-block' : 'none';
		setToLocalStorage('dev-helper-breakpoints', showEvents);
	}

	// 49 = keyCode for 1
	addKeyboardAction(49, toggleBreakpointHelper);
	// Local Storage
	if (getFromLocalStorage('dev-helper-breakpoints')) {
		toggleBreakpointHelper();
	}
})();
