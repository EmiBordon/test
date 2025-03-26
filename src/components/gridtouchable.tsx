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
  );
};

const styles = StyleSheet.create({
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: font(3),
    position:'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.66)',
    top:'8%',
    right:'1%'
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
    borderRadius: font(4),
  },
});

export default GridTouchable;
