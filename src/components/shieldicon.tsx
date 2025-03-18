// ShieldIcon.tsx
import React from 'react';
import { TouchableOpacity, View, StyleSheet, GestureResponderEvent } from 'react-native';
import { Shield2Icon } from './SvgExporter'

interface ShieldIconProps {
  width: number;
  height: number;
  fill: string;
  onPress?: (event: GestureResponderEvent) => void;
}

const ShieldIcon: React.FC<ShieldIconProps> = ({ width, height, fill, onPress }) => {
  const Container = onPress ? TouchableOpacity : View;
  return (
    <Container style={styles.iconContainer} onPress={onPress} activeOpacity={1}>
      <Shield2Icon width={width} height={height} fill={fill} />
    </Container>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: '100%',       // Se asegura de ocupar todo el espacio asignado
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ShieldIcon;
