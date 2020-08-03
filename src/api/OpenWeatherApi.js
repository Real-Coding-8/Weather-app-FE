import Constants from 'expo-constants';

const {
    apiKey,
    baseUrl,
    region,
} = Constants.manifest.extra.openWeatherApi;

class OpenWeatherApi {
    fetchWeatherInfoByCityName = cityName => {
        const url = `${baseUrl}/weather?q=${cityName}&appid=${apiKey}&lang=${region}`

        return fetch(url)
            .then(response => response.json());
    }
}

export default new OpenWeatherApi();
