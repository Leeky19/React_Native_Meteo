import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ShowIcon from './ShowIcon';

export default function Weather({ forecast }) {
  return (
    <View style={styles.container}>
      <Text>{forecast.dt_txt.split(' ')[1]}</Text>
      <ShowIcon icon={forecast.weather[0].icon} resolution="2x" size={40} />
      <Text>{forecast.main.temp}°C</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginHorizontal: 10 },
});