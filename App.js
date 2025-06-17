import { StatusBar } from 'expo-status-bar';
import { Dimensions } from 'react-native';
import { StyleSheet, Text, View, Button, ScrollView, ActivityIndicator, Image, TextInput, TouchableOpacity, Modal } from 'react-native';
import React, { use, useEffect, useState } from 'react';
import {GOOGLE_LOCATION_API_KEY, WEATHER_API_KEY} from '@env';
import * as Location from 'expo-location';
import {Feather} from '@expo/vector-icons';


const ScreenWidth = Dimensions.get('window').width;
console.log('ScreenWidth:', ScreenWidth);


const App = () => {
  // This is a simple React Native app that uses Expo.

  // const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [dailyWeather, setDailyWeather] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const fetchSuggestions = async (text) => {
    if (text.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${text}&limit=5&appid=${WEATHER_API_KEY}`
      );
      const data = await res.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = async (suggestion) => {
    setSearchText(suggestion.name);
    setShowSuggestions(false);
    setCity(suggestion.name);
    await fetchWeatherByCoords(suggestion.lat, suggestion.lon);
  };

  const locationData = async () => {
    try {
      const {granted} = await Location.requestForegroundPermissionsAsync();
      if (!granted) {
        setPermitted(false);
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get the current position of the device
      const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
      
      setLatitude(latitude);
      setLongitude(longitude); 
      
      console.log('Latitude:', latitude, 'Longitude:', longitude);
      
      // 위치 데이터를 받은 직후 바로 날씨 데이터를 가져옵니다
      await fetchWeatherByCoords(latitude, longitude);
    } catch (error) {
      console.error('Error getting location:', error);
      setErrorMsg('Failed to get location');
    }
  }

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const apiURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_LOCATION_API_KEY}`;
      const response = await fetch(apiURL);
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        throw new Error('No location data found');
      }

      const weatherApiURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=alerts&units=metric&appid=${WEATHER_API_KEY}`;
      const weatherResponse = await fetch(weatherApiURL);
      const weatherData = await weatherResponse.json();

      if (!weatherData.daily) {
        throw new Error('No weather data found');
      }

      // Set Daily Weather Data
      setDailyWeather(weatherData.daily);
      
      // Check the country code and set city name
      const addressComponents = data.results[0].address_components;
      if (!addressComponents) {
        throw new Error('Invalid address components');
      }

      const cityComponent = addressComponents.find(component => 
        component.types.includes('locality') || component.types.includes('administrative_area_level_2')
      );

      if (cityComponent) {
        setCity(cityComponent.long_name);
        console.log("City:", cityComponent.long_name);
      } else {
        throw new Error('City not found in address components');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setErrorMsg('Failed to fetch weather data');
      setDailyWeather([]); // Reset weather data on error
    }
  };

  const handleCurrentLocation = async () => {
    setSearchText('');
    setSuggestions([]);
    setShowSuggestions(false);
    setModalVisible(false);
    await locationData();
  };

  useEffect(() => {
    locationData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.cityRow}>
        <View style={styles.cityContainer}>
          <Text style={styles.city}>{city}</Text>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconBtn}>
            <Feather name="search" size={28} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCurrentLocation} style={styles.iconBtn}>
            <Feather name="map-pin" size={28} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search city..."
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                fetchSuggestions(text);
              }}
              autoFocus
            />
            {showSuggestions && suggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                {suggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={async () => {
                      await handleSuggestionSelect(suggestion);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.suggestionText}>
                      {suggestion.name}, {suggestion.country}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{marginTop: 20}}>
              <Text style={{color: 'blue', fontSize: 16}}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.regDateContainer}>
        <Text style={styles.regDate}>{dateString}</Text>
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}>
        {dailyWeather.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
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
                {parseFloat(day.temp.day).toFixed(0)}°
              </Text>
            </View>
            <View style={styles.forcastContainer}>
                <View style={styles.forcastTextBox}>
                  <Text style={styles.forcastTitle}>
                    Week Forcast
                  </Text>

                  <Text style={styles.weekdayText}>
                    {new Date(day.dt * 1000).toLocaleDateString('en-AU', {
                      weekday: 'short',
                      day: '2-digit',
                      month: 'short',
                    }).replace(/(\d{2}) (\w{3})/, '$1 $2')}
                  </Text>
                </View>
                <View style={styles.infoBox}>
                  <View
                    style={{
                      width: '30%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      }}>
                    <Feather name='wind' size={24} color='white' />
                    <Text style={{fontSize: 20, color: 'white', paddingTop: 20}}>
                      {day.wind_speed} m/s
                    </Text>
                    <Text style={{fontSize: 15, color: 'white', paddingTop: 10}}>Wind Speed</Text>
                  </View>
                  <View
                    style={{
                      width: '30%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      }}>
                    
                    <Feather name='droplet' size={24} color='white' />
                    <Text style={{fontSize: 20, color: 'white', paddingTop: 20}}>
                      {parseFloat(day.pop).toFixed(0)}%
                    </Text>
                    <Text style={{fontSize: 15, color: 'white', textAlign: 'center'}}>Rain Probability</Text>

                  </View>
                  <View
                    style={{
                      width: '30%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      }}>
                    <Feather name='sunset' size={24} color='white' />
                    <Text style={{fontSize: 20, color: 'white', paddingTop: 20}}>
                      {parseFloat(day.uvi).toFixed(0)} 
                    </Text>
                    <Text style={{fontSize: 15, color: 'white', paddingTop: 10}}>UV Index</Text>  
                  </View>
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
    flex: 1,
  },

  city: {
    flex: 0.9,
    marginTop: 50,
    paddingTop: 10,
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

  iconContainer: {
    marginTop: 60,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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

  forcastTextBox: {
    width: "80%",
    flexDirection: 'row',
    alignItems: 'center',
  },

  forcastTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    width: "80%"
  },

  weekdayText:{
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    height:"100%",
    textAlign: 'right',
    paddingTop: 10,
    paddingRight: 10,
  },

  infoBox: {
    flex: 0.6,
    width: "80%",
    backgroundColor: 'black',
    borderRadius: 10,
    marginTop:10,
    flexDirection: 'row',
    justifyContent: 'center',
    
  },

  searchContainer: {
    height: 50,
    width: "80%",
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchInput: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  suggestionsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 5,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
});

export default App;