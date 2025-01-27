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
    <View style={[styles.container, { paddingTop: 40 }]}>
      <Text style={styles.city}>{currentWeather.city}</Text>
      <Text style={styles.temp}>{currentWeather.temp}°C</Text>
      <Text style={styles.description}>{currentWeather.description}</Text>
      <ShowIcon icon={currentWeather.icon} resolution="2x" size={120} />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    city: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    temp: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#000',
      marginBottom: 5,
    },
    description: {
      fontSize: 18,
      color: '#555',
      marginBottom: 15,
    },
  });