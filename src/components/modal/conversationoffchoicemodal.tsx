import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DoubleArrowIcon, CrossIcon } from '../SvgExporter';
import { font } from '../functions/fontsize';
import { ConversationOffChoice } from '../functions/conversationsoffchoice';

interface ConversationOffChoiceModalProps {
  visible: boolean;
  onClose: () => void;
  conversation: ConversationOffChoice;
  allowClosing: boolean;
}

const ConversationOffChoiceModal: React.FC<ConversationOffChoiceModalProps> = ({
  visible,
  onClose,
  conversation,
  allowClosing,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (visible) setCurrentIndex(0);
  }, [visible]);

  const handleNext = () => {
    if (currentIndex < conversation.dialogos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleOptionPress = (onSelect: () => void) => {
    onClose();
    onSelect();
  };

  const currentDialog = conversation.dialogos[currentIndex];
  const isLast = currentIndex === conversation.dialogos.length - 1;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={allowClosing ? onClose : () => {}}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {allowClosing && isLast && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <CrossIcon width={font(26)} height={font(26)} overflow='hidden' />
            </TouchableOpacity>
          )}

          <Text style={styles.dialogueText}>{currentDialog.text}</Text>

          {isLast ? (
            <View style={styles.optionsContainer}>
              {conversation.opciones.map((opcion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.choiceButton}
                  onPress={() => handleOptionPress(opcion.onSelect)}
                >
                  <Text style={styles.choiceButtonText}>{opcion.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <DoubleArrowIcon width={font(28)} height={font(28)} overflow='hidden' />
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    backgroundColor: 'rgb(92, 50, 30)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#C8A84B',
    padding: '5%',
    marginBottom: '2%',
    shadowColor: '#C8A84B',
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  closeButton: {
    position: 'absolute',
    right: font(0),
  },
  dialogueText: {
    color: '#E8D5A3',
    fontSize: font(20),
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: '5%',
  },
  button: {
    marginTop: '4%',
    alignSelf: 'flex-end',
    padding: font(6),
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: font(10),
    marginTop: '5%',
  },
  choiceButton: {
    backgroundColor: '#6B2D0A',
    paddingVertical: font(10),
    paddingHorizontal: font(22),
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#C8A84B',
    shadowColor: '#C8A84B',
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  choiceButtonText: {
    color: '#FFD700',
    fontSize: font(16),
    fontWeight: 'bold',
  },
});

export default ConversationOffChoiceModal;
