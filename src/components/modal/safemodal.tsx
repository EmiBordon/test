import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';

type SafeModalProps = {
  visible: boolean;
  correctCode: string;
  onClose: () => void;
  onSuccess: () => void; // nueva prop
};

const SafeModal: React.FC<SafeModalProps> = ({ visible, correctCode, onClose, onSuccess }) => {
  const [enteredCode, setEnteredCode] = useState<string>('');

  useEffect(() => {
    if (enteredCode.length === 4) {
      const timer = setTimeout(() => {
        if (enteredCode === correctCode) {
          onSuccess(); // devuelve "true" por medio de la función
          handleClose();
        } else {
          setEnteredCode('');
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [enteredCode, correctCode, onSuccess]);

  const handlePress = (num: string) => {
    if (enteredCode.length < 4) {
      setEnteredCode(prev => prev + num);
    }
  };

  const handleClose = () => {
    setEnteredCode('');
    onClose();
  };

  const renderDisplay = () => {
    const display = Array.from({ length: 4 }).map((_, index) =>
      enteredCode[index] ? enteredCode[index] : '*'
    );
    return (
      <View style={styles.codeContainer}>
        <View style={styles.displayContainer}>
          {display.map((item, index) => (
            <Text key={index} style={styles.displayText}>{item}</Text>
          ))}
        </View>
      </View>
    );
  };

  const renderButton = (num: string) => (
    <TouchableOpacity key={num} style={styles.button} onPress={() => handlePress(num)}>
      <Text style={styles.buttonText}>{num}</Text>
    </TouchableOpacity>
  );

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {renderDisplay()}
          <View style={styles.keypadContainer}>
            <View style={styles.keypadRow}>
              {numbers.slice(0, 3).map(num => renderButton(num))}
            </View>
            <View style={styles.keypadRow}>
              {numbers.slice(3, 6).map(num => renderButton(num))}
            </View>
            <View style={styles.keypadRow}>
              {numbers.slice(6, 9).map(num => renderButton(num))}
            </View>
            <View style={styles.keypadRow}>
              <View style={[styles.button, { backgroundColor: 'transparent' }]} />
              {renderButton('0')}
              <View style={[styles.button, { backgroundColor: 'transparent' }]} />
            </View>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'gray',
    borderRadius: 10,
    padding: '5%',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'black',
  },
  codeContainer: {
    width: '80%',
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 5,
    paddingVertical: 10,
    marginBottom: '5%',
    backgroundColor: 'rgba(226, 226, 226, 0.86)',
  },
  displayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  displayText: {
    fontSize: 32,
    textAlign: 'center',
    width: '20%',
  },
  keypadContainer: {
    width: '100%',
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: '2%',
  },
  button: {
    backgroundColor: 'black',
    width: '25%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 24,
    color: 'white',
  },
  closeButton: {
    marginTop: '5%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    backgroundColor: 'rgba(226, 226, 226, 0.86)',
  },
  closeButtonText: {
    fontSize: 20,
    color: 'black',
  },
});

export default SafeModal;
