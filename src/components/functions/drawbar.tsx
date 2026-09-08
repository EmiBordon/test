import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import { useSelector } from 'react-redux';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { SwordIcon, DaggersIcon, PirateSwordIcon, DoubleSwordIcon, SuperSwordIcon, DamageIcon } from '../SvgExporter';
import { font } from './fontsize';
import { getRandomBarNumber } from './randombarnumber';

const WEAPON_ICONS: Record<number, React.ComponentType<any>> = {
  0: DaggersIcon,
  1: SwordIcon,
};

const { width } = Dimensions.get('window');
const CONTAINER_WIDTH = width * 0.98; // Ancho de la barra
const CONTAINER_HEIGHT = font(70); // Alto de la barra — ajustable a gusto
const POINTER_WIDTH  = font(4);
const POINTER_HEIGHT = CONTAINER_HEIGHT - font(4);
const FULL_DISTANCE  = CONTAINER_WIDTH - POINTER_WIDTH;

// Configuración de la zona objetivo
const TARGET_ZONE_PERCENTAGE = 0.26;
const TARGET_ZONE_WIDTH = CONTAINER_WIDTH * TARGET_ZONE_PERCENTAGE;

// Velocidad del puntero: multiplicador aplicado a la duración recibida (menor = más rápido)
const SPEED_FACTOR = 0.7;

interface DrawBarProps {
  levels: number;
  duration: number; // Duración en milisegundos de la animación
  onResult: (result: boolean) => void;
}

const DrawBar: React.FC<DrawBarProps> = ({ levels, duration, onResult }) => {
  const currentWeapon: number = useSelector((state: any) => state.weapons.currentWeapon);
  const WeaponIcon = WEAPON_ICONS[currentWeapon] ?? DaggersIcon;

  const [currentLevel, setCurrentLevel] = useState(1);
  // Posición de la zona objetivo de cada barra (una por nivel), calculada una única vez
  const [targetZones] = useState<number[]>(() =>
    Array.from({ length: levels }, (_, i) =>
      i === 0
        ? (CONTAINER_WIDTH - TARGET_ZONE_WIDTH) / 2
        : (CONTAINER_WIDTH - TARGET_ZONE_WIDTH) / getRandomBarNumber()
    )
  );
  const targetZoneLeft = targetZones[currentLevel - 1];
  // Este estado controla si ya se inició la animación en el primer nivel
  const [hasStartedFirstLevel, setHasStartedFirstLevel] = useState(false);

  const x = useSharedValue(0);
  const isMoving = useSharedValue(false);

  // Worklet que anima la bola en loop de ida y vuelta hasta que se presione el botón
  function animateBall() {
    'worklet';
    isMoving.value = true;
    x.value = withRepeat(
      withTiming(FULL_DISTANCE, { duration: duration * SPEED_FACTOR, easing: Easing.linear }),
      -1,
      true
    );
  }

  // Reinicia la posición y arranca la animación de la barra del nivel actual
  const startAnimation = () => {
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
    <View style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.levelText}>
        ATAQUE!
      </Text>
        {targetZones.slice(0, currentLevel).map((zoneLeft, idx) => {
          const levelNum = idx + 1;
          const isCurrent = levelNum === currentLevel;
          const isDone = levelNum < currentLevel;
          return (
            <View key={idx} style={[styles.bar, isDone && styles.barDone]}>
              {/* Zona objetivo */}
              <View style={[styles.targetZone, { left: zoneLeft, width: TARGET_ZONE_WIDTH }]}>
                <DamageIcon width={POINTER_HEIGHT} height={POINTER_HEIGHT} />
              </View>
              {isCurrent && <Animated.View style={[styles.ball, animatedStyle]} />}
            </View>
          );
        })}
      </View>
      <TouchableOpacity onPress={handlePress} style={styles.button}>
        <WeaponIcon width={120} height={120} overflow='hidden' />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: '8%',
    paddingHorizontal: '1%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  levelText: {
    marginBottom: '3%',
    fontSize: font(28),
    fontWeight: 'bold',
    color: '#ff2828',
    textShadowColor: '#2e2018',
    textShadowRadius: 4,
  },
  bar: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    backgroundColor: '#8d634a',
    borderRadius: 6,
    borderWidth: 4,
    borderColor: '#5c360b',
    overflow: 'hidden',
    marginBottom: '5%',
    shadowColor: '#C8A84B',
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  barDone: {
    opacity: 0.5,
  },
  targetZone: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#C8A84B',
    borderWidth: 1,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
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
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '5%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DrawBar;
