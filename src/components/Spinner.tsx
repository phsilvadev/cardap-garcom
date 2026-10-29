import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

export function Spinner({
  color = '#d4d4d8',
  size = 24,
  thickness = 2,
}: {
  color?: string;
  size?: number;
  thickness?: number;
}) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 800,
        easing: Easing.linear,
      }),
      -1,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          height: size,
          width: size,
          borderRadius: size / 2,
          borderWidth: thickness,
          borderColor: color,
          borderTopColor: 'transparent',
        },
      ]}
    />
  );
}
