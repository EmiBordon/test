import React from 'react';
import { View, StyleSheet } from 'react-native';
import MainButton from '../components/mainbutton'; // Ajusta la ruta según tu proyecto
import NotesIcon from '../assets/notas.svg';
import CineIcon from '../assets/cine.svg';
import LoveIcon from '../assets/love.svg';
import GameIcon from '../assets/game.svg';
import ConfigIcon from '../assets/config.svg';
import { useNavigation } from '@react-navigation/native'; // Importar hook de navegación

interface MenuButtonsProps {
  visible: boolean; // Controla si los botones se muestran o no
}

const MenuButtons: React.FC<MenuButtonsProps> = ({ visible }) => {
  const navigation = useNavigation(); // Objeto de navegación

  if (!visible) return null;

  const icons = [
    <NotesIcon width={35} height={35} />,
    <CineIcon width={35} height={35} />,
    <LoveIcon width={35} height={35} />,
    <GameIcon width={35} height={35} />,
    <ConfigIcon width={35} height={35} />,
  ];

  return (
    <View style={styles.menuContainer}>
      {icons.map((icon, index) => (
        <MainButton
          key={index}
          style={styles.menuButton}
          onPress={() => {
            if (index === 0) {
              navigation.navigate('Notes'); // Navegar a NotesScreen
            } else {
              console.log(`Botón ${index + 1} presionado`);
            }
          }}
        >
          {icon}
        </MainButton>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    top: 85,
    left: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: 160,
  },
  menuButton: {
    width: 55,
    height: 55,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MenuButtons;
