import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ShowIcon from './ShowIcon';

export default function CurrentWeather({ data }) {
  const [currentWeather, setCurrentWeather] = useState(null);

  useEffect(() => {
    if (data) {
      const weather = data.list[0];
      setCurrentWeather({
        city: data.city.name,
        temp: weather.main.temp,
        description: weather.weather[0].description,
        icon: weather.weather[0].icon,
      });
    }
  }, [data]);

  if (!currentWeather) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.city}>{currentWeather.city}</Text>
      <Text>{currentWeather.temp}°C</Text>
      <Text>{currentWeather.description}</Text>
      <ShowIcon icon={currentWeather.icon} resolution="2x" size={50} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginBottom: 20 },
  city: { fontSize: 20, fontWeight: 'bold' },
});