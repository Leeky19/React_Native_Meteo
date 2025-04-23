import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';
import BurgerMenu from '../components/BurgerMenu';

const API_KEY = 'd6def4924ad5f9a9b59f3ae895b234cb'; // OpenWeatherMap API key

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // Request location permissions
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission de localisation refusée');
          setLoading(false);
          return;
        }

        // Get current location
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        // Fetch weather data
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=metric&lang=fr&appid=${API_KEY}`
        );
        setWeather(response.data);
      } catch (err) {
        setError('Erreur lors de la récupération des données météo');
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <BurgerMenu />
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Chargement des données météo...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <BurgerMenu />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={styles.container}>
        <BurgerMenu />
        <Text style={styles.errorText}>Aucune donnée météo disponible</Text>
      </View>
    );
  }

  // Format date
  const date = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = new Intl.DateTimeFormat('fr-FR', options).format(date);

  return (
    <View style={styles.container}>
      <BurgerMenu />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.cityName}>{weather.name}</Text>
        <Text style={styles.date}>{formattedDate}</Text>

        <View style={styles.mainWeather}>
          <Image 
            source={{ uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png` }} 
            style={styles.weatherIcon} 
          />
          <Text style={styles.temperature}>{Math.round(weather.main.temp)}°C</Text>
          <Text style={styles.description}>{weather.weather[0].description}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <FontAwesome name="thermometer-half" size={24} color="#007BFF" />
              <Text style={styles.detailLabel}>Ressenti</Text>
              <Text style={styles.detailValue}>{Math.round(weather.main.feels_like)}°C</Text>
            </View>
            <View style={styles.detailItem}>
              <FontAwesome name="tint" size={24} color="#007BFF" />
              <Text style={styles.detailLabel}>Humidité</Text>
              <Text style={styles.detailValue}>{weather.main.humidity}%</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <FontAwesome name="arrow-down" size={24} color="#007BFF" />
              <Text style={styles.detailLabel}>Min</Text>
              <Text style={styles.detailValue}>{Math.round(weather.main.temp_min)}°C</Text>
            </View>
            <View style={styles.detailItem}>
              <FontAwesome name="arrow-up" size={24} color="#007BFF" />
              <Text style={styles.detailLabel}>Max</Text>
              <Text style={styles.detailValue}>{Math.round(weather.main.temp_max)}°C</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <FontAwesome name="wind" size={24} color="#007BFF" />
              <Text style={styles.detailLabel}>Vent</Text>
              <Text style={styles.detailValue}>{Math.round(weather.wind.speed * 3.6)} km/h</Text>
            </View>
            <View style={styles.detailItem}>
              <FontAwesome name="compass" size={24} color="#007BFF" />
              <Text style={styles.detailLabel}>Direction</Text>
              <Text style={styles.detailValue}>{weather.wind.deg}°</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
  cityName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    marginBottom: 20,
    textAlign: 'center',
  },
  mainWeather: {
    alignItems: 'center',
    marginBottom: 30,
  },
  weatherIcon: {
    width: 150,
    height: 150,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 20,
    textTransform: 'capitalize',
    marginTop: 5,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 3,
  },
});
