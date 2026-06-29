import React from 'react';
import { Pressable, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';

interface IconButtonProps {
  Icon: React.ComponentType<any>;
  width: number;
  height: number;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  children?: React.ReactNode;
  iconProps?: Record<string, any>;
}

const IconButton: React.FC<IconButtonProps> = ({ Icon, width, height, style, onPress, children, iconProps }) => (
  <TouchableOpacity
    style={[{ position: 'absolute', width, height }, style]}
    onPress={onPress}
  >
    {children}
    <Icon width={width} height={height} overflow='hidden' {...iconProps} />
  </TouchableOpacity>
);

export default IconButton;
