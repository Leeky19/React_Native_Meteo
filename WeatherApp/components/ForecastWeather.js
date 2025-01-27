import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Weather from './Weather';

export default function ForecastWeather({ data }) {
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    if (data) {
      const groupedForecast = data.list.reduce((acc, weather) => {
        const date = weather.dt_txt.split(' ')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(weather);
        return acc;
      }, {});
      setForecast(Object.values(groupedForecast));
    }
  }, [data]);

  return (
    <ScrollView horizontal style={styles.scrollView}>
      {forecast.map((day, index) => (
        <Weather key={index} forecast={day[0]} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { marginTop: 10 },
});