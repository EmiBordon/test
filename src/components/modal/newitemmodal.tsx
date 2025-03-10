import React from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface NewItemModalProps {
  visible: boolean;
  onClose: () => void;
  icon: React.ReactNode;
  name: string;
  description: string;
}

const NewItemModal: React.FC<NewItemModalProps> = ({ visible, onClose, icon, name, description }) => {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.headerText}>Haz Obtenido un Nuevo Item!</Text>
          <View style={styles.contentContainer}>
            {icon}
            <Text style={styles.itemName}>{name}</Text>
            <Text style={styles.itemDescription}>{description}</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default NewItemModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo semitransparente negro
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white', // Gris oscuro
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    borderWidth: 4,
  },
  headerText: {
    color: 'black', // Blanco
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  itemName: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  itemDescription: {
    color: 'black', // Gris claro
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: 'black', // Blanco
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white', // Gris oscuro
    fontSize: 16,
    fontWeight: 'bold',
  },
});
