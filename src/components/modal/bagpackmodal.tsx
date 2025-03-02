import React from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import CurrentWeaponIcon from '../currentweapon';

const BagPackModal = ({ visible, onClose }) => {
  const { width, height } = Dimensions.get('window');
  const modalWidth = width * 0.9;
  const modalHeight = height * 0.6;

  // Simulación de objetos divididos en categorías
  const sections = {
    ARMAS: ['Arco', 'Daga'], // Quitamos la "Espada" porque estará como CurrentWeaponIcon
    CURACIÓN: ['Poción', 'Hierba', 'Antídoto'],
    OBJETOS: ['Llave', 'Mapa', 'Gema'],
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { width: modalWidth, height: modalHeight }]}>
          <Text style={styles.headerText}>Inventario</Text>

          {/* Renderizado de cada sección */}
          {Object.entries(sections).map(([section, items]) => (
            <View key={section} style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{section}</Text>
              <View style={styles.itemsContainer}>
                {/* Si es la sección ARMAS, el primer casillero será el ícono del arma actual */}
                {section === 'ARMAS' && (
                  <View style={styles.itemTouchable}>
                    <CurrentWeaponIcon />
                  </View>
                )}
                {/* Renderizamos el resto de los objetos normalmente */}
                {items.map((item, index) => (
                  <TouchableOpacity key={index} style={styles.itemTouchable}>
                    <Text style={styles.itemText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BagPackModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'gray',
    borderRadius: 15,
    padding: 20,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sectionContainer: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemTouchable: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  itemText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
