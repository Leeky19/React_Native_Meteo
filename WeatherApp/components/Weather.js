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
  },
  hour: {
    fontSize: 14,
    fontWeight: '500',
  },
  temp: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    width: 50,
    height: 50,
  },
});