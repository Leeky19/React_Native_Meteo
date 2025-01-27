import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import Weather from './Weather';

// Fonction pour formater la date
const formatDate = (dateString) => {
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', options).format(date);
};

export default function ForecastWeather({ data }) {
  const [forecastList, setForecastList] = useState([]);

  useEffect(() => {
    if (data && data.list) {
      // Grouper les prévisions par jour
      const groupedByDay = data.list.reduce((acc, forecast) => {
        const date = forecast.dt_txt.split(' ')[0]; // Récupère uniquement la date (AAAA-MM-JJ)
        if (!acc[date]) acc[date] = [];
        acc[date].push(forecast); // Ajoute chaque prévision au jour correspondant
        return acc;
      }, {});

      // Préparer la liste pour l'affichage
      const dailyForecasts = Object.keys(groupedByDay).map((date) => ({
        date,
        forecasts: groupedByDay[date], // Toutes les prévisions de ce jour
      }));

      setForecastList(dailyForecasts.slice(0, 5)); // Affiche uniquement les 5 prochains jours
    }
  }, [data]);

  return (
    <ScrollView style={styles.container}>
      {forecastList.map((day, index) => (
        <View key={index} style={styles.dayContainer}>
          {/* Formatage de la date */}
          <Text style={styles.dateText}>{formatDate(day.date)}</Text>
          <ScrollView horizontal>
            {day.forecasts.map((forecast, i) => (
              <Weather key={i} forecast={forecast} />
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
