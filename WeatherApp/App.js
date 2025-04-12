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
  Animated,
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

const getBackgroundImage = (description) => {
  if (description.includes('pluie')) return require('./assets/bckg_pluie.jpg');
  if (description.includes('neige')) return require('./assets/bckg_neige.jpg');
  if (description.includes('orage')) return require('./assets/bckg_orage.jpg');
  if (description.includes('brouillard') || description.includes('brume')) return require('./assets/bckg_brouillard.jpg');
  if (description.includes('nuage') || description.includes('couvert')) return require('./assets/bckg_nuage.jpg');
  if (description.includes('sable') || description.includes('cendres') || description.includes('tornade')) return require('./assets/bckg_special.jpg');
  return require('./assets/background.jpg');
};

export default function App() {
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const spinValue = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.stopAnimation();
      spinValue.setValue(0);
    }
  }, [isLoading]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const fetchWeatherForCurrentLocation = async () => {
    setIsLoading(true);
    setError(null); // ← Efface l’erreur au lancement
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
      setIsLoading(false);
    }
  };

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

  const fetchCityCoordinates = async () => {
    setError(null); // ← Efface l’erreur au lancement
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

  const backgroundImage = weatherData
    ? getBackgroundImage(weatherData.list[0].weather[0].description)
    : require('./assets/background.jpg');

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Entrez une ville..."
            value={city}
            onChangeText={setCity}
          />

          <Pressable
            style={styles.locationButton}
            onPress={fetchWeatherForCurrentLocation}
            disabled={isLoading}
          >
            {isLoading ? (
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <FontAwesomeIcon icon={faSpinner} size={20} color="#fff" />
              </Animated.View>
            ) : (
              <FontAwesomeIcon icon={faCrosshairs} size={20} color="#fff" />
            )}
          </Pressable>

          <Pressable style={styles.searchButton} onPress={fetchCityCoordinates}>
            <FontAwesomeIcon icon={faSearch} size={20} color="#fff" />
          </Pressable>
        </View>

        {weatherData && (
          <>
            <CurrentWeather data={weatherData} />
            <ForecastWeather data={weatherData} />
          </>
        )}
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
    marginRight: 10,
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