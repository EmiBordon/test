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
  const [targetZoneLeft, setTargetZoneLeft] = useState((CONTAINER_WIDTH - TARGET_ZONE_WIDTH) / 2);
  // Este estado controla si ya se inició la animación en el primer nivel
  const [hasStartedFirstLevel, setHasStartedFirstLevel] = useState(false);

  const x = useSharedValue(0);
  const isMoving = useSharedValue(false);

  // Worklet que anima la bola desde 0 hasta FULL_DISTANCE
  function animateBall() {
    'worklet';
    isMoving.value = true;
    x.value = withTiming(
      FULL_DISTANCE,
      { duration, easing: Easing.linear },
      (isFinished) => {
        if (isFinished && isMoving.value) {
          isMoving.value = false;
          runOnJS(onResult)(false);
        }
      }
    );
  }

  // Prepara la animación: en el nivel 1 se usa la zona central; para niveles mayores se asigna una posición aleatoria
  const startAnimation = () => {
    if (currentLevel === 1) {
      setTargetZoneLeft((CONTAINER_WIDTH - TARGET_ZONE_WIDTH) / 2);
    } else {
      const factor = getRandomBarNumber(); // Valor entre 1.1 y 3.0 en pasos de 0.1
      const newTargetZoneLeft = (CONTAINER_WIDTH - TARGET_ZONE_WIDTH) / factor;
      setTargetZoneLeft(newTargetZoneLeft);
    }
    // Reiniciamos la posición y arrancamos la animación
    x.value = 0;
    animateBall();
  };

  // Cuando cambia el nivel...
  useEffect(() => {
    if (currentLevel === 1 && !hasStartedFirstLevel) {
      // Primer nivel: se deja estática la bola (no se inicia la animación automáticamente)
      x.value = 0;
      isMoving.value = false;
    } else {
      // A partir del segundo nivel (o si ya se inició en el primer nivel) se arranca la animación automáticamente
      startAnimation();
    }
  }, [currentLevel, hasStartedFirstLevel]);

  const handlePress = () => {
    if (currentLevel === 1 && !hasStartedFirstLevel) {
      // Primer toque en el primer nivel: inicia la animación
      setHasStartedFirstLevel(true);
      startAnimation();
      return;
    }

    // Si la animación ya está en curso, se detiene y se evalúa el resultado
    if (!isMoving.value) return;
    cancelAnimation(x);
    isMoving.value = false;
    const hit =
      x.value >= targetZoneLeft &&
      x.value <= targetZoneLeft + TARGET_ZONE_WIDTH;
    if (!hit) {
      onResult(false);
    } else {
      if (currentLevel < levels) {
        setCurrentLevel(prev => prev + 1);
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
        {currentLevel} / {levels}
      </Text>
      <View style={styles.bar}>
        {/* Zona objetivo */}
        <View style={[styles.targetZone, { left: targetZoneLeft, width: TARGET_ZONE_WIDTH }]} />
        <Animated.View style={[styles.ball, animatedStyle]} />
      </View>
      <TouchableOpacity onPress={handlePress} style={styles.button}>
        <Text style={styles.buttonText}>ATACAR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: '6%',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  levelText: {
    marginBottom: '3%',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bar: {
    width: CONTAINER_WIDTH,
    height: '6%',
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: '5%',
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
    //top: '7%',
  },
  button: {
    padding: '3%',
    backgroundColor: 'black',
    borderRadius: 5,
    marginTop: '20%',
    top:'30%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default DrawBar;
