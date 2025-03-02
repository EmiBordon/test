// ConversationChoiceModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DoubleArrowIcon } from '../SvgExporter';

interface Dialogue {
  text: string;
  svg: (props: any) => JSX.Element;
}

interface Conversation {
  dialogos: Dialogue[];
}

interface ConversationChoiceModalProps {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
  conversation: Conversation;
}

const ConversationChoiceModal: React.FC<ConversationChoiceModalProps> = ({
  visible,
  onClose,
  onAccept,
  conversation,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (visible) {
      setCurrentIndex(0); // Reinicia el índice al abrir el modal
    }
  }, [visible]);

  const handleNext = () => {
    if (currentIndex < conversation.dialogos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentDialog = conversation.dialogos[currentIndex];
  const SvgIcon = currentDialog.svg;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.contentRow}>
            <View style={styles.svgContainer}>
              {SvgIcon && <SvgIcon width="100%" height="100%" />}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.dialogueText}>{currentDialog.text}</Text>
            </View>
          </View>
          {currentIndex === conversation.dialogos.length - 1 ? (
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.choiceButton} onPress={onAccept}>
                <Text style={styles.choiceButtonText}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.choiceButton} onPress={onClose}>
                <Text style={styles.choiceButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <DoubleArrowIcon width="90%" height="90%" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo semitransparente (negro)
    justifyContent: 'flex-end',         // Modal en la parte inferior
    alignItems: 'center',
  },
  modalContainer: {
    width: '95%',          // Ocupa el 95% del ancho de la pantalla
    backgroundColor: '#fff', // Fondo blanco
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: '5%',
    marginBottom: '2%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  svgContainer: {
    width: '30%',          // 30% para el SVG
    aspectRatio: 1,        // Contenedor cuadrado
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    width: '70%',          // 70% para el texto
    paddingLeft: '5%',
  },
  dialogueText: {
    color: '#000',
    fontSize: 20,
  },
  button: {
    marginTop: '5%',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    height: 40,
    width: '10%',
    alignSelf: 'flex-end',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '5%',
  },
  choiceButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: '5%',
  },
  choiceButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConversationChoiceModal;
