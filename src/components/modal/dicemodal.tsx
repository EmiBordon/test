import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { 
  RotateDiceIcon, 
  Dice1Icon, 
  Dice2Icon, 
  Dice3Icon, 
  Dice4Icon, 
  Dice5Icon, 
  Dice6Icon,
  Dice666Icon,
  DoubleDiceIcon,
  BlackDice1Icon,
  BlackDice2Icon,
  BlackDice3Icon,
  BlackDice4Icon,
  BlackDice5Icon,
  BlackDice6Icon
} from '../SvgExporter';
import { font } from '../functions/fontsize';

interface DiceModalProps {
  visible: boolean;
  onClose: (playerWon?: boolean) => void;
}

const DiceModal: React.FC<DiceModalProps> = ({ visible, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [diceResult, setDiceResult] = useState<number>(1);
  const [diceResult2, setDiceResult2] = useState<number>(1);
  const [showResult, setShowResult] = useState(false);
  const [isTwoDiceMode, setIsTwoDiceMode] = useState(false);
  const [is666Mode, setIs666Mode] = useState(false);
  const [blackDiceResult, setBlackDiceResult] = useState<number>(1);
  const [blackDiceAnimating, setBlackDiceAnimating] = useState(false);
  const [blackDiceShown, setBlackDiceShown] = useState(false);
  const [gamePhase, setGamePhase] = useState<'blackdice' | 'choosing' | 'playing' | 'result'>('blackdice');
  const [gameResult, setGameResult] = useState<'win' | 'lose' | 'tie' | null>(null);
  const translateY = useRef(new Animated.Value(0)).current;
  const rotateZ = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const translateY2 = useRef(new Animated.Value(0)).current;
  const rotateZ2 = useRef(new Animated.Value(0)).current;
  const scale2 = useRef(new Animated.Value(1)).current;
  const blackTranslateY = useRef(new Animated.Value(0)).current;
  const blackRotateZ = useRef(new Animated.Value(0)).current;
  const blackScale = useRef(new Animated.Value(1)).current;

  // Función para generar número aleatorio del 1 al 6
  const rollDice = (): number => {
    return Math.floor(Math.random() * 6) + 1;
  };

  // Función para obtener el icono correspondiente al número
  const getDiceIcon = (number: number, size: number = 80, is666: boolean = false) => {
    const iconProps = { width: font(size), height: font(size) };
    
    if (is666 && number === 6) {
      return <Dice666Icon {...iconProps} />;
    }
    
    switch (number) {
      case 1: return <Dice1Icon {...iconProps} />;
      case 2: return <Dice2Icon {...iconProps} />;
      case 3: return <Dice3Icon {...iconProps} />;
      case 4: return <Dice4Icon {...iconProps} />;
      case 5: return <Dice5Icon {...iconProps} />;
      case 6: return <Dice6Icon {...iconProps} />;
      default: return <Dice1Icon {...iconProps} />;
    }
  };

  // Función para obtener el icono negro correspondiente al número
  const getBlackDiceIcon = (number: number, size: number = 80) => {
    const iconProps = { width: font(size), height: font(size) };
    
    switch (number) {
      case 1: return <BlackDice1Icon {...iconProps} />;
      case 2: return <BlackDice2Icon {...iconProps} />;
      case 3: return <BlackDice3Icon {...iconProps} />;
      case 4: return <BlackDice4Icon {...iconProps} />;
      case 5: return <BlackDice5Icon {...iconProps} />;
      case 6: return <BlackDice6Icon {...iconProps} />;
      default: return <BlackDice1Icon {...iconProps} />;
    }
  };

  // Función para comparar resultados y determinar el ganador
  const compareResults = (playerResult: number, blackResult: number) => {
    if (playerResult > blackResult) {
      return 'win';
    } else if (playerResult < blackResult) {
      return 'lose';
    } else {
      return 'tie';
    }
  };

  // Función para manejar el final del juego
  const handleGameEnd = (result: 'win' | 'lose' | 'tie') => {
    setGameResult(result);
    // NO cambiar la fase inmediatamente, mantener 'playing' para mostrar resultados
    
    // Esperar 1 segundo mostrando los resultados
    setTimeout(() => {
      if (result === 'tie') {
        // En caso de empate, reiniciar
        setGamePhase('blackdice');
        setBlackDiceShown(false);
        setShowResult(false);
        setGameResult(null);
        startBlackDiceAnimation();
      } else {
        // Cerrar directamente informando el resultado (true si ganó, false si perdió)
        onClose(result === 'win');
      }
    }, 1000);
  };

  // Función para animar el BlackDice
  const startBlackDiceAnimation = () => {
    setBlackDiceAnimating(true);
    
    // Generar resultado del BlackDice
    const newBlackResult = rollDice();
    
    // Reset values para BlackDice
    blackTranslateY.setValue(0);
    blackRotateZ.setValue(0);
    blackScale.setValue(1);

    // Crear animaciones para el BlackDice (misma lógica que los dados normales)
    const blackDiceAnimations = [
      // Fase 1: Elevación con rotación continua
      Animated.parallel([
        Animated.timing(blackTranslateY, {
          toValue: -120,
          duration: 1200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(blackScale, {
          toValue: 1.3,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(blackRotateZ, {
          toValue: 6,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
      // Fase 2: Caída con rotación continua
      Animated.parallel([
        Animated.timing(blackTranslateY, {
          toValue: 0,
          duration: 1000,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.timing(blackScale, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(blackRotateZ, {
          toValue: 10,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
      // Fase 3: Detener rotación
      Animated.timing(blackRotateZ, {
        toValue: 12,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ];

    // Ejecutar animación del BlackDice
    Animated.sequence(blackDiceAnimations).start(() => {
      setBlackDiceAnimating(false);
      setBlackDiceResult(newBlackResult);
      setBlackDiceShown(true);
      setGamePhase('choosing');
      blackRotateZ.setValue(0);
    });
  };

  const startDiceAnimation = (twoDice: boolean = false, is666: boolean = false) => {
    setIsTwoDiceMode(twoDice);
    setIs666Mode(is666);
    setShowResult(false);
    setGamePhase('playing');
    
    // Dar tiempo al estado para actualizarse antes de iniciar la animación
    setTimeout(() => {
      setIsAnimating(true);
      
      // Generar los resultados de la tirada al inicio
      const newResult1 = is666 ? 6 : rollDice();
      const newResult2 = twoDice ? rollDice() : 1;
      
      // Reset values - empezar en estado estático
      translateY.setValue(0);
      rotateZ.setValue(0);
      scale.setValue(1);
      translateY2.setValue(0);
      rotateZ2.setValue(0);
      scale2.setValue(1);

      // Crear animaciones para el primer dado
    const dice1Animations = [
      // Fase 1: Elevación con rotación continua
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -120,
          duration: 1200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.3,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(rotateZ, {
          toValue: 6,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
      // Fase 2: Caída con rotación continua
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 1000,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(rotateZ, {
          toValue: 10,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
      // Fase 3: Detener rotación
      Animated.timing(rotateZ, {
        toValue: 12,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ];

    if (twoDice) {
      // Crear animaciones para el segundo dado (con slight delay)
      const dice2Animations = [
        // Fase 1: Elevación con rotación continua
        Animated.parallel([
          Animated.timing(translateY2, {
            toValue: -120,
            duration: 1200,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(scale2, {
            toValue: 1.3,
            duration: 600,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(rotateZ2, {
            toValue: 6,
            duration: 1200,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
        // Fase 2: Caída con rotación continua
        Animated.parallel([
          Animated.timing(translateY2, {
            toValue: 0,
            duration: 1000,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
          Animated.timing(scale2, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(rotateZ2, {
            toValue: 10,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
        // Fase 3: Detener rotación
        Animated.timing(rotateZ2, {
          toValue: 12,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ];

      // Ejecutar ambos dados en paralelo
      Animated.parallel([
        Animated.sequence(dice1Animations),
        Animated.sequence(dice2Animations),
      ]).start(() => {
        setIsAnimating(false);
        setDiceResult(newResult1);
        setDiceResult2(newResult2);
        setShowResult(true);
        rotateZ.setValue(0);
        rotateZ2.setValue(0);
        
        // Comparar resultado (suma de dos dados vs blackDice)
        const playerTotal = newResult1 + newResult2;
        const result = compareResults(playerTotal, blackDiceResult);
        handleGameEnd(result);
      });
    } else {
      // Ejecutar solo el primer dado
      Animated.sequence(dice1Animations).start(() => {
        setIsAnimating(false);
        setDiceResult(newResult1);
        setShowResult(true);
        rotateZ.setValue(0);
        
        // Comparar resultado (un dado vs blackDice)
        const result = compareResults(newResult1, blackDiceResult);
        handleGameEnd(result);
      });
    }
    }, 50); // 50ms delay para permitir que React actualice el estado
  };

  useEffect(() => {
    if (visible) {
      // Reset estados cuando se abre el modal
      setIsAnimating(false);
      setShowResult(false);
      setDiceResult(1);
      setDiceResult2(1);
      setIsTwoDiceMode(false);
      setIs666Mode(false);
      setBlackDiceResult(1);
      setBlackDiceAnimating(false);
      setBlackDiceShown(false);
      setGamePhase('blackdice');
      setGameResult(null);
      
      // Iniciar animación del BlackDice después de un pequeño delay
      setTimeout(() => {
        startBlackDiceAnimation();
      }, 300);
    }
  }, [visible]);

  const rotateInterpolate = rotateZ.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const rotateInterpolate2 = rotateZ2.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animatedStyle = {
    transform: [
      { translateY },
      { rotate: rotateInterpolate },
      { scale },
    ],
  };

  const animatedStyle2 = {
    transform: [
      { translateY: translateY2 },
      { rotate: rotateInterpolate2 },
      { scale: scale2 },
    ],
  };

  const blackRotateInterpolate = blackRotateZ.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const blackAnimatedStyle = {
    transform: [
      { translateY: blackTranslateY },
      { rotate: blackRotateInterpolate },
      { scale: blackScale },
    ],
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalContent}>
          {/* Fase inicial: Solo BlackDice centrado */}
          {gamePhase === 'blackdice' && (
            <View style={styles.blackDiceContainer}>
            <Animated.View style={[styles.diceWrapper, blackAnimatedStyle]}>
              {blackDiceAnimating ? (
                <BlackDice1Icon width={font(60)} height={font(60)} />
              ) : (
                getBlackDiceIcon(blackDiceResult, 60)
              )}
            </Animated.View>
          </View>
        )}

        {/* Fase de elección: BlackDice arriba, botones abajo */}
        {gamePhase === 'choosing' && (
          <>
            <View style={styles.blackDiceContainer}>
              <Animated.View style={[styles.diceWrapper, blackAnimatedStyle]}>
                {getBlackDiceIcon(blackDiceResult, 60)}
              </Animated.View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.rollTwoButton]}
                onPress={() => startDiceAnimation(true, false)}
              >
                <DoubleDiceIcon width={font(55)} height={font(55)} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.rollButton]}
                onPress={() => startDiceAnimation(false, false)}
              >
                <Dice1Icon width={font(40)} height={font(40)} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.roll666Button]}
                onPress={() => startDiceAnimation(false, true)}
              >
                <Dice666Icon width={font(40)} height={font(40)} />
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Fase de juego: Comparación horizontal */}
        {gamePhase === 'playing' && (
          <View style={styles.comparisonContainer}>
            {/* BlackDice a la izquierda */}
            <View style={styles.leftDiceContainer}>
              <View style={[styles.diceWrapper, styles.staticDice]}>
                {getBlackDiceIcon(blackDiceResult, 70)}
              </View>
            </View>

            {/* Dados del jugador a la derecha */}
            <View style={styles.rightDiceContainer}>
              {isTwoDiceMode ? (
                <View style={styles.playerTwoDiceContainer}>
                  <View style={styles.playerFirstDiceContainer}>
                    <Animated.View style={[styles.diceWrapper, animatedStyle]}>
                      {isAnimating ? (
                        <RotateDiceIcon width={font(50)} height={font(50)} />
                      ) : (
                        getDiceIcon(diceResult, 50)
                      )}
                    </Animated.View>
                  </View>
                  <View style={styles.playerSecondDiceContainer}>
                    <Animated.View style={[styles.diceWrapper, animatedStyle2]}>
                      {isAnimating ? (
                        <RotateDiceIcon width={font(50)} height={font(50)} />
                      ) : (
                        getDiceIcon(diceResult2, 50)
                      )}
                    </Animated.View>
                  </View>

                </View>
              ) : (
                <Animated.View style={[styles.diceWrapper, animatedStyle]}>
                  {isAnimating ? (
                    <RotateDiceIcon width={font(70)} height={font(70)} />
                  ) : (
                    getDiceIcon(diceResult, 70, is666Mode)
                  )}
                </Animated.View>
              )}
            </View>
          </View>
        )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modalContent: {
    width: '100%',
    height: '30%',
    backgroundColor: 'rgba(253, 253, 253, 0.97)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diceContainer: {
    height: font(150),
    width: font(150),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: font(20),
  },
  twoDiceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: font(200),
    marginBottom: font(20),
  },
  singleDiceContainer: {
    height: font(100),
    width: font(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  diceWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sumText: {
    fontSize: font(18),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: font(15),
    textAlign: 'center',
  },
  blackDiceContainer: {
    alignItems: 'center',
    marginBottom: font(20),
    paddingTop: font(10),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    maxWidth: font(350),
    flexWrap: 'wrap',
  },
  button: {
    borderRadius: font(15),
    padding: font(15),
    marginHorizontal: font(10),
    marginVertical: font(5),
    width: font(70),
    height: font(70),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: font(3),
  },
  rollButton: {
    backgroundColor: 'white',
    borderColor: 'black',
  },
  rollTwoButton: {
    backgroundColor: 'white',
    borderColor: 'black',
  },
  roll666Button: {
    backgroundColor: 'white',
    borderColor: 'black',
  },
  comparisonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '90%',
    paddingHorizontal: font(20),
  },
  leftDiceContainer: {
    alignItems: 'center',
    flex: 1,
  },
  rightDiceContainer: {
    alignItems: 'center',
    flex: 1,
  },

  staticDice: {
    // Estilo para dados estáticos (sin animación)
  },
  playerTwoDiceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  playerFirstDiceContainer: {
    marginRight: font(5),
  },
  playerSecondDiceContainer: {
    marginTop: font(15),
    marginLeft: font(5),
  },
});

export default DiceModal;
