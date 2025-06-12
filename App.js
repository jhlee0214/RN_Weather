import { StatusBar } from 'expo-status-bar';
import { Dimensions } from 'react-native';
import { StyleSheet, Text, View, Button, ScrollView  } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';

const ScreenWidth = Dimensions.get('window').width;
// console.log('ScreenWidth:', ScreenWidth);

const App = () => {
  // This is a simple React Native app that uses Expo.
// const {width:ScreenWidth, height:ScreenHeight} = Dimensions.get('window');
  const [location, setLocation] = useState(null)
  const [city, setCity] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [permitted, setPermitted] = useState(true);

  const locationData = async () => {
    const {granted} = await Location.requestForegroundPermissionsAsync();

    if (!granted) {
      setPermitted(false);
      setErrorMsg('Permission to access location was denied');
      return;
    }

    // console.log('Permission granted:', granted);

    const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    console.log('Location coordinates:', latitude, longitude);

    const address = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
    console.log('Address:', address);
    console.log('City:', address[0].city);

    const cityName = address[0].city;
    setCity(cityName);
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
        pagingEnabled={true}
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

  day: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
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
    flex: 3,
    width: ScreenWidth,
  },

  desc: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
    fontSize: 25,
    fontWeight: 'bold',
  },

  tempContainer: {
    flex: 0.3,
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