// Location.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { font } from './fontsize';
import { useNavigation } from '@react-navigation/native';
import MenuButton from './menubutton';

const Location: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigation = useNavigation();

  const handleAccept = () => {
    setShowMenu(false);
    navigation.replace('Home');
  };

  return (
    <>
      <MenuButton onPress={() => setShowMenu(!showMenu)} />

      {showMenu && (
        <View style={styles.menuContainer}>
          <Text style={styles.menuText}>Ir al Menu</Text>
          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.button} onPress={handleAccept}>
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setShowMenu(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    top: '8%',
    left: '2%',
    backgroundColor: 'rgba(18, 7, 2, 0.97)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#C8A84B',
    elevation: 6,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    zIndex: 9,
  },
  menuText: {
    fontSize: font(14),
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#C8A84B',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    backgroundColor: '#6B2D0A',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#C8A84B',
    shadowColor: '#C8A84B',
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#C8A84B',
    fontSize: font(13),
    fontWeight: 'bold',
  },
});

export default Location;
