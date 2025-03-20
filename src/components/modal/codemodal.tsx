import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { font } from '../functions/fontsize';

interface CodeModalProps {
  visible: boolean;
  code: string;
  onClose: (success: boolean) => void; // ahora recibe true/false
}

const CodeModal: React.FC<CodeModalProps> = ({ visible, code, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [pressed, setPressed] = useState<boolean[]>(Array(9).fill(false));

  const handlePress = (num: number, index: number) => {
    if (num.toString() === code[currentIndex]) {
      const newPressed = [...pressed];
      newPressed[index] = true;
      setPressed(newPressed);
      setCurrentIndex(currentIndex + 1);

      if (currentIndex + 1 === code.length) {
        setTimeout(() => {
          setPressed(Array(9).fill(false));
          setCurrentIndex(0);
          onClose(true); // devolvemos true al cerrar
        }, 100);
      }
    } else {
      setPressed(Array(9).fill(false));
      setCurrentIndex(0);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <View style={styles.gridContainer}>
            {Array.from({ length: 9 }, (_, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.gridItem, pressed[index] && styles.correctItem]}
                onPress={() => handlePress(index, index)}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={() => onClose(false)}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    height: '50%',
    backgroundColor: 'rgb(46, 46, 46)',
    borderRadius: 8,
    padding: '5%',
    alignItems: 'center',
    position: 'relative',
  },
  gridContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '30%',
    height: '190%',
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '5%',
    borderRadius: 8,
  },
  correctItem: {
    backgroundColor: 'black',
  },
  closeButton: {
    position: 'absolute',
    bottom: '5%',
    width: '30%',
    paddingVertical: '3%',
    backgroundColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: font(18),
    color: 'black',
  },
});

export default CodeModal;
