import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import Weather from './Weather';

const formatDate = (dateString) => {
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', options).format(date);
};

export default function ForecastWeather({ data }) {
  const [forecastList, setForecastList] = useState([]);

  useEffect(() => {
    if (data && data.list) {
      const groupedByDay = data.list.reduce((acc, forecast) => {
        const date = forecast.dt_txt.split(' ')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(forecast);
        return acc;
      }, {});

      const dailyForecasts = Object.keys(groupedByDay).map((date) => ({
        date,
        forecasts: groupedByDay[date],
      }));

      setForecastList(dailyForecasts.slice(0, 5));
    }
  }, [data]);

  // Check if the background is dark based on weather conditions
  const darkWeatherConditions = ['pluie', 'orage', 'brouillard', 'nuageux', 'neige', 'nuit'];
  const weatherDescription = data.list[0].weather[0].description.toLowerCase();
  const weatherMain = data.list[0].weather[0].main.toLowerCase();
  const isDarkBackground = 
    darkWeatherConditions.some(condition => weatherDescription.includes(condition)) ||
    ['thunderstorm', 'rain', 'drizzle', 'mist', 'fog', 'haze', 'clouds'].includes(weatherMain);

  const textColor = isDarkBackground ? '#fff' : '#000';

  return (
    <ScrollView style={styles.container}>
      {forecastList.map((day, index) => (
        <View key={index} style={styles.dayContainer}>
          <Text style={[styles.dateText, { color: textColor }]}>
            {formatDate(day.date)}
          </Text>
          <ScrollView horizontal>
            {day.forecasts.map((forecast, i) => (
              <Weather key={i} forecast={forecast} isDarkBackground={isDarkBackground} />
            ))}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  dayContainer: {
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
});
