// ShootingCircle.tsx
import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
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
import Svg, { Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const { width } = Dimensions.get('window');
const INITIAL_DIAMETER = width * 0.8; // Diámetro inicial del círculo
const POINTER_SIZE = width * 0.05;    // Tamaño del puntero
const TARGET_TOLERANCE = 15;          // Tolerancia en grados para el objetivo (±15°)

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
  const targetAngle = useSharedValue(Math.floor(Math.random() * 360));

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
    const diameter = INITIAL_DIAMETER;
    const center = diameter / 2;
    const borderWidth = 4;
    const radius = (diameter - borderWidth) / 2;
    const adjustedTarget = targetAngle.value - 90;
    const startAngle = (adjustedTarget - TARGET_TOLERANCE) * (Math.PI / 180);
    const endAngle = (adjustedTarget + TARGET_TOLERANCE) * (Math.PI / 180);
    const startX = center + radius * Math.cos(startAngle);
    const startY = center + radius * Math.sin(startAngle);
    const endX = center + radius * Math.cos(endAngle);
    const endY = center + radius * Math.sin(endAngle);
    return { d: `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}` };
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
          {/* Zona de impacto: se dibuja un arco negro */}
          <Svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${INITIAL_DIAMETER} ${INITIAL_DIAMETER}`}
          >
            <AnimatedPath
              animatedProps={animatedPathProps}
              stroke="black"
              strokeWidth="4"
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
        <Text style={styles.buttonText}>DISPARAR</Text>
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
    borderWidth: 4,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointer: {
    position: 'absolute',
    width: POINTER_SIZE,
    height: POINTER_SIZE,
    borderRadius: POINTER_SIZE / 2,
    backgroundColor: 'black',
    top: 0, // El puntero se posiciona en la parte superior del contenedor rotante
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
    fontSize: 20,
  },
});

export default ShootingCircle;
