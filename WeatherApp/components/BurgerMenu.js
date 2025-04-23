import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Appbar, Menu, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

export default function BurgerMenu() {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <LinearGradient
      colors={['rgba(0, 123, 255, 0.9)', 'rgba(0, 83, 175, 0.9)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.header}
    >
      <Appbar.Header style={styles.appbarHeader}>
        <Appbar.Content title="Météo App" titleStyle={styles.title} />
        <View style={styles.menuContainer}>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            contentStyle={styles.menuContent}
            anchor={
              <Appbar.Action 
                icon={({ size, color }) => (
                  <FontAwesome name="bars" size={size} color="white" />
                )}
                color="white" 
                onPress={openMenu}
                style={styles.menuButton}
              />
            }
          >
            <Menu.Item 
              onPress={() => { closeMenu(); navigation.navigate('Accueil'); }} 
              title="Accueil" 
              leadingIcon="home"
              titleStyle={styles.menuItemText}
            />
            <Menu.Item 
              onPress={() => { closeMenu(); navigation.navigate('Pluie'); }} 
              title="Prévisions de pluie" 
              leadingIcon="cloud"
              titleStyle={styles.menuItemText}
            />
            <Menu.Item 
              onPress={() => { closeMenu(); navigation.navigate('Recherche'); }} 
              title="Recherche" 
              leadingIcon="magnify"
              titleStyle={styles.menuItemText}
            />
          </Menu>
        </View>
      </Appbar.Header>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  appbarHeader: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  menuContainer: {
    marginRight: 10,
  },
  menuButton: {
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
