import React from 'react';
import { Pressable, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';

interface IconButtonProps {
  Icon: React.ComponentType<any>;
  width: number;
  height: number;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  children?: React.ReactNode;
}

const IconButton: React.FC<IconButtonProps> = ({ Icon, width, height, style, onPress, children }) => (
  <TouchableOpacity
    style={[{ position: 'absolute', width, height }, style]}
    onPress={onPress}
  >
    {children}
    <Icon width={width} height={height} overflow='hidden' />
  </TouchableOpacity>
);

export default IconButton;
