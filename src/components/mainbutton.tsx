import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

interface MainButtonProps {
  onPress: () => void; // Función que se ejecutará al presionar el botón
  style?: ViewStyle;   // Estilo adicional opcional
  children?: React.ReactNode; // SVG o contenido que se mostrará dentro del botón
}

const MainButton: React.FC<MainButtonProps> = ({ onPress, style, children }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style]}
      activeOpacity={0.7} // Reducirá la opacidad al presionarlo
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 80, // Tamaño del círculo
    height: 80,
    borderRadius: 40, // Hace que sea circular
    backgroundColor: '#A6DBDF', // Color beige
    borderWidth: 3,
    borderColor: '#632E75', // Color marrón para el borde
    justifyContent: 'center',
    alignItems: 'center', // Centra el contenido dentro del botón
  },
});

export default MainButton;
