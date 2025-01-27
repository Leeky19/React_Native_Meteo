import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ShowIcon from './ShowIcon';

export default function Weather({ forecast }) {
  const { dt_txt, main, weather } = forecast;

  return (
    <View style={styles.container}>
      <Text style={styles.hour}>{dt_txt.split(' ')[1]}</Text>
      <ShowIcon icon={weather[0].icon} size={40} />
      <Text style={styles.temp}>{Math.round(main.temp)}°C</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  hour: {
    fontSize: 14,
    color: '#000',
  },
  temp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});