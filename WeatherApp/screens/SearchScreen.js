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
  ImageBackground,
  Platform,
  Image
} from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
          <FontAwesome5 name="search" size={20} color="white" />
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
                <FontAwesome5 name="history" size={16} color="#007BFF" style={styles.historyIcon} />
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
          <View style={styles.cityContainer}>
            <Text style={styles.cityName}>{forecast.city.name}, {forecast.city.country}</Text>
            <View style={styles.cityInfoContainer}>
              <View style={styles.infoItem}>
                <FontAwesome5 name="map-marker-alt" size={18} color="#007BFF" style={styles.infoIcon} />
                <Text style={styles.infoText}>
                  {forecast.city.coord.lat.toFixed(2)}°, {forecast.city.coord.lon.toFixed(2)}°
                </Text>
              </View>
              <View style={styles.infoItem}>
                <FontAwesome5 name="users" size={18} color="#007BFF" style={styles.infoIcon} />
                <Text style={styles.infoText}>
                  {forecast.city.population.toLocaleString()} habitants
                </Text>
              </View>
            </View>

            {/* Current Weather */}
            <View style={styles.currentWeatherContainer}>
              <LinearGradient
                colors={['rgba(0, 123, 255, 0.1)', 'rgba(0, 123, 255, 0.05)']}
                style={styles.currentWeatherGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.currentWeatherTitle}>Météo actuelle</Text>
                <View style={styles.currentWeatherContent}>
                  <Image 
                    source={{ uri: `https://openweathermap.org/img/wn/${forecast.list[0].weather[0].icon}@4x.png` }} 
                    style={styles.currentWeatherIcon} 
                  />
                  <View style={styles.currentWeatherDetails}>
                    <Text style={styles.currentTemp}>{Math.round(forecast.list[0].main.temp)}°C</Text>
                    <Text style={styles.currentDesc}>{forecast.list[0].weather[0].description}</Text>
                    <View style={styles.currentExtraInfo}>
                      <View style={styles.extraInfoItem}>
                        <FontAwesome5 name="wind" size={14} color="#007BFF" />
                        <Text style={styles.extraInfoText}>{Math.round(forecast.list[0].wind.speed * 3.6)} km/h</Text>
                      </View>
                      <View style={styles.extraInfoItem}>
                        <FontAwesome5 name="tint" size={14} color="#007BFF" />
                        <Text style={styles.extraInfoText}>{forecast.list[0].main.humidity}%</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* 5-Day Forecast */}
            <View style={styles.forecastDaysContainer}>
              <Text style={styles.forecastDaysTitle}>Prévisions sur 5 jours</Text>

              {/* Group forecast by day */}
              {Array.from(new Set(forecast.list.map(item => 
                new Date(item.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'long' })
              ))).slice(0, 5).map((day, index) => {
                // Get the noon forecast for each day
                const dayForecasts = forecast.list.filter(item => 
                  new Date(item.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'long' }) === day
                );
                const noonForecast = dayForecasts.find(item => 
                  new Date(item.dt * 1000).getHours() >= 12 && 
                  new Date(item.dt * 1000).getHours() <= 14
                ) || dayForecasts[0];

                return (
                  <View key={index} style={styles.forecastDayItem}>
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.9)', 'rgba(240, 240, 240, 0.9)']}
                      style={styles.forecastDayGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.forecastDayHeader}>
                        <Text style={styles.forecastDayName}>
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </Text>
                        <Text style={styles.forecastDayDate}>
                          {new Date(noonForecast.dt * 1000).toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </Text>
                      </View>

                      <View style={styles.forecastDayContent}>
                        <Image 
                          source={{ uri: `https://openweathermap.org/img/wn/${noonForecast.weather[0].icon}@2x.png` }} 
                          style={styles.forecastDayIcon} 
                        />
                        <View style={styles.forecastDayDetails}>
                          <Text style={styles.forecastDayTemp}>
                            {Math.round(noonForecast.main.temp)}°C
                          </Text>
                          <Text style={styles.forecastDayDesc}>
                            {noonForecast.weather[0].description}
                          </Text>
                        </View>
                        <View style={styles.forecastDayExtraInfo}>
                          <View style={styles.forecastExtraItem}>
                            <FontAwesome5 name="wind" size={12} color="#007BFF" />
                            <Text style={styles.forecastExtraText}>
                              {Math.round(noonForecast.wind.speed * 3.6)} km/h
                            </Text>
                          </View>
                          <View style={styles.forecastExtraItem}>
                            <FontAwesome5 name="tint" size={12} color="#007BFF" />
                            <Text style={styles.forecastExtraText}>
                              {noonForecast.main.humidity}%
                            </Text>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>
                  </View>
                );
              })}
            </View>
          </View>
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
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 0,
    borderRadius: 25,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
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
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: '#007BFF',
    borderRadius: 25,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 15,
    margin: 20,
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
  errorText: {
    color: '#e53935',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  forecastContainer: {
    flex: 1,
  },
  cityContainer: {
    margin: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 15,
    padding: 20,
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
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    paddingBottom: 10,
  },
  cityInfoContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(0, 123, 255, 0.05)',
    padding: 12,
    borderRadius: 10,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  // Current Weather Styles
  currentWeatherContainer: {
    marginBottom: 25,
    borderRadius: 15,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  currentWeatherGradient: {
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 123, 255, 0.3)',
  },
  currentWeatherTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    paddingBottom: 8,
  },
  currentWeatherContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentWeatherIcon: {
    width: 100,
    height: 100,
  },
  currentWeatherDetails: {
    flex: 1,
    paddingLeft: 10,
  },
  currentTemp: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  currentDesc: {
    fontSize: 18,
    color: '#555',
    textTransform: 'capitalize',
    marginBottom: 10,
  },
  currentExtraInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  extraInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 8,
  },
  extraInfoText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  // 5-Day Forecast Styles
  forecastDaysContainer: {
    marginTop: 10,
  },
  forecastDaysTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    paddingBottom: 8,
  },
  forecastDayItem: {
    marginBottom: 15,
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
  forecastDayGradient: {
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  forecastDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    paddingBottom: 8,
  },
  forecastDayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  forecastDayDate: {
    fontSize: 14,
    color: '#666',
  },
  forecastDayContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forecastDayIcon: {
    width: 60,
    height: 60,
  },
  forecastDayDetails: {
    flex: 1,
    paddingLeft: 10,
  },
  forecastDayTemp: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  forecastDayDesc: {
    fontSize: 14,
    color: '#555',
    textTransform: 'capitalize',
  },
  forecastDayExtraInfo: {
    marginLeft: 'auto',
  },
  forecastExtraItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 123, 255, 0.05)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 5,
  },
  forecastExtraText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#333',
  },
  recentSearchesContainer: {
    margin: 20,
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 15,
    padding: 15,
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
  recentSearchesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    paddingBottom: 10,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    paddingHorizontal: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  historyIcon: {
    marginRight: 12,
    color: '#007BFF',
  },
  recentSearchText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});
