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
  0: { name: "Sword", damage: 1, icon: <SwordIcon width={50} height={50} /> },
  1: { name: "Double Sword", damage: 2, icon: <DoubleSwordIcon width={50} height={50} /> },
  2: { name: "Pirate Sword", damage: 3, icon: <PirateSwordIcon width={50} height={50} /> },
  3: { name: "Daggers", damage: 4, icon: <DaggersIcon width={50} height={50} /> },
  4: { name: "Super Sword", damage: 5, icon: <SuperSwordIcon width={50} height={50} /> },
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
    top: '-90%', // Mueve la vista flotante arriba del icono
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
