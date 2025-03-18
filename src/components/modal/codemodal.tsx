import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Alert, Text } from 'react-native';
import { font } from '../functions/fontsize';

interface CodeModalProps {
  visible: boolean;
  codigo: string; // Ejemplo: "3409"
  onClose: () => void;
}

const CodeModal: React.FC<CodeModalProps> = ({ visible, codigo, onClose }) => {
  // Estado para llevar el dígito actual que se debe acertar
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  // Estado para saber qué cuadrados han sido presionados correctamente
  const [pressed, setPressed] = useState<boolean[]>(Array(9).fill(false));

  const handlePress = (num: number, index: number) => {
    if (num.toString() === codigo[currentIndex]) {
      const newPressed = [...pressed];
      newPressed[index] = true;
      setPressed(newPressed);
      setCurrentIndex(currentIndex + 1);
  
      if (currentIndex + 1 === codigo.length) {
        // Agrega un retardo para que se vea el último cuadrado en negro
        setTimeout(() => {
          Alert.alert("Éxito", "¡Código ingresado correctamente!");
          // Reiniciamos el estado y cerramos el modal
          setPressed(Array(9).fill(false));
          setCurrentIndex(0);
          onClose();
        }, 100); // 1000ms = 1 segundo de retardo (ajusta el tiempo según lo necesites)
      }
    } else {
      // Reinicia todos los cuadrados a gris y la secuencia
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
              >
                {/* Sin mostrar números */}
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
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
    width: '80%',        // Ancho del 80% de la pantalla
    height: '50%',       // Altura del 50% de la pantalla
    backgroundColor: 'rgb(46, 46, 46)',
    borderRadius: 8,
    padding: '5%',
    alignItems: 'center',
    position: 'relative', // Para posicionar el botón de cerrar de forma absoluta
  },
  gridContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '30%',        // Aproximadamente 3 columnas (30% de ancho cada una)
    height: '190%',       // Mantiene la forma cuadrada
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
    bottom: '5%',        // Fijo en la parte inferior del modal
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
