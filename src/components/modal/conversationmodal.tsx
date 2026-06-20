// ConversationModal.js
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DoubleArrowIcon } from '../SvgExporter';
import { font } from '../functions/fontsize';

const ConversationModal = ({ visible, onClose, conversation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (visible) {
      setCurrentIndex(0); // Reinicia el índice al abrir el modal
    }
  }, [visible]);

  const handleNext = () => {
    if (currentIndex < conversation.dialogos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
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
            
            <TouchableOpacity style={styles.button} onPress={handleNext}>
        
                {currentIndex === conversation.dialogos.length - 1 ? (
                <DoubleArrowIcon width={font(28)} height={font(28)} overlay='hidden' style={styles.rotatedIcon}  />
              ) : (
                <DoubleArrowIcon width={font(28)} height={font(28)} overlay='hidden'  />
              )}

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
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  svgContainer: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    width: '70%',
    paddingLeft: '5%',
  },
  dialogueText: {
    color: '#E8D5A3',
    fontSize: font(20),
  },
  button: {
    marginTop: '3%',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    height: '30%',
    width: '10%',
    left: '90%',
    marginBottom: '-55%',
  },
  rotatedIcon: {
    transform: [{ rotate: '90deg' }],
  },
});

export default ConversationModal;
