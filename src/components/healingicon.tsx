import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { GrapesIcon, HealthPotionIcon, BigHealthPotionIcon } from '../components/SvgExporter';

interface HealingIconProps {
  iconType: 'G' | 'H' | 'B';
  value: number;
  onSelect?: (iconType: 'G' | 'H' | 'B') => void;
}

const HealingIcon: React.FC<HealingIconProps> = ({ iconType, value, onSelect }) => {
  const [showInfo, setShowInfo] = useState(false);

  let IconComponent: React.FC<{ width: string; height: string; fill?: string }>;
  let iconValue: number = value;
  

  switch (iconType) {
    case 'G':
      IconComponent = GrapesIcon;
      break;
    case 'H':
      IconComponent = HealthPotionIcon;
      break;
    case 'B':
      IconComponent = BigHealthPotionIcon;
      break;
    default:
      IconComponent = () => null;
      iconValue = 0;
  }

  const fillColor = iconValue === 0 ? 'gray' : 'black';

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.touchable}
        onPress={() => {
          setShowInfo(!showInfo);
          if (onSelect) onSelect(iconType);
        }}
      >
        <IconComponent width="300%" height="300%" fill={fillColor} />
      </TouchableOpacity>
    </View>
  );
};

export default HealingIcon;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20%',
    aspectRatio: 1,
  },
});
