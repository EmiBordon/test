import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { ManaBar0Icon, ManaBar1Icon, ManaBar2Icon, ManaBar3Icon, ManaBookIcon } from './SvgExporter';
import { font } from './functions/fontsize';

interface MaiaState {
  maiaMana: number;
}
interface RootState {
  maia: MaiaState;
}

const ManaBar = () => {
  const maiaMana = useSelector((state: RootState) => state.maia.maiaMana);

  const iconProps = { width: font(45), height: font(45),overflow:'hidden' };

  const renderIcon = () => {
    switch (maiaMana) {
      case 0: return <ManaBar0Icon {...iconProps} />;
      case 1: return <ManaBar1Icon {...iconProps} />;
      case 2: return <ManaBar2Icon {...iconProps} />;
      default: return <ManaBar3Icon {...iconProps} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bookIconContainer}>
        <ManaBookIcon width={font(45)} height={font(45)} overflow='hidden' />
      </View>
      <View style={styles.manaIconContainer}>
        <Text style={styles.manaText}>{maiaMana}</Text>
        {renderIcon()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    right: font (16)
  },
  bookIconContainer: {
    left: font (16)
  },
  manaIconContainer: {
    transform: [{ rotate: '-90deg' }],
  },
  manaText: {
    position: 'absolute',
    bottom: font(2),
    right: font(3),
    color: '#fff',
    fontSize: font(14),
    fontFamily: 'MedievalSharp',
    zIndex: 1,
    transform: [{ rotate: '90deg' }],
  },
});

export default ManaBar;
