// ShakyMaiaIcon.tsx
import React, { useImperativeHandle, forwardRef } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { QuiverArrowIcon } from '../SvgExporter';

export interface ShakyQuiverIconRef {
  triggerShake: () => void;
}

interface ShakyQuiverIconProps {
  height: number;
  width: number;
}

const ShakyQuiverIcon = forwardRef<ShakyQuiverIconRef, ShakyQuiverIconProps>(
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
        <QuiverArrowIcon height={height} width={width} />
      </Animated.View>
    );
  }
);

export default ShakyQuiverIcon;
