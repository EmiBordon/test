import React, { FC, useState, useEffect } from 'react';
import { View, StyleSheet, Button, Alert, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  runOnJS, 
  SharedValue 
} from 'react-native-reanimated';
// Importamos los íconos (asegúrate de que la ruta y sus tipados sean correctos)
import { HearthIcon } from '../SvgExporter';
import { TearIcon } from '../SvgExporter';

const { width, height } = Dimensions.get('window');

// Definimos 3 carriles con posiciones X relativas
const lanes: number[] = [
  width / 2 - 100, // carril izquierdo
  width / 2 - 25,  // carril central
  width / 2 + 50,  // carril derecho
];

const playerY: number = height - 150;

// Tipado para los props del cuadrado que cae
interface FallingSquareProps {
  lane: number;
  onAvoid: () => void;
  onCollide: () => void;
  playerLane: number;
}

const FallingSquare: FC<FallingSquareProps> = ({ lane, onAvoid, onCollide, playerLane }) => {
  // Shared value para la posición vertical
  const translateY: SharedValue<number> = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    left: lanes[lane],
  }));

  useEffect(() => {
    translateY.value = withTiming(height, { duration: 3000 }, (isFinished) => {
      if (isFinished) {
        runOnJS(onAvoid)();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Chequeo de colisión cada 50ms (puedes optimizar esta lógica usando useAnimatedReaction)
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (lane === playerLane && translateY.value > playerY - 50 && translateY.value < playerY + 50) {
        runOnJS(onCollide)();
      }
    }, 50);
    return () => clearInterval(intervalId);
  }, [lane, playerLane, onCollide, translateY]);

  return (
    <Animated.View style={[styles.iconContainer, animatedStyle]}>
      <TearIcon width={50} height={50} />
    </Animated.View>
  );
};

// Definimos el tipo para cada cuadrado generado
interface Square {
  id: number;
  lane: number;
}

const Game: FC = () => {
  const [playerLane, setPlayerLane] = useState<number>(1);
  const [squares, setSquares] = useState<Square[]>([]);
  const [squaresAvoided, setSquaresAvoided] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWin, setGameWin] = useState<boolean>(false);

  // Shared value para la posición horizontal del jugador
  const playerX: SharedValue<number> = useSharedValue(lanes[playerLane]);

  // Actualizamos la posición animada cada vez que cambia el carril
  useEffect(() => {
    playerX.value = withTiming(lanes[playerLane], { duration: 200 });
  }, [playerLane, playerX]);

  const moveLeft = () => {
    if (playerLane > 0 && !gameOver && !gameWin) setPlayerLane(playerLane - 1);
  };

  const moveRight = () => {
    if (playerLane < 2 && !gameOver && !gameWin) setPlayerLane(playerLane + 1);
  };

  const handleAvoid = () => {
    setSquaresAvoided(prev => {
      const newCount = prev + 1;
      if (newCount >= 10) {
        setGameWin(true);
        Alert.alert('Ganaste!');
      }
      return newCount;
    });
  };

  const handleCollision = () => {
    if (!gameOver && !gameWin) {
      setGameOver(true);
      Alert.alert('Perdiste');
    }
  };

  // Genera cuadrados cada 1.5 segundos hasta que se hayan creado 10 o se acabe el juego
  useEffect(() => {
    if (squares.length >= 10 || gameOver || gameWin) return;
    const intervalId = setInterval(() => {
      const lane = Math.floor(Math.random() * 3);
      const id = Date.now();
      setSquares(prev => [...prev, { id, lane }]);
    }, 1500);
    return () => clearInterval(intervalId);
  }, [squares, gameOver, gameWin]);

  const resetGame = () => {
    setPlayerLane(1);
    setSquares([]);
    setSquaresAvoided(0);
    setGameOver(false);
    setGameWin(false);
    playerX.value = lanes[1];
  };

  const playerAnimatedStyle = useAnimatedStyle(() => ({
    left: playerX.value,
  }));

  return (
    <View style={styles.container}>
      {squares.map((sq) => (
        <FallingSquare
          key={sq.id}
          lane={sq.lane}
          playerLane={playerLane}
          onAvoid={handleAvoid}
          onCollide={handleCollision}
        />
      ))}

      {/* Jugador representado con HearthIcon */}
      <Animated.View style={[styles.iconContainer, playerAnimatedStyle, { top: playerY }]}>
        <HearthIcon width={50} height={50} />
      </Animated.View>

      {/* Controles */}
      <View style={styles.controls}>
        <Button title="Izquierda" onPress={moveLeft} disabled={gameOver || gameWin} />
        <Button title="Derecha" onPress={moveRight} disabled={gameOver || gameWin} />
      </View>

      {(gameOver || gameWin) && (
        <View style={styles.reset}>
          <Button title="Reiniciar" onPress={resetGame} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  iconContainer: {
    position: 'absolute',
    width: 50,
    height: 50,
  },
  controls: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  reset: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
  },
});

export default Game;
