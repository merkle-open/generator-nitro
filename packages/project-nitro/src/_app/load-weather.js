import $ from 'jquery';

const getApiUrl = (city) => {
	const url = 'http://api.openweathermap.org/data/2.5/weather?q=';
	const apiKey = '&APPID=2dc105a72eae3a2e36b44cf962cac9ed';

	return url + city + apiKey;
};

export default (city) => {
	const apiUrl = getApiUrl(city);

	$.get(apiUrl, (data) => {
		const $result = $('#city-result');
		$result.append(`<p>City: <strong>${data.name}</strong></p>`);
		$result.append(`<p>Temperature: ${data.main.temp}°C</p>`);
		console.log(`Received weather data for ${city}: `, data); // eslint-disable-line
	});
};
