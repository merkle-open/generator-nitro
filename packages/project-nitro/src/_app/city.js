import $ from 'jquery';
import loadWeather from './load-weather';

$('#city-button').on('click', () => {
	const city = $('#city-input').val();
	if (!city) {
		return window.alert('Please enter a city'); /* eslint-disable-line */
	}
	loadWeather(city);
});
