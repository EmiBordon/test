import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { GrapesIcon, HealthPotionIcon, BigHealthPotionIcon } from '../components/SvgExporter';

// Definir el tipo del estado de Redux
interface RootState {
  healing: {
    grapes: number;
    healthpotion: number;
    bighealthpotion: number;
  };
}

// Propiedades del componente, agregando onSelect
interface HealingIconProps {
  iconType: 'G' | 'H' | 'B';
  onSelect?: (iconType: 'G' | 'H' | 'B') => void;
}

const HealingIcon: React.FC<HealingIconProps> = ({ iconType, onSelect }) => {
  const [showInfo, setShowInfo] = useState(false);
  const healingState = useSelector((state: RootState) => state.healing);

  let IconComponent: React.FC<{ width: string; height: string; fill?: string }>;
  let iconValue: number;
  let infoLabel: string;

  switch (iconType) {
    case 'G':
      IconComponent = GrapesIcon;
      iconValue = healingState.grapes;
      infoLabel = 'Uvas';
      break;
    case 'H':
      IconComponent = HealthPotionIcon;
      iconValue = healingState.healthpotion;
      infoLabel = 'Frasco de Salud';
      break;
    case 'B':
      IconComponent = BigHealthPotionIcon;
      iconValue = healingState.bighealthpotion;
      infoLabel = 'Gran Frasco de Salud';
      break;
    default:
      IconComponent = () => null;
      iconValue = 0;
      infoLabel = 'Valor de curación';
  }

  // Cambiar el fill según el valor
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

      {showInfo && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>{infoLabel}</Text>
          <Text style={styles.infoText}>{iconValue}</Text>
        </View>
      )}
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
  infoContainer: {
    position: 'absolute',
    bottom: '300%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: '3%',
    borderRadius: 5,
    alignItems: 'center',
  },
  infoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
