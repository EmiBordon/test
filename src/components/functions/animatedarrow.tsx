// AnimatedArrow.tsx
import React, { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { ArrowIcon } from '../SvgExporter';

export interface AnimatedArrowProps {
  style?: StyleProp<ViewStyle>;
  arrowWidth?: number;
  arrowHeight?: number;
  /** Dirección: 'L' (left), 'R' (right), 'U' (up) o 'D' (down) */
  direction: 'L' | 'R' | 'U' | 'D';
  animationDuration?: number;
}

const AnimatedArrow: React.FC<AnimatedArrowProps> = ({
  style,
  arrowWidth = 50,
  arrowHeight = 50,
  direction,
  animationDuration = 1000,
}) => {
  // Valores animados para traslación y opacidad
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  // Definimos la rotación que se aplicará al ícono (estática)
  const rotation = (() => {
    switch (direction) {
      case 'L':
        return '180deg';
      case 'U':
        return '-90deg';
      case 'D':
        return '90deg';
      case 'R':
      default:
        return '0deg';
    }
  })();

  // Definimos el vector de traslación según la dirección (en coordenadas de la pantalla)
  const magnitude = 20;
  const animTranslation = (() => {
    switch (direction) {
      case 'L':
        return { x: -magnitude, y: 0 };
      case 'U':
        return { x: 0, y: -magnitude };
      case 'D':
        return { x: 0, y: magnitude };
      case 'R':
      default:
        return { x: magnitude, y: 0 };
    }
  })();

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(animTranslation.x, { duration: animationDuration, easing: Easing.linear }),
      3,
      false
    );
    translateY.value = withRepeat(
      withTiming(animTranslation.y, { duration: animationDuration, easing: Easing.linear }),
      3,
      false
    );
    opacity.value = withRepeat(
      withTiming(0, { duration: animationDuration, easing: Easing.linear }),
      3,
      false
    );
  }, [animTranslation, animationDuration, translateX, translateY, opacity]);

  // Esta animación aplica únicamente la traslación y el fade out
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {/* Aquí se aplica la rotación estática al ícono */}
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        <ArrowIcon width={arrowWidth} height={arrowHeight} />
      </Animated.View>
    </Animated.View>
  );
};

export default AnimatedArrow;
