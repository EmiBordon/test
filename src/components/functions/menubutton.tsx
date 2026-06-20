import React from 'react';
import { TouchableOpacity, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { MenuIcon } from '../SvgExporter';
import { font } from './fontsize';

interface MenuButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const MenuButton: React.FC<MenuButtonProps> = ({ onPress, style }) => (
  <TouchableOpacity style={[styles.menuButton, style]} onPress={onPress}>
    <View style={styles.circle}>
      <MenuIcon width={font(25)} height={font(25)} fill='#D4AF37' />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    top: '1%',
    left: '2%',
    zIndex: 10,
    padding: 5,
  },
  circle: {
    backgroundColor: '#6B2D0A',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'black',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D4AF37',
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default MenuButton;
