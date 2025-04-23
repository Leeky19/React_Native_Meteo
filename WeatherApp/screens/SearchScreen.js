import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView,
  FlatList,
  Alert,
  ImageBackground
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BurgerMenu from '../components/BurgerMenu';

const API_KEY = 'd6def4924ad5f9a9b59f3ae895b234cb'; // OpenWeatherMap API key
const STORAGE_KEY = '@recent_searches';

export default function SearchScreen() {
  const [city, setCity] = useState('');
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

  // Function to get the appropriate background image based on weather condition
  const getBackgroundImage = () => {
    if (!forecast || !forecast.list || forecast.list.length === 0) {
      return require('../assets/background.jpg');
    }

    // Use the first forecast item for the background
    const weatherCondition = forecast.list[0].weather[0].main.toLowerCase();

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

  // Load recent searches from AsyncStorage when component mounts
  useEffect(() => {
    loadRecentSearches();
  }, []);

  // Load recent searches from AsyncStorage
  const loadRecentSearches = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue !== null) {
        setRecentSearches(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Failed to load recent searches', e);
    }
  };

  // Save a new search to AsyncStorage
  const saveSearch = async (cityName) => {
    try {
      // Create a new array with the current search at the beginning
      const updatedSearches = [
        cityName,
        ...recentSearches.filter(item => item !== cityName)
      ].slice(0, 5); // Keep only the 5 most recent searches

      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSearches));
    } catch (e) {
      console.error('Failed to save recent search', e);
    }
  };

  // Handle search button press
  const handleSearch = async () => {
    if (!city.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un nom de ville');
      return;
    }

    setLoading(true);
    setError(null);
    setForecast(null);

    try {
      // First, get the coordinates for the city
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
      );

      if (geoResponse.data.length === 0) {
        setError('Ville non trouvée. Veuillez vérifier l\'orthographe.');
        setLoading(false);
        return;
      }

      const { lat, lon, name } = geoResponse.data[0];

      // Then, get the 5-day forecast
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${API_KEY}`
      );

      setForecast(forecastResponse.data);
      saveSearch(name); // Save the search to AsyncStorage
    } catch (err) {
      setError('Erreur lors de la récupération des données météo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle recent search item press
  const handleRecentSearchPress = (cityName) => {
    setCity(cityName);
    handleSearch();
  };

  return (
    <ImageBackground source={getBackgroundImage()} style={styles.container} resizeMode="cover">
      <BurgerMenu />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Entrez le nom d'une ville"
          value={city}
          onChangeText={setCity}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <FontAwesome name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {recentSearches.length > 0 && !forecast && (
        <View style={styles.recentSearchesContainer}>
          <Text style={styles.recentSearchesTitle}>Recherches récentes</Text>
          <FlatList
            data={recentSearches}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.recentSearchItem}
                onPress={() => handleRecentSearchPress(item)}
              >
                <FontAwesome name="history" size={16} color="#666" style={styles.historyIcon} />
                <Text style={styles.recentSearchText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Chargement des prévisions...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {forecast && (
        <ScrollView style={styles.forecastContainer}>
          <Text style={styles.cityName}>{forecast.city.name}, {forecast.city.country}</Text>
        </ScrollView>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    margin: 20,
    marginTop: 10,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    fontSize: 16,
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
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
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    margin: 20,
  },
  errorText: {
    color: '#ff3333',
    fontSize: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  forecastContainer: {
    flex: 1,
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  recentSearchesContainer: {
    margin: 20,
    marginTop: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 15,
  },
  recentSearchesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 5,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  historyIcon: {
    marginRight: 10,
  },
  recentSearchText: {
    fontSize: 16,
    color: '#333',
  },
});
