// RandomSequenceGrid.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');
const CONTAINER_WIDTH = width * 0.6;
const SQUARE_SIZE = CONTAINER_WIDTH / 3;

/**
 * Genera un array de "length" números aleatorios (posiblemente repetidos) del 1 al 9.
 */
const generateRandomArray = (length: number): number[] => {
  return Array.from({ length }, () => Math.floor(Math.random() * 9) + 1);
};

interface RandomSequenceGridProps {
  sequenceLength: number;
  onResult: (result: boolean) => void;
}

const RandomSequenceGrid: React.FC<RandomSequenceGridProps> = ({ sequenceLength, onResult }) => {
  const [randomArray, setRandomArray] = useState<number[]>([]);
  // currentLit: número actualmente "iluminado" en la animación.
  const [currentLit, setCurrentLit] = useState<number | null>(null);
  // Indica si ya terminó la animación de la secuencia.
  const [sequenceComplete, setSequenceComplete] = useState(false);
  // Índice actual para la secuencia que el usuario debe reproducir.
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  // Para deshabilitar la entrada después de finalizar.
  const [inputDisabled, setInputDisabled] = useState(false);
  
  // Delay en milisegundos para cada paso (encendido/apagado)
  const delay = 500; // 500 ms

  // Función para iniciar la secuencia: genera el array y reproduce la animación.
  const startSequence = () => {
    const arr = generateRandomArray(sequenceLength);
    setRandomArray(arr);
    setSequenceComplete(false);
    setCurrentInputIndex(0);
    setInputDisabled(false);
    setCurrentLit(null);

    const timeouts: NodeJS.Timeout[] = [];
    // Para cada número de la secuencia se programa su encendido y apagado.
    arr.forEach((num, index) => {
      const onTime = index * delay * 2; // momento para encender
      const offTime = onTime + delay;   // momento para apagar
      const t1 = setTimeout(() => {
        setCurrentLit(num);
      }, onTime);
      const t2 = setTimeout(() => {
        setCurrentLit(null);
      }, offTime);
      timeouts.push(t1, t2);
    });
    // Al finalizar la secuencia, se oculta la cuadrícula animada y se habilita la interactiva.
    const finalTimeout = setTimeout(() => {
      setSequenceComplete(true);
    }, arr.length * delay * 2);
    timeouts.push(finalTimeout);
  };

  // Ejecuta la secuencia al montar el componente.
  useEffect(() => {
    startSequence();
  }, [sequenceLength]);

  // Maneja la pulsación en la cuadrícula interactiva.
  const handleSquarePress = (num: number) => {
    if (!sequenceComplete || inputDisabled) return;
    // Si el número pulsado coincide con el esperado en la secuencia...
    if (num === randomArray[currentInputIndex]) {
      const newIndex = currentInputIndex + 1;
      setCurrentInputIndex(newIndex);
      // Si se completó la secuencia correctamente, se envía el resultado.
      if (newIndex === randomArray.length) {
        setInputDisabled(true);
        onResult(true);
      }
    } else {
      // Secuencia incorrecta.
      setInputDisabled(true);
      onResult(false);
    }
  };

  // Se construye la cuadrícula de 9 cuadrados (numerados del 1 al 9).
  const squares = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      
      {/* Cuadrícula animada: se muestra solo si la secuencia no ha finalizado */}
      {!sequenceComplete && (
          <View style={styles.grid}>
            <Text style={styles.title}>RECUERDA EL PATRON</Text>
          {squares.map(num => {
            const isLit = currentLit === num;
            return (
              <View key={num} style={[styles.square, isLit && styles.litSquare]}>
              </View>
            );
          })}
        </View>
      )}
      
      
      
      {/* Cuadrícula interactiva: se muestra cuando la animación ha finalizado */}
      {sequenceComplete && (
        <View style={styles.container}>
          <Text style={styles.title}>REPRODUCE EL PATRON</Text>
          <View style={styles.grid}>
            {squares.map(num => (
              <TouchableOpacity
                key={num}
                style={styles.square}
                onPress={() => handleSquarePress(num)}
              >
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  grid: {
    width: CONTAINER_WIDTH,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  square: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc',
  },
  litSquare: {
    backgroundColor: 'black',
  },
 
});

export default RandomSequenceGrid;
