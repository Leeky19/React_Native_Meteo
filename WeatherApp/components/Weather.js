import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function Weather({ forecast, isDarkBackground }) {
  const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
  const hour = new Date(forecast.dt_txt).getHours();
  const temperature = Math.round(forecast.main.temp);
  const textColor = isDarkBackground ? '#fff' : '#000';

  return (
    <View style={styles.container}>
      <Text style={[styles.hour, { color: textColor }]}>{hour}h</Text>
      <Image source={{ uri: iconUrl }} style={styles.icon} />
      <Text style={[styles.temp, { color: textColor }]}>{temperature}°C</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 8,
  },
  hour: {
    fontSize: 14,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  temp: {
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  icon: {
    width: 50,
    height: 50,
  },
});
