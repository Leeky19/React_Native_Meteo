import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  SafeAreaView,
  ImageBackground,
  Text,
  Keyboard,
} from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import CurrentWeather from './components/CurrentWeather';
import ForecastWeather from './components/ForecastWeather';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const API_KEY = 'd6def4924ad5f9a9b59f3ae895b234cb';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const GEO_API_URL = 'https://api.openweathermap.org/geo/1.0/direct';

export default function App() {
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [error, setError] = useState(null);

  // Récupérer la localisation et les données météo au démarrage
  useEffect(() => {
    const fetchLocationAndWeather = async () => {
      try {
        // Demander l'autorisation de localisation
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission de localisation refusée.');
          return;
        }

        // Récupérer la position actuelle
        const currentLocation = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = currentLocation.coords;

        // Mettre à jour l'état avec la localisation
        setLocation({ latitude, longitude });

        // Récupérer les données météo pour la localisation
        await fetchWeatherData(latitude, longitude);
      } catch (err) {
        console.log('Erreur lors de la récupération de la localisation : ', err);
        setError('Impossible de récupérer la localisation.');
      }
    };

    fetchLocationAndWeather();
  }, []);

  // Fonction pour récupérer les données météo via l'API
  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await axios.get(WEATHER_API_URL, {
        params: {
          lat: latitude,
          lon: longitude,
          units: 'metric',
          lang: 'fr',
          appid: API_KEY,
        },
      });
      setWeatherData(response.data);
    } catch (err) {
      console.log('Erreur lors de la récupération des données météo : ', err);
      setError('Impossible de récupérer les données météo.');
    }
  };

  // Fonction pour rechercher une ville et récupérer ses coordonnées
  const fetchCityCoordinates = async () => {
    try {
      if (!city.trim()) return;

      const response = await axios.get(GEO_API_URL, {
        params: {
          q: city,
          limit: 1,
          appid: API_KEY,
        },
      });

      if (response.data.length === 0) {
        setError('Ville non trouvée.');
        return;
      }

      const { lat, lon } = response.data[0];
      setLocation({ latitude: lat, longitude: lon });

      // Récupérer les données météo pour la nouvelle localisation
      await fetchWeatherData(lat, lon);

      // Réinitialiser l'état de la ville et fermer le clavier
      setCity('');
      Keyboard.dismiss();
    } catch (err) {
      console.log('Erreur lors de la recherche de la ville : ', err);
      setError('Impossible de récupérer la localisation pour cette ville.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('./assets/background.jpg')}
        style={styles.backgroundImage}
      >
        {error && <Text style={styles.error}>{error}</Text>}

        {/* Météo actuelle */}
        {weatherData && <CurrentWeather data={weatherData} />}

        {/* Champ de recherche */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Entrez une ville..."
            value={city}
            onChangeText={setCity}
          />
          <Pressable style={styles.searchButton} onPress={fetchCityCoordinates}>
            <FontAwesomeIcon icon={faSearch} size={20} color="#fff" />
          </Pressable>
        </View>

        {/* Prévisions météo */}
        {weatherData && <ForecastWeather data={weatherData} />}
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
