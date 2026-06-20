import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { font } from '../functions/fontsize';
import { MaiaHeadIcon } from '../SvgExporter';

interface GridModalProps {
  visible: boolean;
  onClose: () => void;
  highlightedSquares?: number[];
  whiteSquare?: number | null;
  sSquares:number;
  tSquares:number;
  mSquares:number;
  text: string;
}

const GridModal: React.FC<GridModalProps> = ({
  visible,
  onClose,
  highlightedSquares = [],
  whiteSquare = null,
  tSquares,
  sSquares,
  mSquares,
  text,
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
                      ? 'rgba(200, 168, 75, 0.9)'
                      : highlightedSquares.includes(index)
                      ? 'rgba(107, 45, 10, 0.85)'
                      : 'rgba(0, 0, 0, 0)',
                  width: squareSize,
                  height: squareSize,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
            >
              {index === whiteSquare && (
                <MaiaHeadIcon width={squareSize * 0.55} height={squareSize * 0.55} />
              )}
            </View>
          ))}
        </View>
      </TouchableOpacity>
      <View style={styles.locationContainer}>
        <Text style={styles.locationText}>{text}</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 4, 1, 0.84)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    flexWrap: 'wrap',
    flexDirection: 'row'
    
  },
  square: {
    padding: 0,
    margin: 0,
    borderRadius: font(12),
  },
  locationContainer: {
    position: 'absolute',
    top: '1%',
    right: '2%',
    backgroundColor: 'rgba(18, 7, 2, 0.97)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#C8A84B',
    elevation: 4,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  locationText: {
    color: '#C8A84B',
    fontSize: font(15),
    fontWeight: 'bold',
  },
});

export default GridModal;
