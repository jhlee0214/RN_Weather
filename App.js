import { StatusBar } from 'expo-status-bar';
import { Dimensions } from 'react-native';
import { StyleSheet, Text, View, Button, ScrollView, ActivityIndicator, Image } from 'react-native';
import React, { use, useEffect, useState } from 'react';
import {GOOGLE_LOCATION_API_KEY, WEATHER_API_KEY} from '@env';
import * as Location from 'expo-location';


const ScreenWidth = Dimensions.get('window').width;
console.log('ScreenWidth:', ScreenWidth);


const App = () => {
  // This is a simple React Native app that uses Expo.

  // const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [permitted, setPermitted] = useState(true);
  const [dailyWeather, setDailyWeather] = useState([]);
  const date = new Date();
  const dateString = date.toLocaleDateString('en-AU', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Australia/Sydney', // Set the timezone to Australia/Sydney
    timeZoneName: 'short',
  });
  console.log('Current Date:', dateString);


  const locationData = async () => {
    const {granted} = await Location.requestForegroundPermissionsAsync();

    if (!granted) {
      setPermitted(false);
      setErrorMsg('Permission to access location was denied');
      return;
    }

    // Get the current position of the device
    const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});

    // Get the location state with the current position (Free version)
    // const address = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});

    const apiURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_LOCATION_API_KEY}`;

    const response = await fetch(apiURL);
    const data = await response.json();

    const weatherApiURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&units=metric&appid=${WEATHER_API_KEY}`;

    const weatherResponse = await fetch(weatherApiURL);
    const weatherData = await weatherResponse.json();

    // Set Daily Weather Data
    setDailyWeather(weatherData.daily);
    console.log('Daily Weather Data:', weatherData.daily);

    // Check the country code
    if (data.results[0].address_components[5].short_name == 'AU') {

      // let cityNcountry = data.results[0].address_components[2].long_name + ', ' + data.results[0].address_components[5].short_name;

      setCity(data.results[0].address_components[2].long_name);

    } else {

      // let cityNcountry = data.results[0].address_components[3].long_name + ', ' + data.results[0].address_components[6].short_name;

      setCity(data.results[0].address_components[3].long_name);
    }

    // Set city name from the address with EXPO Location API
    // const cityName = address[0].city;
    // setCity(cityName);

  }

  useEffect(() => {
    locationData();
  }, []);

  return (
    <View style={styles.container}>

      <View style={styles.cityContainer}>
        <Text style={styles.city}>{city}</Text>
      </View>

      <View style={styles.regDateContainer}>
        <Text style={styles.regDate}>{dateString}</Text>
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}>
        {dailyWeather.length === 0 ? (
          <View>
            <ActivityIndicator size="large" color="#00ff00" />
          </View>
        ):(
          dailyWeather.map((day, index) => (
          <View key={index} style={styles.weatherInner}>
            <View style={styles.day}>
              <View style={styles.weatherInfo}>
                <Text style={styles.desc}>
                  {day.weather[0].main}
                </Text>
              </View>
              <View style={styles.weatherIcon}>
                <Image 
                  source={{uri: `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}}
                  style={{
                    width: 50, 
                    height: 50,
                    marginTop: 20,
                  }}
                />
              </View>
            </View>

            <View style={styles.tempContainer}>
              <Text style={styles.temp}>
                {parseFloat(day.temp.day).toFixed(0)}
              </Text>
              <Text style={{ 
                fontSize: 110, 
                position: 'absolute',
                top:50,
                right:40,
                }}>°</Text>
            </View>
            <View style={styles.forcastContainer}>
                <Text style={styles.forcastTitle}>
                  Week Forcast
                </Text>
                <View style={styles.infoBox}>

                </View>

            </View>
          </View>
        )))}
      </ScrollView>
      <StatusBar style='auto'/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe01a',

  },

  cityContainer: {
    flex: 0.3,
  },

  city: {
    flex: 0.5,
    marginTop: 60,
    paddingTop: 20,
    fontSize: 40,
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  regDateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  regDate: { 
    paddingTop: 10,
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 15,
    alignItems: 'center',
    backgroundColor: 'black',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: 20,
    overflow: 'hidden',
  },

  weather: {
  },

  weatherInner: {
    flex:3,
    width: ScreenWidth,
  },

  day: {
    flex: 0.15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  desc: {
    fontSize: 25,
    fontWeight: 'bold',
    marginRight: 10,
  },

  weatherIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  tempContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  temp: {
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 180,
  },

  forcastContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forcastTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    width: "80%"
  },
  infoBox: {
    flex: 0.6,
    width: "80%",
    backgroundColor: 'black',
    borderRadius: 10,
    marginTop:10,
  },


});

export default App;