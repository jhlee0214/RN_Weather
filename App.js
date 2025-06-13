import { StatusBar } from 'expo-status-bar';
import { Dimensions } from 'react-native';
import { StyleSheet, Text, View, Button, ScrollView  } from 'react-native';
import React, { use, useEffect, useState } from 'react';
import {GOOGLE_LOCATION_API_KEY, WEATHER_API_KEY} from '@env';
import * as Location from 'expo-location';


const ScreenWidth = Dimensions.get('window').width;
console.log('ScreenWidth:', ScreenWidth);


const App = () => {
  // This is a simple React Native app that uses Expo.

  const [location, setLocation] = useState(null)
  const [city, setCity] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [permitted, setPermitted] = useState(true);
  const [dailyWeather, setDailyWeather] = useState([]);

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

    const weatherApiURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=daily&appid=${WEATHER_API_KEY}`;

    const weatherResponse = await fetch(weatherApiURL);
    const weatherData = await weatherResponse.json();

    console.log('Weather Data:', weatherData.results);
    
    // Check the country code
    if (data.results[0].address_components[5].short_name == 'AU') {

      // let cityNcountry = data.results[0].address_components[2].long_name + ', ' + data.results[0].address_components[5].short_name;

      setCity(data.results[0].address_components[2].long_name);

    } else {
      console.log('Not in Australia');

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
        <Text style={styles.regDate}>11/06/2025 Weds 10:26</Text>
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}>
        
        <View style={styles.weatherInner}>
          <View style={styles.day}>
            <Text style={styles.desc}>Cloudy</Text>
          </View>

          <View style={styles.tempContainer}>
            <Text style={styles.temp}>25</Text>
          </View>
        </View>

        <View style={styles.weatherInner}>
          <View style={styles.day}>
            <Text style={styles.desc}>Cloudy</Text>
          </View>
          <View style={styles.tempContainer}>
            <Text style={styles.temp}>25</Text>
          </View>
        </View>

        <View style={styles.weatherInner}>
          <View style={styles.day}>
            <Text style={styles.desc}>Cloudy</Text>
          </View>
          <View style={styles.tempContainer}>
            <Text style={styles.temp}>25</Text>
          </View>
        </View>


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
    width: ScreenWidth,
  },

  day: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  desc: {
    flex: 0.3,
    alignItems: 'center',
    marginTop: 20,
    fontSize: 25,
    fontWeight: 'bold',
  },

  tempContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  temp: {
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 120,
  }


});

export default App;