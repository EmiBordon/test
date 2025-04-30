import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { HearthIcon } from './SvgExporter';
import { HalfHearthIcon } from './SvgExporter';
import { BrokenHearthIcon } from './SvgExporter';
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

  const totalHearts = Math.ceil(maiaHealth / 2); // Cada corazón representa 2 puntos

  const hearts = [];

  for (let i = 0; i < totalHearts; i++) {
    const heartPosition = i * 2;
    const current = maiaCurrentHealth - heartPosition;

    if (current >= 2) {
      hearts.push(<HearthIcon width={font(20)} height={font(20)} key={i} />);
    } else if (current === 1) {
      hearts.push(<HalfHearthIcon width={font(20)} height={font(20)}  key={i} />);
    } else {
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
