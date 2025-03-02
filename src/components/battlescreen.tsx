// BattleScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaiaIcon, MattIcon } from '../components/SvgExporter';
import { useSelector } from 'react-redux';
import DrawBar from '../components/functions/drawbar'; // Ruta al componente de ataque
import RandomSequenceGrid from '../components/functions/secuencegrid'; // Ruta al componente de defensa

const BattleScreen: React.FC = () => {
  // Obtenemos el tope de salud de Maia desde Redux
  const maiaHealth = useSelector((state: any) => state.maia.maiahealth);
  // La salud actual de Maia se maneja localmente (inicialmente igual al tope)
  const [maiaCurrentHealth, setMaiaCurrentHealth] = useState(maiaHealth);

  // Salud de Matt (local)
  const [mattCurrentHealth, setMattCurrentHealth] = useState(10);
  const [mattMaxHealth, setMattMaxHealth] = useState(10);

  // Estados para mostrar los overlays y controlar la visibilidad de botones
  const [showDrawBar, setShowDrawBar] = useState(false);
  const [showRandomSequence, setShowRandomSequence] = useState(false);
  const [showAttackButton, setShowAttackButton] = useState(true);
  const [showDefenderButton, setShowDefenderButton] = useState(false);

  // Actualizamos la salud actual de Maia si el tope cambia en Redux
  useEffect(() => {
    setMaiaCurrentHealth(maiaHealth);
  }, [maiaHealth]);

  // Callback para el mini-juego de ATACAR (DrawBar)
  const handleAttackResult = (result: boolean) => {
    setShowDrawBar(false);
    // Tras el ataque, mostramos el botón DEFENDER
    setShowDefenderButton(true);
    if (result) {
      // Si el ataque es exitoso, Matt pierde 1 de salud
      setMattCurrentHealth(prev => prev - 1);
    }
  };

  // Callback para el mini-juego de DEFENDER (RandomSequenceGrid)
  const handleDefenseResult = (result: boolean) => {
    setShowRandomSequence(false);
    // Tras defender, volvemos a mostrar el botón ATACAR
    setShowAttackButton(true);
    if (!result) {
      // Si la defensa falla, Maia pierde 1 de salud
      setMaiaCurrentHealth(prev => prev - 1);
    }
  };

  // Al presionar ATACAR: se oculta el botón y se muestra DrawBar
  const handleAttackPress = () => {
    setShowAttackButton(false);
    setShowDefenderButton(false);
    setShowDrawBar(true);
  };

  // Al presionar DEFENDER: se oculta el botón y se muestra RandomSequenceGrid
  const handleDefensePress = () => {
    setShowDefenderButton(false);
    setShowRandomSequence(true);
  };

  return (
    <View style={styles.container}>
      {/* Parte superior: Matt */}
      <View style={styles.topContainer}>
        <MattIcon height={150} width={150} />
        <Text style={styles.healthText}>
          {mattCurrentHealth}/{mattMaxHealth}
        </Text>
      </View>

      {/* Parte inferior: Maia */}
      <View style={styles.bottomContainer}>
        {showAttackButton && (
          <Pressable style={styles.attackButton} onPress={handleAttackPress}>
            <Text style={styles.attackButtonText}>ATACAR</Text>
          </Pressable>
        )}
        {showDefenderButton && (
          <Pressable style={styles.defenderButton} onPress={handleDefensePress}>
            <Text style={styles.defenderButtonText}>DEFENDER</Text>
          </Pressable>
        )}
        <MaiaIcon height={150} width={150} />
        <Text style={styles.healthText}>
          {maiaCurrentHealth}/{maiaHealth}
        </Text>
      </View>

      {/* Overlay para DrawBar (ataque) */}
      {showDrawBar && (
        <View style={styles.overlay}>
          <DrawBar levels={2} duration={2000} onResult={handleAttackResult} />
        </View>
      )}

      {/* Overlay para RandomSequenceGrid (defensa) */}
      {showRandomSequence && (
        <View style={styles.overlay}>
          <RandomSequenceGrid sequenceLength={3} onResult={handleDefenseResult} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: "5%",
  },
  topContainer: {
    alignItems: 'center',
    marginTop: "10%",
  },
  bottomContainer: {
    alignItems: 'center',
    marginBottom: "10%",
  },
  healthText: {
    fontSize: 20,
    marginTop: "2%",
  },
  attackButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginBottom: "2%",
  },
  attackButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  defenderButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginBottom: "2%",
  },
  defenderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: "0%",
    left: "0%",
    right: "0%",
    bottom: "0%",
    backgroundColor: 'rgba(0, 0, 0, 0)', // Fondo transparente
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BattleScreen;
