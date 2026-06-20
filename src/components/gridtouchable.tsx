import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { font } from './functions/fontsize';

interface GridTouchableProps {
  onPress?: () => void;
  highlightedSquares?: number[];
  whiteSquare?: number | null;
  sSquares: number;
  tSquares: number;
  mSquares: number;
}

const GridTouchable: React.FC<GridTouchableProps> = ({
  onPress,
  highlightedSquares = [],
  whiteSquare = null,
  tSquares,
  sSquares,
  mSquares,
}) => {
  const totalSquares = tSquares;
  const gridSquares: number[] = Array.from({ length: totalSquares }, (_, i) => i);
  const squareSize = Math.floor(font(sSquares));

  return (
    <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onPress}>
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
              },
            ]}
          />
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#C8A84B',
    position: 'absolute',
    backgroundColor: 'rgba(18, 7, 2, 0.88)',
    top: '10%',
    right: '1%',
    borderRadius: 6,
    shadowColor: '#D4AF37',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  grid: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  square: {
    padding: 0,
    margin: 0,
    borderRadius: font(4),
  },
});

export default GridTouchable;
