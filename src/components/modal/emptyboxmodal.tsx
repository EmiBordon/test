import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { BoxIcon } from '../SvgExporter';
import { font } from '../functions/fontsize';

interface EmptyBoxModalProps {
  visible: boolean;
  onClose: () => void;
}

const EmptyBoxModal: React.FC<EmptyBoxModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.headerText}>¡La caja estaba vacía!</Text>
          <View style={styles.contentContainer}>
            <View style={styles.iconContainer}>
              <BoxIcon height={font(50)} width={font(50)} />
            </View>
            <Text style={styles.messageText}>
              No hay nada de valor en esta caja.
            </Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Mismo fondo que NewItemModal
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white', // Mismo fondo que NewItemModal
    padding: font(20),
    borderRadius: font(10),
    width: '80%',
    alignItems: 'center',
    borderWidth: font(4), // Mismo borde que NewItemModal
  },
  headerText: {
    color: 'black', // Mismo color que NewItemModal
    fontSize: font(20),
    fontWeight: 'bold',
    marginBottom: font(20),
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: font(20),
  },
  iconContainer: {
    //opacity: 0.6, // Mantener la opacidad para que se vea como "vacío"
  },
  messageText: {
    color: 'black', // Mismo color que itemDescription en NewItemModal
    fontSize: font(16),
    marginTop: font(5),
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: 'black', // Mismo color que NewItemModal
    paddingVertical: font(10),
    paddingHorizontal: font(20),
    borderRadius: font(5),
  },
  closeButtonText: {
    color: 'white', // Mismo color que NewItemModal
    fontSize: font(16),
    fontWeight: 'bold',
  },
});

export default EmptyBoxModal;
