import React from 'react';
import { Image } from 'react-native';

export default function ShowIcon({ icon, resolution = '2x', size = 50 }) {
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@${resolution}.png`;

  return (
    <Image
      source={{ uri: iconUrl }}
      style={{ width: size, height: size }}
    />
  );
}