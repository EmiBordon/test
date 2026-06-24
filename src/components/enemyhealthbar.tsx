import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HearthIcon, HearthMediumIcon, HearthLowIcon, BrokenHearthIcon } from './SvgExporter';
import { font } from './functions/fontsize';

interface EnemyHealthBarProps {
  enemyHealth: number;
  enemyCurrentHealth: number;
}

const EnemyHealthBar: React.FC<EnemyHealthBarProps> = ({ enemyHealth, enemyCurrentHealth }) => {
  const percentage = enemyHealth > 0 ? enemyCurrentHealth / enemyHealth : 0;
  const barWidth = `${Math.max(0, Math.min(100, percentage * 100))}%`;

  const HeartComponent = () => {
    if (enemyCurrentHealth <= 0) {
      return <BrokenHearthIcon width={font(28)} height={font(28)} overflow='hidden' />;
    } else if (percentage < 0.3) {
      return <HearthLowIcon width={font(28)} height={font(28)} overflow='hidden' />;
    } else if (percentage < 0.7) {
      return <HearthMediumIcon width={font(28)} height={font(28)} overflow='hidden' />;
    } else {
      return <HearthIcon width={font(28)} height={font(28)} overflow='hidden' />;
    }
  };

  return (
    <View style={styles.container}>
      <HeartComponent />
      <View style={styles.barWrapper}>
        <Text style={styles.healthText}>{enemyCurrentHealth}</Text>
        <View style={styles.barBackground}>
          <View style={[styles.barFill, { width: barWidth as any }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: font(6),
  },
  barWrapper: {
    width: font(60),
    gap: font(2),
  },
  healthText: {
    alignSelf: 'flex-end',
    color: '#fff',
    fontSize: font(13),
    fontFamily: 'MedievalSharp',
    lineHeight: font(13),
  },
  barBackground: {
    width: '100%',
    height: font(8),
    backgroundColor: '#4a0a0a',
    borderRadius: font(4),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#7a1a1a',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#cc1a1a',
    borderRadius: font(4),
  },
});

export default EnemyHealthBar;
