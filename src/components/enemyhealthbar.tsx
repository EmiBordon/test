import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DevilHearthIcon, DevilHalfHearthIcon, DevilBrokenHearthIcon } from './SvgExporter';
import { font } from './functions/fontsize';

interface EnemyHealthBarProps {
  enemyHealth: number;
  enemyCurrentHealth: number;
}

const MAX_PER_ROW = 13; // cantidad máxima de corazones por fila

const EnemyHealthBar: React.FC<EnemyHealthBarProps> = ({ enemyHealth, enemyCurrentHealth }) => {
  const totalHearts = Math.ceil(enemyHealth / 2);
  const heartIcons = [];

  for (let i = 0; i < totalHearts; i++) {
    const heartPosition = i * 2;
    const current = enemyCurrentHealth - heartPosition;

    if (current >= 2) {
      heartIcons.push(<DevilHearthIcon width={font(25)} height={font(25)} key={i} />);
    } else if (current === 1) {
      heartIcons.push(<DevilHalfHearthIcon width={font(25)} height={font(25)} key={i} />);
    } else {
      heartIcons.push(<DevilBrokenHearthIcon width={font(25)} height={font(25)} key={i} />);
    }
  }

  // Agrupar íconos en filas
  const rows = [];
  for (let i = 0; i < heartIcons.length; i += MAX_PER_ROW) {
    const row = heartIcons.slice(i, i + MAX_PER_ROW);
    rows.push(
      <View key={`row-${i}`} style={styles.row}>
        {row}
      </View>
    );
  }

  return <View style={styles.container}>{rows}</View>;
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    marginVertical: 2,
  },
});

export default EnemyHealthBar;
