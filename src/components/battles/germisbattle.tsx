import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { 
  MattIcon, MaiaHeadIcon, HearthIcon, BrokenHearthIcon, MoonIcon, TearIcon, 
  GarbageIcon, ShieldIcon, WhiteSwordIcon, TextBubbleRightIcon, BowIcon, CrossBowIcon, QuiverArrowIcon 
} from '../SvgExporter';
import ShakyMattIcon, { ShakyMattIconRef } from '../characters/shakymatticon';
import { useSelector, useDispatch } from 'react-redux';
import DrawBar from '../functions/drawbar';
import RandomSequenceGrid from '../functions/sequencegrid';
import ShakyMaiaHeadIcon, { ShakyMaiaHeadIconRef } from '../characters/shakymaiaheadicon';
import ShootingCircle from '../functions/shootingcircle';
import MoonTear from '../functions/moontear';
import { decrementMaiaCurrentHealth, incrementMaiaCurrentHealth } from '../../redux/maiaSlice';
import { decrementArrows } from '../../redux/weaponsSlice';
import HealingModal from '../modal/healingmodal';

const BattleScreen: React.FC = () => {
  const dispatch = useDispatch();
  const maiaHealth = useSelector((state: any) => state.maia.maiahealth);
  const maiaCurrentHealth = useSelector((state: any) => state.maia.maiacurrenthealth);
  const arrows = useSelector((state: any) => state.weapons.arrows);

  const [enemyCurrentHealth, setEnemyCurrentHealth] = useState(10);
  const [enemyMaxHealth, setEnemyMaxHealth] = useState(10);

  const [showDrawBar, setShowDrawBar] = useState(false);
  const [showShootingCircle, setShowShootingCircle] = useState(false);
  const [showRandomSequence, setShowRandomSequence] = useState(false);
  const [showMoonTear, setShowMoonTear] = useState(false);
  const [showAttackButton, setShowAttackButton] = useState(true);
  const [showDefenderButton, setShowDefenderButton] = useState(false);
  const [showDamagedEnemy, setShowDamagedEnemy] = useState(false);
  const [showDamagedMaia, setShowDamagedMaia] = useState(false);
  const [showBrokenHearthEnemy, setShowBrokenHearthEnemy] = useState(false);
  const [showBrokenHearthMaia, setShowBrokenHearthMaia] = useState(false);

  // Estado para controlar la visibilidad del HealingModal
  const [showHealingModal, setShowHealingModal] = useState(false);

  // Refs para animaciones
  const enemyIconRef = useRef<ShakyMattIconRef>(null);
  const maiaHeadIconRef = useRef<ShakyMaiaHeadIconRef>(null);

  useEffect(() => {
    if (showDamagedEnemy) {
      // Deshabilitamos los botones al iniciar la animación
      setShowAttackButton(false);
      setShowDefenderButton(false);
      setTimeout(() => {
        enemyIconRef.current?.triggerShake();
      }, 100);
      setTimeout(() => {
        setShowDamagedEnemy(false);
      }, 1000);
    }
  }, [showDamagedEnemy]);

  useEffect(() => {
    if (showDamagedMaia) {
      // Deshabilitamos los botones al iniciar la animación
      setShowAttackButton(false);
      setShowDefenderButton(false);
      setTimeout(() => {
        maiaHeadIconRef.current?.triggerShake();
      }, 100);
      setTimeout(() => {
        setShowDamagedMaia(false);
      }, 1000);
    }
  }, [showDamagedMaia]);

  const handleAttackResult = (result: boolean) => {
    setShowDrawBar(false);
    if (result) {
      setEnemyCurrentHealth(prev => prev - 1);
      setShowDamagedEnemy(true);
      setShowBrokenHearthEnemy(true);
      setTimeout(() => setShowBrokenHearthEnemy(false), 1000);
      setTimeout(() => setShowDefenderButton(true), 1100);
    } else {
      setShowDefenderButton(true);
    }
  };

  const handleCounterResult = (result: boolean) => {
    setShowShootingCircle(false);
    if (result) {
      setShowDamagedEnemy(true);
      setTimeout(() => setShowAttackButton(true), 1100);
      setShowDefenderButton(false);
    } else {
      setShowDefenderButton(true);
      setShowAttackButton(false);
    }
  };

  const handleDefenseResult = (result: boolean) => {
    if (enemyCurrentHealth % 2 === 0) {
      setShowRandomSequence(false);
    } else {
      setShowMoonTear(false);
    }
    if (!result) {
      dispatch(decrementMaiaCurrentHealth(1));
      setShowBrokenHearthMaia(true);
      setShowDamagedMaia(true);
      setTimeout(() => setShowBrokenHearthMaia(false), 1000);
      setTimeout(() => setShowAttackButton(true), 1100);
    } else {
      setShowAttackButton(true);
    }
  };

  const handleAttackPress = () => {
    setShowAttackButton(false);
    setShowDefenderButton(false);
    setShowDrawBar(true);
  };

  const handleCounterPress = () => {
    if (arrows >= 3) {
      setShowAttackButton(false);
      setShowDefenderButton(false);
      setShowShootingCircle(true);
      dispatch(decrementArrows(3));
    } 
  };

  const handleDefensePress = () => {
    if (enemyCurrentHealth % 2 === 0) {
      setShowDefenderButton(false);
      setShowRandomSequence(true);
    } else {
      setShowDefenderButton(false);
      setShowMoonTear(true);
    }
  };

  // Al presionar el botón OBJETO se abre el HealingModal
  const handleObjetoPress = () => {
    setShowHealingModal(true);
  };

  return (
    <View style={styles.container}>
      {/* Parte superior: salud, diálogo y enemy */}
      <View style={styles.topContainer}>
        <View style={styles.healthContainer}>
          {showBrokenHearthEnemy ? (
            <BrokenHearthIcon height={20} width={20} />
          ) : (
            <HearthIcon height={20} width={20} />
          )}
          <Text style={styles.healthText}>
            {enemyCurrentHealth}/{enemyMaxHealth}
          </Text>
        </View>
        <View style={styles.enemyContainer}>
          {showDamagedEnemy ? (
            <ShakyMattIcon ref={enemyIconRef} height={200} width={200} />
          ) : (
            <MattIcon height={200} width={200} />
          )}
        </View>
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
          <TouchableOpacity style={[styles.actionButton, { marginLeft: 9 }]} onPress={handleObjetoPress}>
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
          <TouchableOpacity style={[styles.actionButton, { marginLeft: 9 }]} onPress={handleCounterPress}>
            <View style={styles.buttonContent}>
              <BowIcon width={25} height={25} fill="white" />
              <Text style={styles.actionButtonText}>ARCO({arrows})</Text>
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

      {showShootingCircle && (
        <View style={styles.overlay}>
          <ShootingCircle 
            rotationDuration={1800} 
            shrinkDuration={8000} 
            minDiameter={150} 
            onResult={handleCounterResult} 
          />
        </View>
      )}

      {showDrawBar && (
        <View style={styles.overlay}>
          <DrawBar
            levels={3}
            duration={1500}
            onResult={handleAttackResult} 
          />
        </View>
      )}

      {showMoonTear && (
        <View style={styles.overlay}>
          <MoonTear 
            moonIcon={MoonIcon} 
            tearIcon={TearIcon} 
            difficulty={3} 
            patternLength={3} 
            onResult={handleDefenseResult} 
          />
        </View>
      )}
      {showRandomSequence && (
        <View style={styles.overlay}>
          <RandomSequenceGrid
            sequenceLength={3} 
            onResult={handleDefenseResult} 
          />
        </View>
      )}

      {/* HealingModal se muestra al presionar OBJETO */}
      <HealingModal 
        visible={showHealingModal} 
        onClose={() => setShowHealingModal(false)} 
        onHealingUsed={(used) => {
          if (used) {
            // Al usar curación se oculta el botón de ATAQUE y se muestran DEFENSA y ARCO
            setShowAttackButton(false);
            setShowDefenderButton(true);
          }
        }} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    alignItems: 'center',
    marginTop: "7%",
  },
  enemyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dialogueText: {
    position: 'absolute',
    textAlign: 'left',
    fontSize: 18,
    color: '#000',
    top: "15%",
  },
  healthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: "2%",
  },
  healthText: {
    fontSize: 20,
    marginLeft: "1%",
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: "5%",
    left: "2%",
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: 'black',
    padding: "4%",
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
    marginLeft: "2%",
  },
  maiaContainer: {
    position: 'absolute',
    bottom: "5%",
    right: "3%",
    alignItems: 'center',
  },
  maiaIconBox: {
    width: "110%",
    height: "90%",
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: "1%",
    borderColor: 'black',
    borderWidth: 3,
  },
  overlay: {
    position: 'absolute',
    top: "0%",
    left: "0%",
    right: "0%",
    bottom: "0%",
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BattleScreen;
