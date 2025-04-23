import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity, ImageBackground, Platform } from 'react-native';
import MapView, { UrlTile, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import BurgerMenu from '../components/BurgerMenu';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const API_KEY = 'd6def4924ad5f9a9b59f3ae895b234cb'; // OpenWeatherMap API key
const { width, height } = Dimensions.get('window');

export default function RainForecastScreen() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [region, setRegion] = useState({
    latitude: 46.603354, // Default to center of France
    longitude: 1.888334,
    latitudeDelta: 10,
    longitudeDelta: 10,
  });
  const [mapType, setMapType] = useState('standard');

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

        // Update map region to center on user's location
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 1,
          longitudeDelta: 1,
        });
      } catch (err) {
        setError('Erreur lors de la récupération de la localisation');
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleMapType = () => {
    setMapType(mapType === 'standard' ? 'satellite' : 'standard');
  };

  const centerOnUserLocation = () => {
    if (location) {
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      });
    }
  };

  if (loading) {
    return (
      <ImageBackground source={require('../assets/background.jpg')} style={styles.container} resizeMode="cover">
        <BurgerMenu />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Chargement de la carte...</Text>
        </View>
      </ImageBackground>
    );
  }

  if (error) {
    return (
      <ImageBackground source={require('../assets/background.jpg')} style={styles.container} resizeMode="cover">
        <BurgerMenu />
        <View style={styles.errorContainer}>
          <FontAwesome5 name="exclamation-circle" size={40} color="#e53935" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <View style={styles.container}>
      <BurgerMenu />
      <View style={styles.mapContainer}>
        <MapView 
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          mapType={mapType}
        >
          <UrlTile 
            urlTemplate={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
            zIndex={1}
            maximumZ={19}
          />
          {location && (
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Votre position"
            >
              <View style={styles.markerContainer}>
                <FontAwesome5 name="map-marker-alt" size={24} color="#007BFF" />
              </View>
            </Marker>
          )}
        </MapView>

        {/* Map Controls */}
        <View style={styles.mapControlsContainer}>
          <TouchableOpacity 
            style={styles.mapControlButton}
            onPress={toggleMapType}
          >
            <LinearGradient
              colors={['#007BFF', '#0056b3']}
              style={styles.controlButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FontAwesome5 
                name={mapType === 'standard' ? 'satellite' : 'map'} 
                size={18} 
                color="white" 
              />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.mapControlButton}
            onPress={centerOnUserLocation}
          >
            <LinearGradient
              colors={['#007BFF', '#0056b3']}
              style={styles.controlButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FontAwesome5 name="location-arrow" size={18} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Legend */}
        <View style={styles.legendContainer}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(240, 240, 240, 0.95)']}
            style={styles.legendGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <Text style={styles.legendTitle}>Intensité des précipitations</Text>
            <View style={styles.legendRow}>
              <View style={[styles.legendColor, { backgroundColor: 'rgba(0, 255, 255, 0.7)' }]} />
              <Text style={styles.legendText}>Pluie légère</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendColor, { backgroundColor: 'rgba(0, 0, 255, 0.7)' }]} />
              <Text style={styles.legendText}>Pluie modérée</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 0, 0, 0.7)' }]} />
              <Text style={styles.legendText}>Pluie forte</Text>
            </View>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#e53935',
    fontSize: 18,
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
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: width,
    height: height,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapControlsContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    alignItems: 'center',
  },
  mapControlButton: {
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  controlButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  legendContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 15,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  legendGradient: {
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    paddingBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 8,
    borderRadius: 10,
  },
  legendColor: {
    width: 24,
    height: 24,
    marginRight: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  legendText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});
