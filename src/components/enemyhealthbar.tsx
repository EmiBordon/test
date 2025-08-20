import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HearthIcon, HearthMediumIcon, HearthLowIcon, BrokenHearthIcon } from './SvgExporter';
import { font } from './functions/fontsize';

interface EnemyHealthBarProps {
  enemyHealth: number;
  enemyCurrentHealth: number;
}

const MAX_PER_ROW = 13; // cantidad máxima de corazones por fila

const EnemyHealthBar: React.FC<EnemyHealthBarProps> = ({ enemyHealth, enemyCurrentHealth }) => {
  const totalHearts = Math.ceil(enemyHealth / 3); // Cada corazón representa 3 puntos
  const heartIcons = [];

  for (let i = 0; i < totalHearts; i++) {
    const heartPosition = i * 3;
    const current = enemyCurrentHealth - heartPosition;

    if (current >= 3) {
      // Corazón completo (3 puntos de vida)
      heartIcons.push(<HearthIcon width={font(25)} height={font(25)} key={i} />);
    } else if (current === 2) {
      // Corazón medio (2 puntos de vida)
      heartIcons.push(<HearthMediumIcon width={font(25)} height={font(25)} key={i} />);
    } else if (current === 1) {
      // Corazón bajo (1 punto de vida)
      heartIcons.push(<HearthLowIcon width={font(25)} height={font(25)} key={i} />);
    } else {
      // Corazón vacío (0 puntos de vida)
      heartIcons.push(<BrokenHearthIcon width={font(25)} height={font(25)} key={i} />);
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
