import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, ImageBackground } from 'react-native';
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

  // Function to get the appropriate background image based on weather condition
  const getBackgroundImage = () => {
    if (!weather) return require('../assets/background.jpg');

    const weatherCondition = weather.weather[0].main.toLowerCase();

    switch(weatherCondition) {
      case 'clouds':
        return require('../assets/bckg_nuage.jpg');
      case 'rain':
      case 'drizzle':
        return require('../assets/bckg_pluie.jpg');
      case 'thunderstorm':
        return require('../assets/bckg_orage.jpg');
      case 'snow':
        return require('../assets/bckg_neige.jpg');
      case 'fog':
      case 'mist':
      case 'haze':
        return require('../assets/bckg_brouillard.jpg');
      default:
        return require('../assets/background.jpg');
    }
  };

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
      <ImageBackground source={require('../assets/background.jpg')} style={styles.container} resizeMode="cover">
        <BurgerMenu />
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Chargement des données météo...</Text>
      </ImageBackground>
    );
  }

  if (error) {
    return (
      <ImageBackground source={require('../assets/background.jpg')} style={styles.container} resizeMode="cover">
        <BurgerMenu />
        <Text style={styles.errorText}>{error}</Text>
      </ImageBackground>
    );
  }

  if (!weather) {
    return (
      <ImageBackground source={require('../assets/background.jpg')} style={styles.container} resizeMode="cover">
        <BurgerMenu />
        <Text style={styles.errorText}>Aucune donnée météo disponible</Text>
      </ImageBackground>
    );
  }

  // Format date
  const date = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = new Intl.DateTimeFormat('fr-FR', options).format(date);

  return (
    <ImageBackground source={getBackgroundImage()} style={styles.container} resizeMode="cover">
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  errorText: {
    color: '#ff3333',
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
    borderRadius: 5,
  },
  cityName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  date: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
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
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  description: {
    fontSize: 20,
    textTransform: 'capitalize',
    marginTop: 5,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
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
