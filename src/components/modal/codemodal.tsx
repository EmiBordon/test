import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet } from 'react-native';
import { font } from '../functions/fontsize';
import IconButton from '../functions/iconbutton';
import { CrossIcon } from '../SvgExporter';

interface CodeModalProps {
  visible: boolean;
  code: string;
  onClose: (success: boolean) => void;
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
          onClose(true);
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

          <IconButton
            Icon={CrossIcon}
            width={font(28)}
            height={font(28)}
            style={styles.closeIcon}
            onPress={() => onClose(false)}
          />

          <View style={styles.gridContainer}>
            {Array.from({ length: 9 }, (_, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.gridItem, pressed[index] && styles.correctItem]}
                onPress={() => handlePress(index, index)}
              />
            ))}
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    height: '45%',
    backgroundColor: '#69544e',
    borderRadius: font(25),
    borderWidth: 2,
    borderColor: '#1a0c08',
    padding: '5%',
    paddingTop: font(44),
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 14,
  },
  closeIcon: {
    position: 'absolute',
    top: font(8),
    right: font(10),
    zIndex: 10,
  },
  gridContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    
  },
  gridItem: {
    width: '30%',
    height: '160%',
    backgroundColor: '#475059',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '5%',
    borderRadius: font(30),
    borderWidth: 2,
    borderColor: '#1a1a1a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 6,
    elevation: 6,
  },
  correctItem: {
    backgroundColor: '#1a1a1a',
    borderColor: '#000',
    shadowColor: '#000',
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
});

export default CodeModal;
