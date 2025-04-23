import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, ImageBackground, Platform } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
        <View style={styles.headerContainer}>
          <View style={styles.cityNameContainer}>
            <FontAwesome5 name="map-marker-alt" size={20} color="white" style={styles.locationIcon} />
            <Text style={styles.cityName}>{weather.name}</Text>
          </View>
          <View style={styles.dateContainer}>
            <FontAwesome5 name="calendar-alt" size={16} color="white" style={styles.calendarIcon} />
            <Text style={styles.date}>{formattedDate}</Text>
          </View>
        </View>

        <View style={styles.mainWeather}>
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.3)']}
            style={styles.mainWeatherGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.weatherIconContainer}>
              <Image 
                source={{ uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png` }} 
                style={styles.weatherIcon} 
              />
            </View>
            <Text style={styles.temperature}>{Math.round(weather.main.temp)}°C</Text>
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>{weather.weather[0].description}</Text>
              <View style={styles.weatherTimeContainer}>
                <FontAwesome5 name="clock" size={14} color="white" style={styles.clockIcon} />
                <Text style={styles.weatherTime}>
                  {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <LinearGradient
                colors={['rgba(0, 123, 255, 0.1)', 'rgba(0, 123, 255, 0.05)']}
                style={styles.iconBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <FontAwesome5 name="temperature-high" size={20} color="#007BFF" solid />
              </LinearGradient>
              <Text style={styles.detailLabel}>Ressenti</Text>
              <Text style={styles.detailValue}>{Math.round(weather.main.feels_like)}°C</Text>
            </View>
            <View style={styles.detailItem}>
              <LinearGradient
                colors={['rgba(0, 123, 255, 0.1)', 'rgba(0, 123, 255, 0.05)']}
                style={styles.iconBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <FontAwesome5 name="tint" size={20} color="#007BFF" solid />
              </LinearGradient>
              <Text style={styles.detailLabel}>Humidité</Text>
              <Text style={styles.detailValue}>{weather.main.humidity}%</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <LinearGradient
                colors={['rgba(0, 123, 255, 0.1)', 'rgba(0, 123, 255, 0.05)']}
                style={styles.iconBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <FontAwesome5 name="temperature-low" size={20} color="#007BFF" solid />
              </LinearGradient>
              <Text style={styles.detailLabel}>Min</Text>
              <Text style={styles.detailValue}>{Math.round(weather.main.temp_min)}°C</Text>
            </View>
            <View style={styles.detailItem}>
              <LinearGradient
                colors={['rgba(0, 123, 255, 0.1)', 'rgba(0, 123, 255, 0.05)']}
                style={styles.iconBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <FontAwesome5 name="temperature-high" size={20} color="#007BFF" solid />
              </LinearGradient>
              <Text style={styles.detailLabel}>Max</Text>
              <Text style={styles.detailValue}>{Math.round(weather.main.temp_max)}°C</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <LinearGradient
                colors={['rgba(0, 123, 255, 0.1)', 'rgba(0, 123, 255, 0.05)']}
                style={styles.iconBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <FontAwesome5 name="wind" size={20} color="#007BFF" solid />
              </LinearGradient>
              <Text style={styles.detailLabel}>Vent</Text>
              <Text style={styles.detailValue}>{Math.round(weather.wind.speed * 3.6)} km/h</Text>
            </View>
            <View style={styles.detailItem}>
              <LinearGradient
                colors={['rgba(0, 123, 255, 0.1)', 'rgba(0, 123, 255, 0.05)']}
                style={styles.iconBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <FontAwesome5 name="compass" size={20} color="#007BFF" solid />
              </LinearGradient>
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
    marginTop: 15,
    fontSize: 16,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  errorText: {
    color: '#e53935',
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
    fontWeight: '500',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 15,
    borderRadius: 15,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
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
    marginBottom: 30,
    borderRadius: 25,
    width: '100%',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  mainWeatherGradient: {
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  weatherIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 80,
    padding: 5,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  weatherIcon: {
    width: 160,
    height: 160,
  },
  temperature: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginVertical: 10,
  },
  descriptionContainer: {
    alignItems: 'center',
    width: '100%',
  },
  description: {
    fontSize: 24,
    textTransform: 'capitalize',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
  },
  weatherTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginTop: 5,
  },
  clockIcon: {
    marginRight: 5,
  },
  weatherTime: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    margin: 5,
    padding: 15,
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
    borderWidth: 1,
    borderColor: 'rgba(0, 123, 255, 0.1)',
  },
  iconBackground: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#007BFF',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
    borderWidth: 1,
    borderColor: 'rgba(0, 123, 255, 0.2)',
  },
  detailLabel: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
    fontWeight: '500',
    backgroundColor: 'rgba(0, 123, 255, 0.05)',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  detailValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#007BFF',
    textShadowColor: 'rgba(0, 123, 255, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
