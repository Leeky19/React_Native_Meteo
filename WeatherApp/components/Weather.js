import React from 'react';
import { View, Text, StyleSheet, Image, Platform, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

export default function Weather({ forecast, isDarkBackground }) {
  const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
  const hour = new Date(forecast.dt_txt).getHours();
  const temperature = Math.round(forecast.main.temp);
  const textColor = isDarkBackground ? '#fff' : '#333';
  const weatherCondition = forecast.weather[0].main.toLowerCase();

  // Determine gradient colors based on weather condition and background
  const getGradientColors = () => {
    if (isDarkBackground) {
      return ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)'];
    }

    switch(weatherCondition) {
      case 'clear':
        return ['rgba(255, 166, 0, 0.2)', 'rgba(255, 166, 0, 0.05)'];
      case 'clouds':
        return ['rgba(108, 122, 137, 0.2)', 'rgba(108, 122, 137, 0.05)'];
      case 'rain':
      case 'drizzle':
        return ['rgba(41, 128, 185, 0.2)', 'rgba(41, 128, 185, 0.05)'];
      case 'thunderstorm':
        return ['rgba(142, 68, 173, 0.2)', 'rgba(142, 68, 173, 0.05)'];
      case 'snow':
        return ['rgba(236, 240, 241, 0.3)', 'rgba(236, 240, 241, 0.1)'];
      case 'mist':
      case 'fog':
      case 'haze':
        return ['rgba(189, 195, 199, 0.2)', 'rgba(189, 195, 199, 0.05)'];
      default:
        return ['rgba(0, 123, 255, 0.2)', 'rgba(0, 123, 255, 0.05)'];
    }
  };

  // Get weather icon
  const getWeatherIcon = () => {
    switch(weatherCondition) {
      case 'clear':
        return 'sun';
      case 'clouds':
        return 'cloud';
      case 'rain':
        return 'cloud-rain';
      case 'drizzle':
        return 'cloud-rain';
      case 'thunderstorm':
        return 'bolt';
      case 'snow':
        return 'snowflake';
      case 'mist':
      case 'fog':
      case 'haze':
        return 'smog';
      default:
        return 'cloud';
    }
  };

  return (
    <LinearGradient
      colors={getGradientColors()}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.contentContainer}>
        <View style={styles.hourContainer}>
          <FontAwesome5 name="clock" size={12} color={textColor} style={styles.hourIcon} />
          <Text style={[styles.hour, { color: textColor }]}>{hour}h</Text>
        </View>

        <View style={styles.iconContainer}>
          <Image source={{ uri: iconUrl }} style={styles.icon} />
        </View>

        <View style={styles.tempContainer}>
          <Text style={[styles.temp, { color: textColor }]}>{temperature}°</Text>
          <FontAwesome5 
            name={getWeatherIcon()} 
            size={14} 
            color={textColor} 
            style={styles.weatherIcon} 
            solid 
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    borderRadius: 20,
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
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  contentContainer: {
    alignItems: 'center',
    padding: 15,
    paddingVertical: 18,
  },
  hourContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hourIcon: {
    marginRight: 5,
  },
  hour: {
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 40,
    padding: 5,
    marginVertical: 5,
  },
  icon: {
    width: 65,
    height: 65,
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  temp: {
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  weatherIcon: {
    marginLeft: 5,
  },
});
