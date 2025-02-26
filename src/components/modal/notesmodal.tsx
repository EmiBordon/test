import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { PaperIcon } from '../SvgExporter'; // Asegúrate de que la ruta sea la correcta

interface NotesModalProps {
  visible: boolean;
  onClose: () => void;
}

const NotesModal: React.FC<NotesModalProps> = ({ visible, onClose }) => {
  // Generamos un array de 5 notas de ejemplo
  const notes = Array.from({ length: 6 }, (_, i) => `Nota número ${i + 1}`);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.header}>Notas</Text>
          <ScrollView contentContainerStyle={styles.notesContainer}>
            {notes.map((note, index) => (
              <TouchableOpacity key={index} style={styles.noteItem}>
                <PaperIcon width={35} height={35} style={styles.noteIcon} />
                <Text style={styles.noteText}>{note}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default NotesModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    //alignItems: 'flex-start',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  notesContainer: {
    width: '100%',
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  noteIcon: {
    marginRight: 10,
  },
  noteText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '28%' ,
    height: '8%' ,

  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
