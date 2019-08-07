'use strict';

import flatpickr from 'flatpickr';
import { German } from 'flatpickr/dist/l10n/de';
import { French } from 'flatpickr/dist/l10n/fr';
import { Serbian } from 'flatpickr/dist/l10n/sr';
import { Russian } from 'flatpickr/dist/l10n/ru';

const getLocale = (localeKey) => {
	switch (localeKey.toLowerCase()) {
		case 'de':
			return German;
		case 'fr':
			return French;
		case 'sr':
			return Serbian;
		case 'ru':
			return Russian;
		default:
			return undefined;
	}
};

const initPicker = (element) => {
	const localeKey = document.documentElement.lang || '';
	const getData = (data) => element.dataset[data];
	const options = {
		dateFormat: getData('dateFormat') || 'd.m.Y',
		defaultDate: getData('defaultDate'),
	};
	const locale = getLocale(localeKey.toLowerCase());
	const altFormat = getData('altFormat');

	if (locale) {
		options.locale = locale;
	}

	if (altFormat) {
		options.altInput = true;
		options.altFormat = altFormat;

		// improve accessibility
		options.onReady = (a, b, fp) => {
			fp.altInput.setAttribute('aria-hidden', 'true');
		};
	}

	flatpickr(element, options);
};

export default initPicker;
