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
import { faSearch, faCrosshairs, faSpinner } from '@fortawesome/free-solid-svg-icons';

const API_KEY = 'd6def4924ad5f9a9b59f3ae895b234cb';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const GEO_API_URL = 'https://api.openweathermap.org/geo/1.0/direct';

// Fonction pour obtenir l'image de background en fonction de la météo
const getBackgroundImage = (description) => {
  if (description.includes('pluie')) return require('./assets/bckg_pluie.jpg');
  if (description.includes('neige')) return require('./assets/bckg_neige.jpg');
  if (description.includes('orage')) return require('./assets/bckg_orage.jpg');
  if (description.includes('brouillard') || description.includes('brume')) return require('./assets/bckg_brouillard.jpg');
  if (description.includes('nuage',) || description.includes('couvert')) return require('./assets/bckg_nuage.jpg');
  if (description.includes('sable') || description.includes('cendres') || description.includes('tornade')) {
    return require('./assets/bckg_special.jpg');
  }
  return require('./assets/background.jpg'); // Par défaut, ciel dégagé
};

export default function App() {
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // État de chargement

  // Fonction pour récupérer la météo de la localisation actuelle
  const fetchWeatherForCurrentLocation = async () => {
    setIsLoading(true); // Afficher le loader
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission de localisation refusée.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      setLocation({ latitude, longitude });
      await fetchWeatherData(latitude, longitude);
    } catch (err) {
      console.log('Erreur lors de la récupération de la localisation : ', err);
      setError('Impossible de récupérer la localisation.');
    } finally {
      setIsLoading(false); // Cacher le loader
    }
  };

  // Fonction pour récupérer les données météo pour une localisation donnée (ville ou coordonnées)
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

  // Fonction pour rechercher les coordonnées d'une ville
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
      await fetchWeatherData(lat, lon);

      setCity('');
      Keyboard.dismiss();
    } catch (err) {
      console.log('Erreur lors de la recherche de la ville : ', err);
      setError('Impossible de récupérer la localisation pour cette ville.');
    }
  };

  // Récupérer l'image de background
  const backgroundImage = weatherData
    ? getBackgroundImage(weatherData.list[0].weather[0].description)
    : require('./assets/background.jpg');

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        {error && <Text style={styles.error}>{error}</Text>}
        <View style={styles.searchContainer}>
          {/* Champ de recherche */}
          <TextInput
            style={styles.input}
            placeholder="Entrez une ville..."
            value={city}
            onChangeText={setCity}
          />
          
          {/* Bouton de localisation */}
          <Pressable
            style={styles.locationButton}
            onPress={fetchWeatherForCurrentLocation}
            disabled={isLoading} // Désactive le bouton pendant le chargement
          >
            {isLoading ? (
              <FontAwesomeIcon icon={faSpinner} size={20} color="#fff" spin />
            ) : (
              <FontAwesomeIcon icon={faCrosshairs} size={20} color="#fff" />
            )}
          </Pressable>
          
          {/* Bouton de recherche */}
          <Pressable style={styles.searchButton} onPress={fetchCityCoordinates}>
            <FontAwesomeIcon icon={faSearch} size={20} color="#fff" />
          </Pressable>
        </View>

        {/* Affichage des données météo actuelles */}
        {weatherData && <CurrentWeather data={weatherData} />}

        {/* Affichage des prévisions météo */}
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
    marginTop: 75,
    marginBottom: 20,
  },
  locationButton: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10, // Espacement entre le bouton et le champ de recherche
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
