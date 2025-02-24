import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import MainButton from '../components/mainbutton'; // Ajusta la ruta según tu proyecto
import MenuIcon from '../assets/menu.svg';
import MenuButtons from '../components/menubuttons'; // Importa el archivo del menú

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  return (
    <ImageBackground source={require('../images/habitacion.jpeg')} style={styles.backgroundImage}>
      <MainButton style={styles.topLeftButton} onPress={toggleMenu}>
        <MenuIcon width={35} height={35} />
      </MainButton>
      <MenuButtons visible={menuVisible} />
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Asegura que la imagen cubra todo el fondo
  },
  topLeftButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
