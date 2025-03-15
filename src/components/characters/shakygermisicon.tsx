// ShakyMaiaIcon.tsx
import React, { useImperativeHandle, forwardRef } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { GermisIcon } from '../SvgExporter';

export interface ShakyGermisIconRef {
  triggerShake: () => void;
}

interface ShakyGermisIconProps {
  height: number;
  width: number;
}

const ShakyGermisIcon = forwardRef<ShakyGermisIconRef, ShakyGermisIconProps>(
  ({ height, width }, ref) => {
    const shake = useSharedValue({ x: 0, y: 0 });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: shake.value.x },
        { translateY: shake.value.y },
      ],
    }));

    const triggerShake = () => {
      shake.value = withSequence(
        withTiming({ x: -10, y: -10 }, { duration: 50 }),
        withTiming({ x: 10, y: -10 }, { duration: 50 }),
        withTiming({ x: -10, y: 10 }, { duration: 50 }),
        withTiming({ x: 10, y: 10 }, { duration: 50 }),
        withTiming({ x: 0, y: 0 }, { duration: 50 })
      );
    };

    useImperativeHandle(ref, () => ({
      triggerShake,
    }));

    return (
      <Animated.View style={[animatedStyle, { pointerEvents: 'none' }]}>
        <GermisIcon height={height} width={width} />
      </Animated.View>
    );
  }
);

export default ShakyGermisIcon;
