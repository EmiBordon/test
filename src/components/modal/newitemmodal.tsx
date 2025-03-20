import React, { useState, useEffect } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ItemProps {
  icon: React.ReactNode;
  name: string;
  description: string;
}

interface NewItemModalProps {
  visible: boolean;
  onClose: () => void;
  item1: ItemProps;
  item2?: ItemProps;
  item3?: ItemProps;
  item4?: ItemProps;
}

const NewItemModal: React.FC<NewItemModalProps> = ({ visible, onClose, item1, item2, item3, item4 }) => {
  const items = [item1, item2, item3, item4].filter(Boolean) as ItemProps[];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (visible) setCurrentIndex(0); // Reseteamos al abrir el modal
  }, [visible]);

  const isLastItem = currentIndex === items.length - 1;

  const handleNext = () => {
    if (!isLastItem) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const currentItem = items[currentIndex];

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.headerText}>
            {items.length === 1 ? '¡Haz Obtenido un nuevo item!' : '¡Haz obtenido nuevos ítems!'}
          </Text>
          <View style={styles.contentContainer}>
            {currentItem.icon}
            <Text style={styles.itemName}>{currentItem.name}</Text>
            <Text style={styles.itemDescription}>{currentItem.description}</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={handleNext}>
            <Text style={styles.closeButtonText}>{isLastItem ? 'Cerrar' : 'Siguiente'}</Text>
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
