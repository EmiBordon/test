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
  DoubleDiceIcon 
} from '../SvgExporter';

interface DiceModalProps {
  visible: boolean;
  onClose: () => void;
}

const DiceModal: React.FC<DiceModalProps> = ({ visible, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [diceResult, setDiceResult] = useState<number>(1);
  const [diceResult2, setDiceResult2] = useState<number>(1);
  const [showResult, setShowResult] = useState(false);
  const [isTwoDiceMode, setIsTwoDiceMode] = useState(false);
  const [is666Mode, setIs666Mode] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const rotateZ = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const translateY2 = useRef(new Animated.Value(0)).current;
  const rotateZ2 = useRef(new Animated.Value(0)).current;
  const scale2 = useRef(new Animated.Value(1)).current;

  // Función para generar número aleatorio del 1 al 6
  const rollDice = (): number => {
    return Math.floor(Math.random() * 6) + 1;
  };

  // Función para obtener el icono correspondiente al número
  const getDiceIcon = (number: number, size: number = 80, is666: boolean = false) => {
    const iconProps = { width: size, height: size };
    
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

  const startDiceAnimation = (twoDice: boolean = false, is666: boolean = false) => {
    setIsTwoDiceMode(twoDice);
    setIs666Mode(is666);
    setShowResult(false);
    
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
        
        // Cerrar el modal automáticamente después de 2 segundos
        setTimeout(() => {
          onClose();
        }, 2000);
      });
    } else {
      // Ejecutar solo el primer dado
      Animated.sequence(dice1Animations).start(() => {
        setIsAnimating(false);
        setDiceResult(newResult1);
        setShowResult(true);
        rotateZ.setValue(0);
        
        // Cerrar el modal automáticamente después de 2 segundos
        setTimeout(() => {
          onClose();
        }, 2000);
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

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        {isTwoDiceMode ? (
          <>
            <View style={styles.twoDiceContainer}>
              <View style={styles.singleDiceContainer}>
                <Animated.View style={[styles.diceWrapper, animatedStyle]}>
                  {isAnimating ? (
                    <RotateDiceIcon width={60} height={60} />
                  ) : (
                    getDiceIcon(diceResult, 60)
                  )}
                </Animated.View>
              </View>
              <View style={styles.singleDiceContainer}>
                <Animated.View style={[styles.diceWrapper, animatedStyle2]}>
                  {isAnimating ? (
                    <RotateDiceIcon width={60} height={60} />
                  ) : (
                    getDiceIcon(diceResult2, 60)
                  )}
                </Animated.View>
              </View>
            </View>
            {showResult && (
              <Text style={styles.sumText}>
                Suma: {diceResult + diceResult2}
              </Text>
            )}
          </>
        ) : (
          <View style={styles.diceContainer}>
            <Animated.View style={[styles.diceWrapper, animatedStyle]}>
              {isAnimating ? (
                <RotateDiceIcon width={80} height={80} />
              ) : (
                getDiceIcon(diceResult, 80, is666Mode)
              )}
            </Animated.View>
          </View>
        )}

        {!isAnimating && !showResult && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.rollTwoButton]}
              onPress={() => startDiceAnimation(true, false)}
            >
              <DoubleDiceIcon width={55} height={55} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.rollButton]}
              onPress={() => startDiceAnimation(false, false)}
            >
              <Dice1Icon width={40} height={40} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.roll666Button]}
              onPress={() => startDiceAnimation(false, true)}
            >
              <Dice666Icon width={40} height={40} />
            </TouchableOpacity>
          </View>
        )}
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
    paddingBottom: 50,
  },
  diceContainer: {
    height: 150,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  twoDiceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 200,
    marginBottom: 20,
  },
  singleDiceContainer: {
    height: 100,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diceWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sumText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    maxWidth: 350,
    flexWrap: 'wrap',
  },
  button: {
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
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
});

export default DiceModal;
