import React from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

const BagPackModal = ({ visible, onClose }) => {
  const { width, height } = Dimensions.get('window');
  const modalWidth = width * 0.9;
  const modalHeight = height * 0.6;

  // Simulamos 9 objetos
  const items = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { width: modalWidth, height: modalHeight }]}>
          <Text style={styles.headerText}>Objetos</Text>
          <View style={styles.itemsContainer}>
            {items.map((item) => (
              <TouchableOpacity key={item} style={styles.itemTouchable}>
                <Text style={styles.itemText}>Objeto {item}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
    backgroundColor: '#000', // Fondo negro
    borderRadius: 15,
    padding: 20,
    borderWidth: 3,
    borderColor: '#fff', // Borde blanco
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  headerText: {
    fontSize: 24,
    color: '#fff', // Texto blanco
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemTouchable: {
    width: '30%',         // Aproximadamente 3 por fila
    aspectRatio: 1,        // Mantiene el cuadrado
    backgroundColor: '#fff', // Fondo blanco para los objetos
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',   // Borde negro
  },
  itemText: {
    color: '#000', // Texto negro
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#fff', // Fondo blanco para el botón
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#000', // Texto negro
    fontSize: 16,
    fontWeight: 'bold',
  },
});
