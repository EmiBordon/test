// RandomSequenceGrid.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native';
import ShieldIcon from '../shieldicon';
import { font} from './fontsize';

const { width } = Dimensions.get('window');
const CONTAINER_WIDTH = width * 0.58;
const SQUARE_SIZE = CONTAINER_WIDTH / 3;

const generateRandomArray = (length: number): number[] => {
  return Array.from({ length }, () => Math.floor(Math.random() * 9) + 1);
};

interface RandomSequenceGridProps {
  sequenceLength: number;
  onResult: (result: boolean) => void;
  delay: number;
}

const RandomSequenceGrid: React.FC<RandomSequenceGridProps> = ({ sequenceLength, onResult, delay }) => {
  const [randomArray, setRandomArray] = useState<number[]>([]);
  const [currentLit, setCurrentLit] = useState<number | null>(null);
  const [sequenceComplete, setSequenceComplete] = useState(false);
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [pressedSquare, setPressedSquare] = useState<number | null>(null);

  const startSequence = () => {
    const arr = generateRandomArray(sequenceLength);
    setRandomArray(arr);
    setSequenceComplete(false);
    setCurrentInputIndex(0);
    setInputDisabled(false);
    setCurrentLit(null);

    const timeouts: NodeJS.Timeout[] = [];
    arr.forEach((num, index) => {
      const onTime = index * delay * 1.8;
      const offTime = onTime + delay;
      const t1 = setTimeout(() => setCurrentLit(num), onTime);
      const t2 = setTimeout(() => setCurrentLit(null), offTime);
      timeouts.push(t1, t2);
    });
    const finalTimeout = setTimeout(() => setSequenceComplete(true), (arr.length - 1) * delay * 1.8 + delay);
    timeouts.push(finalTimeout);
  };

  useEffect(() => {
    startSequence();
  }, [sequenceLength, delay]);

  const handleSquarePress = (num: number) => {
    if (!sequenceComplete || inputDisabled) return;
    if (num === randomArray[currentInputIndex]) {
      const newIndex = currentInputIndex + 1;
      setCurrentInputIndex(newIndex);
      if (newIndex === randomArray.length) {
        setInputDisabled(true);
        onResult(true);
      }
    } else {
      setInputDisabled(true);
      onResult(false);
    }
  };

  const squares = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      {!sequenceComplete && (
        <View style={styles.grid}>
          <Text style={styles.title}>RECUERDA EL PATRON</Text>
          {squares.map(num => (
            <View key={num} style={styles.square}>
              <ShieldIcon 
                width={SQUARE_SIZE} 
                height={SQUARE_SIZE} 
                fill={currentLit === num ? 'black' : 'gray'} 
              />
            </View>
          ))}
        </View>
      )}
      
      {sequenceComplete && (
        <View style={styles.grid}>
          <Text style={styles.title}>REPRODUCE EL PATRON</Text>
          {squares.map(num => (
            <TouchableOpacity
              key={num}
              onPressIn={() => setPressedSquare(num)}
              onPressOut={() => setPressedSquare(null)}
              onPress={() => handleSquarePress(num)}
              disabled={inputDisabled}
              style={styles.square}
              activeOpacity={1}
            >
              <ShieldIcon 
                width={SQUARE_SIZE} 
                height={SQUARE_SIZE} 
                fill={pressedSquare === num ? 'black' : 'gray'} 
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '60%',
    height: '35%',
  },
  title: {
    fontSize: font(18),
    marginBottom: "5%",
  },
  grid: {
    width: CONTAINER_WIDTH,
    flexDirection: 'row',
    flexWrap: 'wrap',
    top: "5%",
  },
  square: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
  },
});

export default RandomSequenceGrid;
