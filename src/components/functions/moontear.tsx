// MoonTear.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

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
    const iconSize = availableWidth * 0.25;
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

  const computedIconSize = containerSize ? containerSize.width * 0.25 : 50;

  return (
    <View style={styles.container}>
      <View style={[styles.animationArea, { width: '40%', aspectRatio: 1 }]} onLayout={onContainerLayout}>
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

      {phase === 'input' && (
        <>
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={() => handleUserInput(0)}>
              <MoonIcon width={computedIconSize} height={computedIconSize} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => handleUserInput(1)}>
              <TearIcon width={computedIconSize} height={computedIconSize} />
            </TouchableOpacity>
          </View>

          {/* Indicadores del patrón: rectángulos que se vuelven negros al acertar */}
          <View style={styles.progressContainer}>
            {pattern.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressRect,
                  { backgroundColor: index < userInput.length ? 'black' : 'white' },
                ]}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animationArea: {
    position: 'relative',
  },
  iconAnimatedContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    width: '60%',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  iconButton: {
    width: '40%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  progressRect: {
    width: '6%',
    height: '600%',
    borderWidth: 1,
    borderColor: 'black',
    marginHorizontal: 5,
  },
});

export default MoonTear;
