import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DoubleArrowIcon } from '../SvgExporter';
import { font } from '../functions/fontsize';
import { ConversationOff } from '../functions/conversationsoff';

interface ConversationOffModalProps {
  visible: boolean;
  onClose: () => void;
  conversation: ConversationOff;
}

const ConversationOffModal: React.FC<ConversationOffModalProps> = ({
  visible,
  onClose,
  conversation,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (visible) setCurrentIndex(0);
  }, [visible]);

  const handleNext = () => {
    if (currentIndex < conversation.dialogos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const currentDialog = conversation.dialogos[currentIndex];
  const isLast = currentIndex === conversation.dialogos.length - 1;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.dialogueText}>{currentDialog.text}</Text>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <DoubleArrowIcon
              width={font(28)}
              height={font(28)}
              overflow='hidden'
              style={isLast ? styles.rotatedIcon : undefined}
            />
          </TouchableOpacity>
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
  rotatedIcon: {
    transform: [{ rotate: '90deg' }],
  },
});

export default ConversationOffModal;
