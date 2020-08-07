import React from 'react';
import { ActivityIndicator, Image, StyleSheet, View, Text, Button, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import openWeatherApi from '../api/OpenWeatherApi';
import Constants from 'expo-constants';
import _get from 'lodash.get';

export default class WeatherDetailScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    openWeatherApi.fetchWeatherInfoByCityName(this.props.route.params.city)
      .then(info => {
        console.log(info);
        this.setState({
          ...info,
          isLoading: false,
        });
      });
  }

  renderTemperature() {
    const celsius = this.state.main.temp - 273.15;

    return (
      <Text style={{ fontSize: 50, color: '#fff' }}>{celsius.toFixed(1)}°C</Text>
    )
  }

  renderClouds() {
    const clouds = _get(this.state, ['clouds', 'all'], null);

    const cloudStatus = [
      '맑음',
      '구름 조금',
      '구름 많음',
      '흐림',
      '매우 흐림'
    ];

    const text = (clouds === null) ? '정보 없음' : cloudStatus[Math.max(parseInt(clouds / 20), 4)];

    return (
      <Text style={styles.text}>구름: {text}</Text>
    );
  }

  renderWind() {
    const speed = _get(this.state, ['wind', 'speed'], null);
    const deg = _get(this.state, ['wind', 'deg'], null);

    const arrowStyle = {
      transform: [
        { rotate: `${deg}deg` }
      ],
      width: 24,
      height: 24,
    };

    return (
      <View style={[styles.inRow, styles.alignItemInCenter]}>
        <Text style={styles.text}>
          풍속: {speed ? `${speed}m/s` : '정보 없음'}
        </Text>
        <View style={[arrowStyle]}>
          <MaterialCommunityIcons name="arrow-up-circle" size={24} color="black" />
        </View>
      </View>
    );
  }

  renderWeatherCondition() {
    // https://openweathermap.org/weather-conditions
    return this.state.weather.map(({
      icon,
      description,
    }, index) => {
      return (
        <View style={styles.weatherCondition} key={index}>
          <Image source={{
            uri: `http://openweathermap.org/img/wn/${icon}@2x.png`,
            width: 72,
            height: 48
          }} />
          <Text style={styles.textCondition, styles.text}>{description}</Text>
        </View>
      );
    });
  }

  renderMoreDetails() {

    const humidity = this.state.main.humidity;
    const temp_max = this.state.main.temp_max - 273.15;
    const temp_min = this.state.main.temp_min - 273.15;
    return (
      <>
        <View>
          <Text style={styles.text}>습도: {humidity}%</Text>
        </View>
        <View style={styles.inRow}>
          <Text style={styles.text}>최고 기온: {temp_max.toFixed(1)}°C</Text>
          <Text style={styles.text}>최저 기온: {temp_min.toFixed(1)}°C</Text>
        </View>
      </>
    )
  }

  renderGoogleMap() {
    const {
      lat, lon
    } = this.state.coord;

    const googleApiKey = _get(Constants, ['manifest', 'extra', 'googleApiKey'], null);

    if (!googleApiKey) {
      return undefined;
    }

    const url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&markers=color:red%7C${lat},${lon}&zoom=9&size=400x400&maptype=roadmap&key=${googleApiKey}`;

    return (
      <View style={styles.mapContainer}>
        <Image style={styles.mapImage}
          resizeMode={'stretch'}
          resizeMethod={'scale'}
          source={{ uri: url, }}
        />
      </View>
    );
  }

  render() {
    const {
      route: {
        params: { city },
      },
      navigation,
    } = this.props;

    navigation.setOptions({ title: `${city} 날씨` });

    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      )
    }

    return (
      <View style={styles.container}>
        {this.renderGoogleMap()}
        {this.renderTemperature()}
        {this.renderClouds()}
        {this.renderMoreDetails()}
        {this.renderWind()}
        <View style={styles.inRow}>
          {this.renderWeatherCondition()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c7ed6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: '#fff',
    padding: 5,
  },

  inRow: {
    flexDirection: 'row',
  },
  alignItemInCenter: {
    alignItems: 'center',
  },
  mapContainer: {
    width: '90%',
    borderWidth: 2,
    borderColor: '#fff',
  },
  mapImage: {
    aspectRatio: 1,
  },
  weatherCondition: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  textCondition: {
    color: '#FFF',
  },
  rotation: {
    width: 50,
    height: 50,
    transform: [{ rotate: "5deg" }]
  }
});
