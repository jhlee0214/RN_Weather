import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button  } from 'react-native';
import React, { useState } from 'react';

const App = () => {
  // This is a simple React Native app that uses Expo.
  return (
    <View style={styles.container}>

      <View style={styles.cityContainer}>
        <Text style={styles.city}>Melbourne</Text>
      </View>

      <View style={styles.weatherContainer}>
        <View style={styles.day}>
          <Text style={styles.regDate}>11/06/2025 Weds 10:26</Text>
          <Text style={styles.desc}>Weather</Text>
        </View>
        <View style={styles.tempContainer}>
          <Text style={styles.temp}>25</Text>
        </View>
      </View>

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
    flex: 1,
    marginTop: 60,
    paddingTop: 20,
    fontSize: 40,
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  weatherContainer: {
    flex: 3,
  },

  day: {
    flex: 0.2,
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
  },

  desc: {
    flex: 1.5,
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