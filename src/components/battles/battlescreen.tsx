// BattleScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaiaIcon, MattIcon, MaiaHeadIcon, HearthIcon, BrokenHearthIcon, MoonIcon, TearIcon, GarbageIcon, ShieldIcon, WhiteSwordIcon } from '../SvgExporter';
import ShakyMattIcon, { ShakyMattIconRef } from '../characters/shakymatticon';
import { useSelector, useDispatch } from 'react-redux';
import DrawBar from '../functions/drawbar'; // Componente de ataque
import RandomSequenceGrid from '../functions/sequencegrid'; // Componente de defensa
import ShakyMaiaHeadIcon, { ShakyMaiaHeadIconRef } from '../characters/shakymaiaheadicon';
import ShootingCircle from '../functions/shootingcircle';
import MoonTear from '../functions/moontear';
import { decrementMaiaCurrentHealth, incrementMaiaCurrentHealth } from '../../redux/maiaSlice';

const BattleScreen: React.FC = () => {
  // Obtenemos la salud actual y la salud máxima de Maia desde Redux
  const dispatch = useDispatch();
  const maiaHealth = useSelector((state: any) => state.maia.maiahealth);
  const maiaCurrentHealth = useSelector((state: any) => state.maia.maiacurrenthealth);

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
      // Despachamos la acción para reducir la salud de Maia en Redux
      dispatch(decrementMaiaCurrentHealth(1));
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

      {/* Botones de acción en la esquina inferior izquierda */}
      {showAttackButton && (
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleAttackPress}>
            <View style={styles.buttonContent}>
              <WhiteSwordIcon width={25} height={25} />
              <Text style={styles.actionButtonText}>ATAQUE</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { marginLeft: 10 }]} onPress={() => {}}>
            <View style={styles.buttonContent}>
              <GarbageIcon width={25} height={25} />
              <Text style={styles.actionButtonText}>OBJETO</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {showDefenderButton && (
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleDefensePress}>
            <View style={styles.buttonContent}>
              <ShieldIcon width={25} height={25} />
              <Text style={styles.actionButtonText}>DEFENSA</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { marginLeft: 10 }]} onPress={() => {}}>
            <View style={styles.buttonContent}>
              <GarbageIcon width={25} height={25} />
              <Text style={styles.actionButtonText}>OBJETO</Text>
            </View>
          </TouchableOpacity>
        </View>
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
          <ShootingCircle rotationDuration={1800} shrinkDuration={8000} minDiameter={150} onResult={handleAttackResult} />
        </View>
      )}

      {/* Overlay para RandomSequenceGrid (defensa) */}
      {showRandomSequence && (
        <View style={styles.overlay}>
          <MoonTear moonIcon={MoonIcon} tearIcon={TearIcon} difficulty={4} patternLength={3} onResult={handleDefenseResult} />
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
  actionButtonsContainer: {
    position: 'absolute',
    bottom: "5%",
    left: "5%",
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 5,
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
