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

  const isDarkBackground = data.list[0].weather[0].description.includes('pluie');
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
  },
});