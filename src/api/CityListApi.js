class CityListApi {
    fetchAvailableCities = () => fetch('https://raw.githubusercontent.com/example0312/weather-crawler/master/availableCityNames')
        .then(response => response.json());
}

export default new CityListApi();


