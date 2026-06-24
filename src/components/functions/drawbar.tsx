import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import { useSelector } from 'react-redux';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  cancelAnimation,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { SwordIcon, DaggersIcon, PirateSwordIcon, DoubleSwordIcon, SuperSwordIcon } from '../SvgExporter';
import { font } from './fontsize';
import { getRandomBarNumber } from './randombarnumber';

const WEAPON_ICONS: Record<number, React.ComponentType<any>> = {
  0: DaggersIcon,
  1: SwordIcon,
};

const { width } = Dimensions.get('window');
const CONTAINER_WIDTH = width * 0.9; // Ancho de la barra
const POINTER_WIDTH  = font(4);
const POINTER_HEIGHT = font(22);
const FULL_DISTANCE  = CONTAINER_WIDTH - POINTER_WIDTH;

// Configuración de la zona objetivo
const TARGET_ZONE_PERCENTAGE = 0.1;
const TARGET_ZONE_WIDTH = CONTAINER_WIDTH * TARGET_ZONE_PERCENTAGE;

interface DrawBarProps {
  levels: number;
  duration: number; // Duración en milisegundos de la animación
  onResult: (result: boolean) => void;
}

const DrawBar: React.FC<DrawBarProps> = ({ levels, duration, onResult }) => {
  const currentWeapon: number = useSelector((state: any) => state.weapons.currentWeapon);
  const WeaponIcon = WEAPON_ICONS[currentWeapon] ?? DaggersIcon;

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
        <WeaponIcon width={120} height={120} overflow='hidden' />
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
    fontSize: font(18),
    fontWeight: 'bold',
    color: '#C8A84B',
    textShadowColor: '#6B2D0A',
    textShadowRadius: 4,
  },
  bar: {
    width: CONTAINER_WIDTH,
    height: font(22),
    backgroundColor: '#3D1A00',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#C8A84B',
    overflow: 'hidden',
    marginBottom: '5%',
    shadowColor: '#C8A84B',
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  targetZone: {
    position: 'absolute',
    height: '100%',
    backgroundColor: 'rgba(200, 168, 75, 0.65)',
  },
  ball: {
    width: POINTER_WIDTH,
    height: POINTER_HEIGHT,
    borderRadius: 2,
    backgroundColor: '#ff020f',
    position: 'absolute',
    shadowColor: '#f05236',
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },
  button: {
    marginTop: '20%',
    top: '30%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DrawBar;
