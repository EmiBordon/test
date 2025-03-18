// Location.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { font } from './fontsize';
import { MenuIcon } from '../SvgExporter';
import { useNavigation } from '@react-navigation/native';

interface LocationProps {
  text: string;
}

const Location: React.FC<LocationProps> = ({ text }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigation = useNavigation();

  const handleAccept = () => {
    setShowMenu(false);
    navigation.replace('Home');
  };

  return (
    <>
      <TouchableOpacity style={styles.menuButton} onPress={() => setShowMenu(!showMenu)}>
        <View style={styles.circle}>
          <MenuIcon width={font(25)} height={font(25)} fill="white" />
        </View>
      </TouchableOpacity>

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

      <View style={styles.container}>
        <Text style={styles.locationText}>{text}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    top: '1%',
    left: '2%',
    zIndex: 10,
    padding: 5,
  },
  circle: {
    backgroundColor: 'black',
    borderRadius: 15,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    position: 'absolute',
    top: '8%',
    left: '2%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 9,
  },
  menuText: {
    fontSize: font(14),
    marginBottom: 8,
    fontWeight: 'bold',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: font(13),
    fontWeight: 'bold',
  },
  container: {
    position: 'absolute',
    top: '1%',
    right: '2%',
    backgroundColor: 'black',
    padding: '2%',
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  locationText: {
    color: 'white',
    fontSize: font(15),
    fontWeight: 'bold',
  },
});

export default Location;
