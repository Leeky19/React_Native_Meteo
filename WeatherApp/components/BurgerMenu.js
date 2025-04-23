import React, { useState } from 'react';
import { View } from 'react-native';
import { Appbar, Menu } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function BurgerMenu() {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Appbar.Header>
      <View style={{ flex: 1 }} />
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Appbar.Action icon="menu" color="white" onPress={openMenu} />}
      >
        <Menu.Item onPress={() => { closeMenu(); navigation.navigate('Accueil'); }} title="Accueil" />
        <Menu.Item onPress={() => { closeMenu(); navigation.navigate('Pluie'); }} title="Prévisions de pluie" />
        <Menu.Item onPress={() => { closeMenu(); navigation.navigate('Recherche'); }} title="Recherche" />
      </Menu>
    </Appbar.Header>
  );
}
