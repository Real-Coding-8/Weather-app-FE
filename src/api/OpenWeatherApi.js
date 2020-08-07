import Constants from 'expo-constants';

const { apiKey,
    region,
} = Constants.manifest.extra.openWeatherApi;

class OpenWeatherApi {
    fetchWeatherInfoByCityName = cityName => {
        const queryUrl = (cityName) => `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&lang=${region}`
        console.log(queryUrl());
        // https://api.openweathermap.org/data/2.5/weather?q=undefined&appid=9a33d592be686c1d04411c48cd7d29de
        return fetch(queryUrl(cityName))
            .then(res => res.json());
    }
}

export default new OpenWeatherApi();
