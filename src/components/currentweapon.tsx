import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SwordIcon, DoubleSwordIcon, PirateSwordIcon, DaggersIcon, SuperSwordIcon } from '../components/SvgExporter';

// Definir el tipo para las armas
type WeaponType = {
  name: string;
  damage: number;
  icon: JSX.Element;
};

// Mapeo de armas con tipo seguro
const weaponData: Record<number, WeaponType> = {
  0: { name: "Dagas", damage: 15, icon: <DaggersIcon width={50} height={50} /> },
  1: { name: "Espada de madera", damage: 30, icon: <SwordIcon width={50} height={50} /> },
};

export const rollWeaponDamage = (weaponIndex: number): number => {
  if (weaponIndex === 0) {
    return Math.random() < 0.9 ? 15 : 23;
  }
  if (weaponIndex === 1) {
    return Math.random() < 0.7 ? 30 : 47;
  }
  return 1;
};

const CurrentWeaponIcon = () => {
  const [showInfo, setShowInfo] = useState(false);

  // Obtener el estado de currentWeapon y tiparlo como number
  const currentWeapon: number = useSelector((state: any) => state.weapons.currentWeapon);

  // Obtener el arma actual, asegurando que haya un valor por defecto
  const weapon: WeaponType = weaponData[currentWeapon] ?? weaponData[0];

  return (
    <View style={styles.container}>
      {/* Botón táctil para mostrar el arma */}
      <TouchableOpacity onPress={() => setShowInfo(!showInfo)} style={styles.touchable}>
        {weapon.icon}
      </TouchableOpacity>

      {/* Mostrar información flotante si está activo */}
      {showInfo && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>{weapon.name}</Text>
          <Text style={styles.infoText}>Daño: {weapon.damage}</Text>
        </View>
      )}
    </View>
  );
};

export default CurrentWeaponIcon;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  touchable: {
    padding: 10,
  },
  infoContainer: {
    position: 'absolute',
    bottom: '115%', // Mueve la vista flotante arriba del icono
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  infoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
