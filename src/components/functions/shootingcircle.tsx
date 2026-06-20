// ShootingCircle.tsx
import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { BowShootIcon } from '../SvgExporter';
import { font } from './fontsize';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  cancelAnimation,
  Easing,
  withRepeat,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const { width } = Dimensions.get('window');
const INITIAL_DIAMETER = width * 0.8; // Diámetro inicial del círculo
const POINTER_SIZE = width * 0.05;    // Tamaño del puntero
const TARGET_TOLERANCE = 15;          // Tolerancia en grados para el objetivo (±15°)

const SVG_C     = INITIAL_DIAMETER / 2;
const OUTER_R   = SVG_C - 5;
const INNER_R   = OUTER_R - 22;
const TARGET_R  = (OUTER_R + INNER_R) / 2;

const TICKS = [0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
  const rad     = (deg - 90) * Math.PI / 180;
  const isMajor = deg % 90 === 0;
  const r1      = INNER_R - 3;
  const r2      = INNER_R - (isMajor ? 26 : 13);
  return {
    key: String(deg),
    d: `M ${SVG_C + r1 * Math.cos(rad)} ${SVG_C + r1 * Math.sin(rad)} L ${SVG_C + r2 * Math.cos(rad)} ${SVG_C + r2 * Math.sin(rad)}`,
    stroke: isMajor ? '#C8A84B' : '#8B4513',
    sw: isMajor ? '5' : '2.5',
  };
});

interface ShootingCircleProps {
  shrinkDuration: number;      // Duración en ms en la que el círculo se encoge hasta el tamaño mínimo
  minDiameter: number;         // Diámetro final (mínimo) del círculo
  rotationDuration: number;    // Tiempo en ms para una rotación completa
  onResult: (result: boolean) => void;
}

const ShootingCircle: React.FC<ShootingCircleProps> = ({
  shrinkDuration,
  minDiameter,
  rotationDuration,
  onResult,
}) => {
  // Se genera un ángulo objetivo aleatorio
  const targetAngle = useSharedValue(0);

  // Valores compartidos para la rotación del puntero y el diámetro del círculo
  const rotation = useSharedValue(0);
  const circleDiameter = useSharedValue(INITIAL_DIAMETER);
  const gameEnded = useSharedValue(false);

  // Inicia el juego: animación de rotación continua y encogimiento del círculo
  const startGame = () => {
    gameEnded.value = false;
    circleDiameter.value = INITIAL_DIAMETER;
    rotation.value = withRepeat(
      withTiming(360, { duration: rotationDuration, easing: Easing.linear }),
      -1,
      false
    );
    circleDiameter.value = withTiming(
      minDiameter,
      { duration: shrinkDuration, easing: Easing.linear },
      (isFinished) => {
        if (isFinished && !gameEnded.value) {
          gameEnded.value = true;
          runOnJS(onResult)(false);
        }
      }
    );
  };

  useEffect(() => {
    startGame();
  }, [minDiameter, shrinkDuration, rotationDuration, onResult]);

  // Animated props para dibujar el arco (zona de impacto) sobre el círculo.
  // Se ajusta el ángulo restando 90° para alinear con el puntero (que arranca en la parte superior)
  const animatedPathProps = useAnimatedProps(() => {
    const adjustedTarget = targetAngle.value - 90;
    const startAngle = (adjustedTarget - TARGET_TOLERANCE) * (Math.PI / 180);
    const endAngle   = (adjustedTarget + TARGET_TOLERANCE) * (Math.PI / 180);
    const startX = SVG_C + TARGET_R * Math.cos(startAngle);
    const startY = SVG_C + TARGET_R * Math.sin(startAngle);
    const endX   = SVG_C + TARGET_R * Math.cos(endAngle);
    const endY   = SVG_C + TARGET_R * Math.sin(endAngle);
    return { d: `M ${startX} ${startY} A ${TARGET_R} ${TARGET_R} 0 0 1 ${endX} ${endY}` };
  });

  // Estilo animado para el círculo que se encoge
  const animatedCircleStyle = useAnimatedStyle(() => ({
    width: circleDiameter.value,
    height: circleDiameter.value,
    borderRadius: circleDiameter.value / 2,
  }));

  // Estilo animado para la rotación del puntero
  const animatedRotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // Al disparar, se evalúa el ángulo actual del puntero y se compara con el ángulo objetivo
  const handleShot = () => {
    if (gameEnded.value) return;
    const currentAngle = rotation.value % 360;
    let diff = Math.abs(currentAngle - targetAngle.value);
    if (diff > 180) diff = 360 - diff;

    if (diff <= TARGET_TOLERANCE) {
      // Acierto: se cancelan las animaciones y se notifica el éxito
      cancelAnimation(rotation);
      cancelAnimation(circleDiameter);
      gameEnded.value = true;
      onResult(true);
    } else {
      // Fallo inmediato: se cancelan las animaciones y se notifica el fallo
      gameEnded.value = true;
      cancelAnimation(rotation);
      cancelAnimation(circleDiameter);
      onResult(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Wrapper con tamaño fijo para que el contenedor del círculo no modifique la distribución */}
      <View style={styles.circleWrapper}>
        <Animated.View style={[styles.circle, animatedCircleStyle]}>
          <Svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${INITIAL_DIAMETER} ${INITIAL_DIAMETER}`}
          >
            {/* Anillo exterior marrón */}
            <Circle cx={SVG_C} cy={SVG_C} r={OUTER_R} stroke="#6B2D0A" strokeWidth="12" fill="none" />
            {/* Anillo interior dorado */}
            <Circle cx={SVG_C} cy={SVG_C} r={INNER_R} stroke="#C8A84B" strokeWidth="3" fill="none" />
            {/* Marcas de posición */}
            {TICKS.map(t => (
              <Path key={t.key} d={t.d} stroke={t.stroke} strokeWidth={t.sw} fill="none" />
            ))}
            {/* Zona objetivo dorada brillante */}
            <AnimatedPath
              animatedProps={animatedPathProps}
              stroke="#FFD700"
              strokeWidth="10"
              fill="none"
            />
          </Svg>
          {/* Contenedor rotante del puntero */}
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              animatedRotationStyle,
              { justifyContent: 'center', alignItems: 'center' },
            ]}
          >
            <View style={styles.pointer} />
          </Animated.View>
        </Animated.View>
      </View>
      {/* Botón estático, fuera del wrapper */}
      <TouchableOpacity onPress={handleShot} style={styles.button}>
        <View style={{ transform: [{ rotate: '315deg' }] }}>
          <BowShootIcon width={font(120)} height={font(120)} overflow='hidden' />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
    top: '12%',
  },
  circleWrapper: {
    width: INITIAL_DIAMETER,
    height: INITIAL_DIAMETER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    backgroundColor: 'rgba(18, 7, 2, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  pointer: {
    position: 'absolute',
    width: POINTER_SIZE,
    height: POINTER_SIZE,
    borderRadius: POINTER_SIZE / 2,
    backgroundColor: '#ff020f',
    top: 0,
    shadowColor: '#f05236',
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  button: {
    marginTop: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

export default ShootingCircle;
