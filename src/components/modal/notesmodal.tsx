import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { PaperIcon, DoubleArrowIcon } from '../SvgExporter';
import { useSelector } from 'react-redux';
import { selectVisibleNotas } from '../../redux/agendaSlice';
import { NOTES, Note } from '../../components/functions/notes';
import { font } from '../functions/fontsize';

interface NotesModalProps {
  visible: boolean;
  onClose: () => void;
}

const NotesModal: React.FC<NotesModalProps> = ({ visible, onClose }) => {
  const visibleNotas = useSelector(selectVisibleNotas);
  const [showSecondSet, setShowSecondSet] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePressNote = (noteKey: string) => {
    const id = parseInt(noteKey.replace('nota', ''), 10);
    const note = NOTES.find(n => n.id === id);
    if (note) {
      setSelectedNote(note);
      setCurrentImageIndex(0);
    }
  };

  const handleNextImage = () => {
    if (selectedNote?.images && currentImageIndex < selectedNote.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const handlePrevImage = () => {
    if (selectedNote?.images && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const renderDetailView = () => (
    <View style={styles.modalContainer}>
      <Text style={styles.detailTitle}>{selectedNote?.title}</Text>
      {selectedNote?.images && selectedNote.images.length > 0 ? (
        <View style={{ flex: 1 }}>
          <Image 
            source={selectedNote.images[currentImageIndex]} 
            style={styles.detailImage} 
            resizeMode="contain" 
          />
          <View style={styles.imageNavContainer}>
            <TouchableOpacity onPress={handlePrevImage} disabled={currentImageIndex === 0}>
              <DoubleArrowIcon
                width={font(20)}
                height={font(20)}
                style={[
                  { transform: [{ rotate: '180deg' }] },
                  currentImageIndex === 0 && { opacity: 0.4 }
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNextImage} disabled={currentImageIndex === selectedNote.images.length - 1}>
              <DoubleArrowIcon
                width={font(20)}
                height={font(20)}
                style={[
                  currentImageIndex === selectedNote.images.length - 1 && { opacity: 0.4 }
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
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
                <PaperIcon width={font(35)} height={font(35)} style={styles.noteIcon} />
                <Text style={styles.noteText}>
                  {noteFromFile?.title || noteObj.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {visibleNotas.length > 6 && (
          <TouchableOpacity style={styles.arrowButton} onPress={() => setShowSecondSet(!showSecondSet)}>
            <DoubleArrowIcon
              width={font(18)}
              height={font(18)}
              style={{
                transform: [{ rotate: showSecondSet ? '180deg' : '0deg' }]
              }}
            />
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
    fontSize: font(24),
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
    fontSize: font(15.5),
    color: '#333',
  },
  arrowButton: {
    alignSelf: 'flex-end',
    padding: '3%',
    marginTop: '2%',
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
    fontSize: font(16),
  },
  detailTitle: {
    fontSize: font(22),
    fontWeight: 'bold',
    marginBottom: '3%',
  },
  detailContent: {
    fontSize: font(16),
    color: '#333',
    flex: 1,
  },
  detailImage: {
    width: '100%',
    height: '90%',
    borderRadius: 10,
  },
  imageNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '6%',
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
    fontSize: font(16),
  },
});
