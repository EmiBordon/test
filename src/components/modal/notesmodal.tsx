import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { PaperIcon } from '../SvgExporter';
import { useSelector } from 'react-redux';
import { selectVisibleNotas } from '../../redux/agendaSlice';
import { NOTES, Note } from '../../components/functions/notes';

interface NotesModalProps {
  visible: boolean;
  onClose: () => void;
}

const NotesModal: React.FC<NotesModalProps> = ({ visible, onClose }) => {
  const visibleNotas = useSelector(selectVisibleNotas);
  const [showSecondSet, setShowSecondSet] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const handlePressNote = (noteKey: string) => {
    const id = parseInt(noteKey.replace('nota', ''), 10);
    const note = NOTES.find(n => n.id === id);
    if (note) {
      setSelectedNote(note);
    }
  };

  const renderDetailView = () => (
    <View style={styles.modalContainer}>
      <Text style={styles.detailTitle}>{selectedNote?.title}</Text>
      {selectedNote?.image ? (
        <Image source={selectedNote.image} style={styles.detailImage} resizeMode="contain" />
      ) : (
        <Text style={styles.detailContent}>{selectedNote?.content}</Text>
      )}
      <TouchableOpacity style={styles.backButton} onPress={() => setSelectedNote(null)}>
        <Text style={styles.backButtonText}>Atrás</Text>
      </TouchableOpacity>
    </View>
  );

  const renderListView = () => {
    const startIndex = showSecondSet ? 6 : 0;
    const displayedNotas = visibleNotas.slice(startIndex, startIndex + 6);
    
    return (
      <View style={styles.modalContainer}>
        <Text style={styles.header}>Notas</Text>
        <View style={styles.notesContainer}>
          {displayedNotas.map(noteObj => {
            const id = parseInt(noteObj.key.replace('nota', ''), 10);
            const noteFromFile = NOTES.find(n => n.id === id);
            return (
              <TouchableOpacity 
                key={noteObj.key} 
                style={styles.noteItem}
                onPress={() => handlePressNote(noteObj.key)}
              >
                <PaperIcon width={35} height={35} style={styles.noteIcon} />
                <Text style={styles.noteText}>
                  {noteFromFile?.title || noteObj.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {visibleNotas.length > 6 && (
          <TouchableOpacity style={styles.arrowButton} onPress={() => setShowSecondSet(!showSecondSet)}>
            <Text style={styles.arrowButtonText}>{'>>'}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        {selectedNote ? renderDetailView() : renderListView()}
      </View>
    </Modal>
  );
};

export default NotesModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    height: '70%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: '5%',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: '3%',
  },
  notesContainer: {
    width: '100%',
    flex: 1,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '3%',
    marginBottom: '2%',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  noteIcon: {
    marginRight: '3%',
  },
  noteText: {
    fontSize: 16,
    color: '#333',
  },
  arrowButton: {
    alignSelf: 'flex-end',
    padding: '3%',
    marginTop: '2%',
  },
  arrowButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  closeButton: {
    marginTop: '3%',
    backgroundColor: 'black',
    paddingVertical: '2%',
    paddingHorizontal: '5%',
    borderRadius: 5,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: '3%',
  },
  detailContent: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  detailImage: {
    width: '100%',
    height: '85%',
    borderRadius: 10,
  },
  backButton: {
    backgroundColor: 'black',
    paddingVertical: '2%',
    paddingHorizontal: '5%',
    borderRadius: 5,
    alignSelf: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
