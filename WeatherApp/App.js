import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import TabNavigator from './navigation/TabNavigator';

export default function App() {
  return (
    <PaperProvider>
      <TabNavigator />
    </PaperProvider>
  );
}
