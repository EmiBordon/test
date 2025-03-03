import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { QuiverArrowIcon } from '../components/SvgExporter';

// Definir el tipo del estado de Redux
interface RootState {
  weapons: {
    arrows: number;
  };
}

const QuiverIcon: React.FC = () => {
  // Estado de Redux para las flechas
  const arrows = useSelector((state: RootState) => state.weapons.arrows);

  // Estado local para mostrar/ocultar la información
  const [showInfo, setShowInfo] = useState(false);

  return (
    <View style={styles.container}>
      {/* Ícono del carcaj (Touchable) */}
      <TouchableOpacity 
        style={styles.touchable}
        onPress={() => setShowInfo(!showInfo)}
      >
        <QuiverArrowIcon width="300%" height="300%" />
      </TouchableOpacity>

      {/* Mostrar información flotante si está activo */}
      {showInfo && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Flechas</Text>
          <Text style={styles.infoText}>{arrows}</Text>
        </View>
      )}
    </View>
  );
};

export default QuiverIcon;

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
    top: '-400%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: '3%',
    borderRadius: 5,
    alignItems: 'center',
  },
  infoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
