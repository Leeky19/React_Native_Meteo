import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function CurrentWeather({ data }) {
  const { main, weather, wind } = data.list[0];
  const cityName = data.city.name;

  const iconCode = weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

  const isDarkBackground = weather[0].description.includes('pluie');
  const textColor = isDarkBackground ? '#fff' : '#000';

  return (
    <View style={styles.container}>
      <Text style={[styles.cityName, { color: textColor }]}>{cityName}</Text>
      <Image source={{ uri: iconUrl }} style={styles.icon} />
      <Text style={[styles.temperature, { color: textColor }]}>
        {Math.round(main.temp)}°C
      </Text>
      <Text style={[styles.description, { color: textColor }]}>
        {weather[0].description}
      </Text>
      <Text style={[styles.wind, { color: textColor }]}>
        Vent : {Math.round(wind.speed)} m/s
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  cityName: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 10,
  },
  icon: {
    width: 100,
    height: 100,
  },
  temperature: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 18,
  },
  wind: {
    fontSize: 14,
  },
});
