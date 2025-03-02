// ShakyMaiaIcon.tsx
import React, { useImperativeHandle, forwardRef } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { MattIcon } from '../SvgExporter';

export interface ShakyMattIconRef {
  triggerShake: () => void;
}

interface ShakyMattIconProps {
  height: number;
  width: number;
}

const ShakyMattIcon = forwardRef<ShakyMaiaIconRef, ShakyMattIconProps>(
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
        <MattIcon height={height} width={width} />
      </Animated.View>
    );
  }
);

export default ShakyMattIcon;
