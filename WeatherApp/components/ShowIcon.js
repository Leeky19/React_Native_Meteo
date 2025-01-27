import React from 'react';
import { Image, StyleSheet } from 'react-native';

export default function ShowIcon({ icon, resolution, size }) {
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@${resolution}.png`;
  return <Image source={{ uri: iconUrl }} style={[styles.icon, { width: size, height: size }]} />;
}

const styles = StyleSheet.create({
  icon: { resizeMode: 'contain' },
});