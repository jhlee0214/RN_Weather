import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useState } from 'react';

export default function App() {
  const [number, setNumber] = useState(0);


  return (
    <View style={styles.container}>
      <Text style={styles.text}>Result: {number}</Text>
      <View style={styles.btnGroup}>
        <Button
          title="Increment"
          onPress={() => setNumber(number + 1)}
        />
        <Button
          title="Decrement"
          onPress={() => setNumber(number - 1)}
        />
      </View>
      <StatusBar barStyle="dark-content" hidden={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'purple',
  },

  btnGroup: {
    flexDirection: 'row',
    gap: 10,
  },

});
