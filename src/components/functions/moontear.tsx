// MoonTear.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutChangeEvent,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { font } from './fontsize';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Tamaños fijos en píxeles (no porcentajes) para que el ícono nunca pueda
// terminar siendo más grande que el botón que lo contiene.
const BUTTON_SIZE = SCREEN_WIDTH * 0.28;
const BUTTON_ICON_SIZE = BUTTON_SIZE * 0.8;

// Definición de las props para los componentes SVG
export interface SVGIconProps {
  width: number;
  height: number;
}
export type SVGIconComponent = React.FC<SVGIconProps>;

interface Position {
  x: number;
  y: number;
}

interface PatternItem {
  type: number; // 0 = moon, 1 = tear
  position: Position;
}

interface AnimatedIconProps {
  id: string;
  IconComponent: SVGIconComponent;
  position: Position;
  iconSize: number;
  difficulty: number;
  onAnimationEnd: (id: string) => void;
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  id,
  IconComponent,
  position,
  iconSize,
  difficulty,
  onAnimationEnd,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const duration1 = 700 / difficulty;
    const duration2 = 300 / difficulty;
    
    scale.value = withSequence(
      withTiming(1, { duration: duration1 }),
      withTiming(1.2, { duration: duration2 })
    );
    opacity.value = withSequence(
      withTiming(1, { duration: duration1 }),
      withTiming(0, { duration: duration2 }, (finished) => {
        if (finished) {
          runOnJS(onAnimationEnd)(id);
        }
      })
    );
  }, [id, onAnimationEnd, scale, opacity, difficulty]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.iconAnimatedContainer,
        { left: position.x, top: position.y, width: iconSize, height: iconSize },
        animatedStyle,
      ]}
    >
      <IconComponent width={iconSize} height={iconSize} />
    </Animated.View>
  );
};

type Phase = 'init' | 'showing' | 'input';

interface MoonTearProps {
  patternLength: number;
  onResult: (result: boolean) => void;
  difficulty: number; // 1 = velocidad base; valores mayores aceleran las animaciones.
  moonIcon: SVGIconComponent;
  tearIcon: SVGIconComponent;
}

const MoonTear: React.FC<MoonTearProps> = ({
  patternLength,
  onResult,
  difficulty,
  moonIcon,
  tearIcon,
}) => {
  // Renombramos los íconos para usarlos en JSX
  const MoonIcon = moonIcon;
  const TearIcon = tearIcon;

  const [phase, setPhase] = useState<Phase>('init');
  const [pattern, setPattern] = useState<PatternItem[]>([]);
  const [currentPatternIndex, setCurrentPatternIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number } | null>(null);

  const onContainerLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  const getRandomInRange = (min: number, max: number): number =>
    Math.random() * (max - min) + min;

  const startGame = (): void => {
    if (!containerSize) return;
    const availableWidth = containerSize.width;
    const availableHeight = containerSize.height;
    const iconSize = availableWidth * 0.4;
    const newPattern: PatternItem[] = Array.from({ length: patternLength }, () => {
      const type = Math.floor(Math.random() * 2);
      const x = getRandomInRange(0, availableWidth - iconSize);
      const y = getRandomInRange(0, availableHeight - iconSize);
      return { type, position: { x, y } };
    });
    setPattern(newPattern);
    setCurrentPatternIndex(0);
    setUserInput([]);
    setPhase('showing');
  };

  useEffect(() => {
    if (containerSize && phase === 'init') {
      startGame();
    }
  }, [containerSize, phase]);

  const handleAnimationEnd = (id: string): void => {
    if (currentPatternIndex < pattern.length - 1) {
      setCurrentPatternIndex((prev) => prev + 1);
    } else {
      setPhase('input');
    }
  };

  const handleUserInput = (input: number): void => {
    const newInput = [...userInput, input];
    setUserInput(newInput);

    // Validar cada entrada del usuario
    for (let i = 0; i < newInput.length; i++) {
      if (newInput[i] !== pattern[i].type) {
        onResult(false);
        setPhase('init');
        return;
      }
    }
    // Si la secuencia es correcta y se completó, esperar un momento para mostrar el último indicador en negro
    if (newInput.length === pattern.length) {
      setTimeout(() => {
        onResult(true);
        setPhase('init');
      }, 250);
    }
  };

  const computedIconSize = containerSize ? containerSize.width * 0.4 : 70;

  return (
    <View style={styles.root}>
      <View style={styles.top}>
        <Text style={styles.title}>
          {phase === 'showing' ? 'MEMORIZA' : phase === 'input' ? 'REPITE' : ''}
        </Text>

        {phase === 'input' ? (
          /* Indicadores del patrón, centrados en pantalla: se iluminan en dorado al acertar */
          <View style={styles.progressContainer}>
            {pattern.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressRect,
                  index < userInput.length && styles.progressRectDone,
                ]}
              />
            ))}
          </View>
        ) : (
          <View style={[styles.animationArea, { width: '72%', aspectRatio: 1 }]} onLayout={onContainerLayout}>
            {phase === 'showing' && containerSize && pattern.length > 0 && (
              <AnimatedIcon
                id={`${currentPatternIndex}`}
                IconComponent={pattern[currentPatternIndex].type === 0 ? MoonIcon : TearIcon}
                position={pattern[currentPatternIndex].position}
                iconSize={computedIconSize}
                difficulty={difficulty}
                onAnimationEnd={handleAnimationEnd}
              />
            )}
          </View>
        )}
      </View>

      {phase === 'input' && (
        <View style={styles.bottomArea}>
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={() => handleUserInput(0)}>
              <MoonIcon width={BUTTON_ICON_SIZE} height={BUTTON_ICON_SIZE} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => handleUserInput(1)}>
              <TearIcon width={BUTTON_ICON_SIZE} height={BUTTON_ICON_SIZE} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  top: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: '4%',
    fontSize: font(24),
    fontWeight: 'bold',
    color: '#C8A84B',
    textShadowColor: '#2e2018',
    textShadowRadius: 4,
  },
  animationArea: {
    position: 'relative',
    backgroundColor: 'transparent',
  },
  iconAnimatedContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '5%',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8d634a',
    borderRadius: BUTTON_SIZE / 2,
    borderWidth: 3,
    borderColor: '#000000',
    marginHorizontal: BUTTON_SIZE * 0.15,
    overflow: 'hidden',
    shadowColor: '#C8A84B',
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  progressContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRect: {
    width: font(24),
    height: font(24),
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#3D1A00',
    marginHorizontal: 8,
    marginVertical: 8,
  },
  progressRectDone: {
    backgroundColor: '#C8A84B',
  },
});

export default MoonTear;
