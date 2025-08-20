import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { HearthIcon, HearthMediumIcon, HearthLowIcon, BrokenHearthIcon } from './SvgExporter';
import { font } from './functions/fontsize';

interface MaiaState {
    maiahealth: number;
    maiacurrenthealth: number;
  }
  interface RootState {
    maia: MaiaState;
  }

const HealthBar = () => {
  const maiaHealth = useSelector((state: RootState) => state.maia.maiahealth);
  const maiaCurrentHealth = useSelector((state: RootState) => state.maia.maiacurrenthealth);

  const totalHearts = Math.ceil(maiaHealth / 3); // Cada corazón representa 3 puntos

  const hearts = [];

  for (let i = 0; i < totalHearts; i++) {
    const heartPosition = i * 3;
    const current = maiaCurrentHealth - heartPosition;

    if (current >= 3) {
      // Corazón completo (3 puntos de vida)
      hearts.push(<HearthIcon width={font(20)} height={font(20)} key={i} />);
    } else if (current === 2) {
      // Corazón medio (2 puntos de vida)
      hearts.push(<HearthMediumIcon width={font(20)} height={font(20)} key={i} />);
    } else if (current === 1) {
      // Corazón bajo (1 punto de vida)
      hearts.push(<HearthLowIcon width={font(20)} height={font(20)} key={i} />);
    } else {
      // Corazón vacío (0 puntos de vida)
      hearts.push(<BrokenHearthIcon width={font(20)} height={font(20)} key={i} />);
    }
  }

  return <View style={styles.container}>{hearts}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HealthBar;
