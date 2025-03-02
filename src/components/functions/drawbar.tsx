// DrawBar.tsx
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  cancelAnimation,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { getRandomBarNumber } from './randombarnumber';

const { width } = Dimensions.get('window');
const CONTAINER_WIDTH = width * 0.9; // Ancho de la barra
const BALL_SIZE = width * 0.03;
const FULL_DISTANCE = CONTAINER_WIDTH - BALL_SIZE;

// Configuración de la zona objetivo
const TARGET_ZONE_PERCENTAGE = 0.1;
const TARGET_ZONE_WIDTH = CONTAINER_WIDTH * TARGET_ZONE_PERCENTAGE;

interface DrawBarProps {
  levels: number;
  duration: number; // Duración en milisegundos de la animación
  onResult: (result: boolean) => void;
}

const DrawBar: React.FC<DrawBarProps> = ({ levels, duration, onResult }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  // Inicialmente se puede dejar con el valor por defecto, luego se actualizará según el nivel
  const [targetZoneLeft, setTargetZoneLeft] = useState((CONTAINER_WIDTH - TARGET_ZONE_WIDTH) / 2);

  const x = useSharedValue(0);
  const isMoving = useSharedValue(true);

  // Worklet que anima la bola de 0 a FULL_DISTANCE usando el duration recibido
  function animateBall() {
    'worklet';
    x.value = withTiming(
      FULL_DISTANCE,
      { duration, easing: Easing.linear },
      (isFinished) => {
        if (isFinished && isMoving.value) {
          // La animación terminó sin que se detuviera: fallo
          isMoving.value = false;
          runOnJS(onResult)(false);
        }
      }
    );
  }

  // Reinicia la animación y asigna targetZoneLeft según el nivel actual:
  // - Nivel 1: valor fijo (2)
  // - Niveles a partir del 2: valor aleatorio
  const startAnimation = () => {
    if (currentLevel === 1) {
      setTargetZoneLeft((CONTAINER_WIDTH - TARGET_ZONE_WIDTH) / 2);
    } else {
      const factor = getRandomBarNumber(); // Valor entre 1.1 y 3.0 en pasos de 0.1
      const newTargetZoneLeft = (CONTAINER_WIDTH - TARGET_ZONE_WIDTH) / factor;
      setTargetZoneLeft(newTargetZoneLeft);
    }
    x.value = 0;
    isMoving.value = true;
    animateBall();
  };

  // Cada vez que cambia el nivel se reinicia la animación con nueva posición
  useEffect(() => {
    startAnimation();
  }, [currentLevel]);

  // Al presionar "Detener", se cancela la animación y se evalúa si se acierta
  const handleStop = () => {
    if (!isMoving.value) return;
    cancelAnimation(x);
    isMoving.value = false;
    const hit = x.value >= targetZoneLeft && x.value <= targetZoneLeft + TARGET_ZONE_WIDTH;
    if (!hit) {
      onResult(false);
    } else {
      if (currentLevel < levels) {
        setCurrentLevel(currentLevel + 1);
      } else {
        onResult(true);
      }
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.levelText}>
        Nivel {currentLevel} de {levels}
      </Text>
      <View style={styles.bar}>
        {/* Zona objetivo con posición determinada */}
        <View style={[styles.targetZone, { left: targetZoneLeft, width: TARGET_ZONE_WIDTH }]} />
        <Animated.View style={[styles.ball, animatedStyle]} />
      </View>
      <TouchableOpacity onPress={handleStop} style={styles.button}>
        <Text style={styles.buttonText}>Detener</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  levelText: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bar: {
    width: CONTAINER_WIDTH,
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  targetZone: {
    position: 'absolute',
    height: '100%',
    backgroundColor: 'rgba(121, 122, 121, 0.81)',
  },
  ball: {
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    backgroundColor: 'black',
    position: 'absolute',
    top: -5, // Centrado verticalmente en la barra
  },
  button: {
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 5,
    marginTop: '20%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DrawBar;
