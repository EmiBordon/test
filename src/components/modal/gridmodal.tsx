import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { font } from '../functions/fontsize';

interface GridModalProps {
  visible: boolean;
  onClose: () => void;
  highlightedSquares?: number[];
  whiteSquare?: number | null;
  sSquares:number;
  tSquares:number;
  mSquares:number; 
}

const GridModal: React.FC<GridModalProps> = ({
  visible,
  onClose,
  highlightedSquares = [],
  whiteSquare = null,
  tSquares,
  sSquares,
  mSquares,
}) => {
  // Generamos un array de 49 índices (0 a 48)
  const totalSquares = tSquares;
  const gridSquares: number[] = Array.from({ length: totalSquares }, (_, i) => i);
  // Aseguramos un tamaño entero para cada cuadrado
  const squareSize = Math.floor(font(sSquares));

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.grid, { width: squareSize * mSquares }]}>
          {gridSquares.map((index) => (
            <View
              key={index}
              style={[
                styles.square,
                {
                  backgroundColor:
                    index === whiteSquare
                      ? 'rgba(0, 0, 0, 0.93)'
                      : highlightedSquares.includes(index)
                      ? 'rgba(88, 88, 88, 0.93)'
                      : 'rgba(0, 0, 0, 0)',
                  width: squareSize,
                  height: squareSize,
                },
              ]}
            />
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    // backgroundColor: 'rgba(207, 207, 207, 0.36)', // fondo negro semi-transparente
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    
  },
  square: {
    padding: 0,
    margin: 0,
    borderWidth: font(1),
    borderColor: 'rgba(0, 0, 0, 0)',
    borderRadius: font(12),
  },
});

export default GridModal;
