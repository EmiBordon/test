// ShakyMaiaIcon.tsx
import React, { useImperativeHandle, forwardRef } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Maia5HeadIcon} from '../SvgExporter';

export interface ShakyMaiaHeadIconRef {
  triggerShake: () => void;
}

interface ShakyMaiaHeadIconProps {
  height: number;
  width: number;
}

const ShakyMaiaHeadIcon = forwardRef<ShakyMaiaHeadIconRef, ShakyMaiaHeadIconProps>(
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
        <Maia5HeadIcon height={height} width={width} />
      </Animated.View>
    );
  }
);

export default ShakyMaiaHeadIcon;
