import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

interface Item {
  id: string;
  name: string;
  price: number;
}

interface ShopModalProps {
  visible: boolean;
  onClose: () => void;
}

const sampleItems: Item[] = [
  { id: '1', name: 'Objeto 1', price: 10 },
  { id: '2', name: 'Objeto 2', price: 20 },
  { id: '3', name: 'Objeto 3', price: 30 },
];

const ShopModal: React.FC<ShopModalProps> = ({ visible, onClose }) => {
  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.itemText}>${item.price}</Text>
      <TouchableOpacity style={styles.buyButton}>
        <Text style={styles.buyButtonText}>Comprar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>TIENDA</Text>
          <FlatList
            data={sampleItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            style={{ flex: 1 }}
          />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: '5%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
    marginBottom: '5%',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '3%',
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  itemText: {
    color: 'black',
    fontSize: 16,
  },
  buyButton: {
    backgroundColor: 'black',
    paddingHorizontal: '4%',
    paddingVertical: '2%',
    borderRadius: 5,
  },
  buyButtonText: {
    color: 'white',
    fontSize: 14,
  },
  closeButton: {
    marginTop: '5%',
    alignSelf: 'center',
    backgroundColor: 'black',
    paddingHorizontal: '10%',
    paddingVertical: '3%',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ShopModal;
