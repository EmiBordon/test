// BattleScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaiaIcon, MattIcon, MaiaHeadIcon, HearthIcon, BrokenHearthIcon } from '../components/SvgExporter';
import ShakyMattIcon, { ShakyMattIconRef } from '../components/characters/shakymatticon';
import { useSelector } from 'react-redux';
import DrawBar from '../components/functions/drawbar'; // Componente de ataque
import RandomSequenceGrid from '../components/functions/sequencegrid'; // Componente de defensa
import ShakyMaiaHeadIcon, { ShakyMaiaHeadIconRef } from './characters/shakymaiaheadicon';

const BattleScreen: React.FC = () => {
  // Salud de Maia desde Redux
  const maiaHealth = useSelector((state: any) => state.maia.maiahealth);
  const [maiaCurrentHealth, setMaiaCurrentHealth] = useState(maiaHealth);
  // Salud de Matt (local)
  const [mattCurrentHealth, setMattCurrentHealth] = useState(10);
  const [mattMaxHealth, setMattMaxHealth] = useState(10);

  // Estados para overlays y botones
  const [showDrawBar, setShowDrawBar] = useState(false);
  const [showRandomSequence, setShowRandomSequence] = useState(false);
  const [showAttackButton, setShowAttackButton] = useState(true);
  const [showDefenderButton, setShowDefenderButton] = useState(false);
  // Estado para efecto de daño en Matt
  const [showDamagedMatt, setShowDamagedMatt] = useState(false);
  // Estado para efecto shaky en Maia
  const [showDamagedMaia, setShowDamagedMaia] = useState(false);
  // Estados para mostrar el icono de vida roto temporalmente
  const [showBrokenHearthMatt, setShowBrokenHearthMatt] = useState(false);
  const [showBrokenHearthMaia, setShowBrokenHearthMaia] = useState(false);

  // Ref para el componente ShakyMattIcon
  const mattIconRef = useRef<ShakyMattIconRef>(null);
  // Ref para el componente ShakyMaiaHeadIcon
  const maiaHeadIconRef = useRef<ShakyMaiaHeadIconRef>(null);

  // Actualiza la salud de Maia si cambia en Redux
  useEffect(() => {
    setMaiaCurrentHealth(maiaHealth);
  }, [maiaHealth]);

  // Efecto de daño para Matt
  useEffect(() => {
    if (showDamagedMatt) {
      setTimeout(() => {
        mattIconRef.current?.triggerShake();
      }, 100);
      setTimeout(() => {
        setShowDamagedMatt(false);
      }, 1000);
    }
  }, [showDamagedMatt]);

  // Efecto de daño para Maia (shake)
  useEffect(() => {
    if (showDamagedMaia) {
      setTimeout(() => {
        maiaHeadIconRef.current?.triggerShake();
      }, 100);
      setTimeout(() => {
        setShowDamagedMaia(false);
      }, 1000);
    }
  }, [showDamagedMaia]);

  // Callback para el mini-juego de ATACAR (DrawBar)
  const handleAttackResult = (result: boolean) => {
    setShowDrawBar(false);
    setShowDefenderButton(true);
    if (result) {
      setMattCurrentHealth(prev => prev - 1);
      setShowDamagedMatt(true);
      setShowBrokenHearthMatt(true);
      setTimeout(() => setShowBrokenHearthMatt(false), 1000);
    }
  };

  // Callback para el mini-juego de DEFENDER (RandomSequenceGrid)
  const handleDefenseResult = (result: boolean) => {
    setShowRandomSequence(false);
    setShowAttackButton(true);
    if (!result) {
      setMaiaCurrentHealth(prev => prev - 1);
      setShowBrokenHearthMaia(true);
      setShowDamagedMaia(true);
      setTimeout(() => setShowBrokenHearthMaia(false), 1000);
    }
  };

  // Al presionar ATACAR se ocultan los botones y se muestra DrawBar
  const handleAttackPress = () => {
    setShowAttackButton(false);
    setShowDefenderButton(false);
    setShowDrawBar(true);
  };

  // Al presionar DEFENDER se oculta el botón y se muestra RandomSequenceGrid
  const handleDefensePress = () => {
    setShowDefenderButton(false);
    setShowRandomSequence(true);
  };

  return (
    <View style={styles.container}>
      {/* Parte superior: Matt */}
      <View style={styles.topContainer}>
        <View style={styles.healthContainer}>
          {showBrokenHearthMatt ? (
            <BrokenHearthIcon height={20} width={20} />
          ) : (
            <HearthIcon height={20} width={20} />
          )}
          <Text style={styles.healthText}>
            {mattCurrentHealth}/{mattMaxHealth}
          </Text>
        </View>
        {showDamagedMatt ? (
          <ShakyMattIcon ref={mattIconRef} height={220} width={220} />
        ) : (
          <MattIcon height={220} width={220} />
        )}
      </View>

      {/* Botón de defender en la esquina inferior izquierda, si aplica */}
      {showDefenderButton && (
        <Pressable style={styles.actionButton} onPress={handleDefensePress}>
          <Text style={styles.actionButtonText}>DEFENDER</Text>
        </Pressable>
      )}

      {/* Botón de atacar en la esquina inferior izquierda */}
      {showAttackButton && (
        <Pressable style={styles.actionButton} onPress={handleAttackPress}>
          <Text style={styles.actionButtonText}>ATACAR</Text>
        </Pressable>
      )}

      {/* Contenedor de Maia en la esquina inferior derecha */}
      <View style={styles.maiaContainer}>
        <View style={styles.healthContainer}>
          {showBrokenHearthMaia ? (
            <BrokenHearthIcon height={20} width={20} />
          ) : (
            <HearthIcon height={20} width={20} />
          )}
          <Text style={styles.healthText}>
            {maiaCurrentHealth}/{maiaHealth}
          </Text>
        </View>
        <View style={styles.maiaIconBox}>
          {showDamagedMaia ? (
            <ShakyMaiaHeadIcon ref={maiaHeadIconRef} height={100} width={100} />
          ) : (
            <MaiaHeadIcon height={100} width={100} />
          )}
        </View>
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
  },
  topContainer: {
    alignItems: 'center',
    marginTop: "10%",
  },
  actionButton: {
    position: 'absolute',
    bottom: "5%",
    left: "5%",
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  maiaContainer: {
    position: 'absolute',
    bottom: "5%",
    right: "5%",
    alignItems: 'center',
  },
  maiaIconBox: {
    width: "110%",
    height: "90%",
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    borderColor: 'black',
    borderWidth: 3,
  },
  healthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  healthText: {
    fontSize: 20,
    marginLeft: 5,
  },
  overlay: {
    position: 'absolute',
    top: "0%",
    left: "0%",
    right: "0%",
    bottom: "0%",
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BattleScreen;
