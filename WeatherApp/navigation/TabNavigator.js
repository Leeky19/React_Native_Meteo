import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Platform, StyleSheet, Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import RainForecastScreen from '../screens/RainForecastScreen';
import SearchScreen from '../screens/SearchScreen';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size, focused }) => {
            let iconName;
            if (route.name === 'Accueil') iconName = 'home';
            else if (route.name === 'Pluie') iconName = 'cloud-rain';
            else if (route.name === 'Recherche') iconName = 'search-location';

            return (
              <View style={[
                styles.iconContainer,
                focused ? styles.iconContainerFocused : null
              ]}>
                {focused ? (
                  <LinearGradient
                    colors={['#007BFF', '#0056b3']}
                    style={styles.iconBackground}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <FontAwesome5 
                      name={iconName} 
                      size={size - 2} 
                      color="white" 
                      solid 
                    />
                  </LinearGradient>
                ) : (
                  <FontAwesome5 
                    name={iconName} 
                    size={size - 2} 
                    color={color} 
                    solid 
                  />
                )}
              </View>
            );
          },
          tabBarLabel: ({ focused, color }) => {
            return (
              <Text style={[
                styles.tabLabel,
                { color: focused ? '#007BFF' : 'gray' }
              ]}>
                {route.name}
              </Text>
            );
          },
          tabBarActiveTintColor: '#007BFF',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            height: 65,
            paddingBottom: 10,
            paddingTop: 10,
            backgroundColor: 'white',
            borderTopWidth: 0,
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
              },
              android: {
                elevation: 8,
              },
            }),
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Accueil" component={HomeScreen} />
        <Tab.Screen name="Pluie" component={RainForecastScreen} />
        <Tab.Screen name="Recherche" component={SearchScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    marginTop: 5,
  },
  iconContainerFocused: {
    transform: [{ translateY: -5 }],
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#007BFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
    marginBottom: -5,
  },
});
