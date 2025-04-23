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
  Alert
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BurgerMenu from '../components/BurgerMenu';
import ForecastWeather from '../components/ForecastWeather';

const API_KEY = 'd6def4924ad5f9a9b59f3ae895b234cb'; // OpenWeatherMap API key
const STORAGE_KEY = '@recent_searches';

export default function SearchScreen() {
  const [city, setCity] = useState('');
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

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
    <View style={styles.container}>
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
          <ForecastWeather data={forecast} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  forecastContainer: {
    flex: 1,
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  recentSearchesContainer: {
    margin: 20,
    marginTop: 0,
  },
  recentSearchesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyIcon: {
    marginRight: 10,
  },
  recentSearchText: {
    fontSize: 16,
  },
});
