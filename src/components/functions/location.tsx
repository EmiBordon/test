// Location.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { font } from './fontsize';
import { MenuIcon } from '../SvgExporter';
import { useNavigation } from '@react-navigation/native';

const Location: React.FC = () => {
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
          <MenuIcon width={font(25)} height={font(25)} fill='#D4AF37' />
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
    backgroundColor: '#6B2D0A',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'black',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D4AF37',
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
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
