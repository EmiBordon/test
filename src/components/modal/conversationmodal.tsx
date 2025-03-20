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
                <DoubleArrowIcon width={font(18)} height={font(18)} style={styles.rotatedIcon}  />
              ) : (
                <DoubleArrowIcon width={font(18)} height={font(18)}  />
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
    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo semitransparente (negro)
    justifyContent: 'flex-end',         // Modal en la parte inferior
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',          // Ocupa el 95% del ancho de la pantalla
    backgroundColor: '#fff', // Fondo blanco
    borderTopLeftRadius: 10, // Se usan números en propiedades que no admiten porcentajes
    borderTopRightRadius: 10,
    padding: '5%',         // Padding usando porcentajes
    marginBottom: '2%',
  },
  contentRow: {
    flexDirection: 'row',  // Distribución horizontal
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
    color: '#000',         // Texto en negro
    fontSize: font(20),
  },
  button: {
    marginTop: '3%',
    //backgroundColor: 'red', // Botón negro
    paddingVertical: 10,     // Los padding en vertical se definen con números
    borderRadius: 5,
    alignItems: 'center',
    height:'30%',
    width: '10%',
    left:'90%',
    marginBottom: '-55%',
  },
  rotatedIcon: {
    transform: [{ rotate: '90deg' }], // Ícono rotado 180 grados
  },
});

export default ConversationModal;
