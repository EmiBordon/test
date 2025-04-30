import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { 
  MaiaHeadIcon, HearthIcon, BrokenHearthIcon, MoonIcon, TearIcon, 
  GarbageIcon, ShieldIcon, WhiteSwordIcon,BowIcon, CrossBowIcon, DevilHearthIcon, DevilHalfHearthIcon,
  DevilBrokenHearthIcon, HalfHearthIcon
} from '../SvgExporter';
import ShakyIcon, {ShakyIconRef} from '../characters/shakymatticon';
import { useSelector, useDispatch } from 'react-redux';
import DrawBar from '../functions/drawbar';
import RandomSequenceGrid from '../functions/sequencegrid';
import ShakyMaiaHeadIcon, { ShakyMaiaHeadIconRef } from '../characters/shakymaiaheadicon';
import ShootingCircle from '../functions/shootingcircle';
import MoonTear from '../functions/moontear';
import { decrementMaiaCurrentHealth} from '../../redux/maiaSlice';
import { decrementArrows } from '../../redux/weaponsSlice';
import HealingModal from '../modal/healingmodal';
import { restoreBackup } from '../../redux/backupSlice';
import { setMaiaState } from '../../redux/maiaSlice';
import { setHealingState } from '../../redux/healingSlice';
import { setWeaponsState } from '../../redux/weaponsSlice';
import { useNavigation,useFocusEffect, useRoute, RouteProp, } from '@react-navigation/native';
import { font } from '../functions/fontsize';
import { enemies } from './enemyData';
import { getCurrentPhase } from './enemyLogic';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import HealthBar from '../healthbar';

const BattleScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'BattleScreen'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  const maiaHealth = useSelector((state: any) => state.maia.maiahealth);
  const maiaCurrentHealth = useSelector((state: any) => state.maia.maiacurrenthealth);
  const arrows = useSelector((state: any) => state.weapons.arrows);
  const backup = useSelector((state: any) => state.backup);
  const weapon = useSelector((state: any) => state.weapons.currentWeapon);

  const weaponDamageMap: { [key: number]: number } = {
    0: 1,
    1: 3,
    2: 5,
    3: 7,
    4: 10,
  };
  
  const damage = weaponDamageMap[weapon] ?? 0;
  const { enemyName } = route.params as { enemyName: string };
  const currentEnemy = enemies.find(e => e.name === enemyName) || enemies[0];
  const [enemyCurrentHealth, setEnemyCurrentHealth] = useState(currentEnemy.health);
  const [showInfoButton, setShowInfoButton] = useState(true);
  const [showEnemyInfo, setShowEnemyInfo] = useState(false);
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

  // Estado para controlar la pantalla de victoria con retraso
  const [showVictory, setShowVictory] = useState(false);
  const [showDefeat, setShowDefeat] = useState(false);

  // Refs para animaciones
  const enemyIconRef = useRef<ShakyIconRef>(null);
  const maiaHeadIconRef = useRef<ShakyMaiaHeadIconRef>(null);
  const currentPhase = getCurrentPhase(currentEnemy, enemyCurrentHealth);
 // Bloquear botón "back" físico
 useFocusEffect(
  React.useCallback(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    
    return () => backHandler.remove();
  }, [])
);

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

  // useEffect para activar el retraso antes de mostrar la pantalla de victoria
  useEffect(() => {
    if (enemyCurrentHealth <= 0) {
      const timer = setTimeout(() => {
        setShowVictory(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [enemyCurrentHealth]);

  useEffect(() => {
    if (maiaCurrentHealth <= 0) {
      const timer = setTimeout(() => {
        setShowDefeat(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [maiaCurrentHealth]);

  const handleAttackResult = (result: boolean) => {
    setShowDrawBar(false);
    if (result) {
      setEnemyCurrentHealth(prev => Math.max(0, prev - damage));
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
      dispatch(decrementMaiaCurrentHealth(currentPhase.damage));
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
    if(showEnemyInfo || showInfoButton){
    setShowInfoButton(false);
    setShowEnemyInfo(false);
    }
  };

  const handleCounterPress = () => {
    if (arrows >= currentEnemy.arrowsRequired) {
      setShowAttackButton(false);
      setShowDefenderButton(false);
      setShowShootingCircle(true);
      dispatch(decrementArrows(currentEnemy.arrowsRequired));
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
  const handleInfoPress = () => {
    setShowInfoButton(false);
    setShowEnemyInfo(true);
  };

  // Al presionar el botón OBJETO se abre el HealingModal
  const handleObjetoPress = () => {
    setShowHealingModal(true);
  };

  // Si se cumplió el retraso y el enemigo está derrotado, mostramos la pantalla de victoria
  if (enemyCurrentHealth <= 0 && showVictory) {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
        <View style={styles.healthContainer}>
            <BrokenHearthIcon height={font(20)} width={font(20)} />
          </View>
          <View style={styles.enemyContainer}>
            <currentPhase.icon height={font(198)} width={font(198)} />
          </View>
          
        </View>
        <View style={styles.winMessageContainer}>
          <Text style={styles.winMessage}>{currentEnemy.victoryMessage}</Text>
        </View>
        <TouchableOpacity 
          style={styles.advanceButton} 
          onPress={() => {
            navigation.goBack();
            currentEnemy.onDefeatCallbacks?.forEach(cb => {
              if (cb.type === 'dispatch') {
                dispatch(cb.action());
              } else if (cb.type === 'function') {
                cb.fn();
              }
            });
          }}
        >
          <Text style={styles.advanceButtonText}>Avanzar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (maiaCurrentHealth <= 0 && showDefeat) {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
        <View style={styles.healthContainer}>
            <HearthIcon height={font(20)} width={font(20)} />
          </View>
          <View style={styles.enemyContainer}>
            <currentPhase.icon height={font(198)} width={font(198)} />
          </View>
          
        </View>
        <View style={styles.winMessageContainer}>
          <Text style={styles.winMessage}>{currentEnemy.defeatMessage}</Text>
        </View>
        <TouchableOpacity 
          style={styles.advanceButton} 
          onPress={() => {
                    if (backup.healing && backup.maia && backup.weapons) {
                      dispatch(setHealingState(backup.healing));
                      dispatch(setMaiaState(backup.maia));
                      dispatch(setWeaponsState(backup.weapons));
                      navigation.goBack();
                    }
                    dispatch(restoreBackup());
                  }}
        >
          <Text style={styles.advanceButtonText}>Salir</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.damageContainer}>
          {showBrokenHearthEnemy ? (
            <BrokenHearthIcon height={font(20)} width={font(20)} />
          ) : (
            <HearthIcon height={font(20)} width={font(20)} />
          )}
          <Text style={styles.healthText}>
            {enemyCurrentHealth}/{currentEnemy.health} 
          </Text>
          <Text style={styles.damageText}>
            Daño: {currentPhase.damage}
          </Text>
        </View>
        <View style={styles.enemyContainer}>
          {showDamagedEnemy ? (
            <ShakyIcon ref={enemyIconRef} Icon={currentPhase.icon} height={font(198)} width={font(198)} />
          ) : (
            <currentPhase.icon height={font(198)} width={font(198)} />
          )}
        </View>
        {showInfoButton && (
        <TouchableOpacity style={styles.infoButton} onPress={handleInfoPress}>
            <View style={styles.buttonContent}>
              <Text style={styles.infoButtonText}>INFO</Text>
            </View>
          </TouchableOpacity>)}
      </View>
      {showEnemyInfo && (
        <View style={styles.enemyInfoContainer}>
          <View style={styles.enemyInfoTextContainer}>
          <Text style={styles.enemyInfoText}>
            Nombre: {currentEnemy.name}
          </Text>
          <Text style={styles.enemyInfoText}>
            Daño: {currentEnemy.initialdamage}
          </Text>
          <Text style={styles.enemyInfoText}>
            Defensa: {currentEnemy.arrowsRequired} {currentEnemy.arrowsRequired === 1 ? 'Flecha' : 'Flechas'} para contraatacar.
          </Text>
          <View style={ {height: '5%'} }></View>
          <Text style={styles.enemyInfoText}>
            {currentEnemy.description}
          </Text>
          </View>
        </View>
      )}
      
      {/* Botones de acción en la esquina inferior izquierda */}
      {showAttackButton && (
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleAttackPress}>
            <View style={styles.buttonContent}>
              <WhiteSwordIcon width={font(24)} height={font(24)} />
              <Text style={styles.actionButtonText}>ATAQUE</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { marginLeft: 9 }]} onPress={handleObjetoPress}>
            <View style={styles.buttonContent}>
              <GarbageIcon width={font(24)} height={font(24)} />
              <Text style={styles.actionButtonText}>OBJETO</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {showDefenderButton && (
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleDefensePress}>
            <View style={styles.buttonContent}>
              <ShieldIcon width={font(24)} height={font(24)} />
              <Text style={styles.actionButtonText}>DEFENSA</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { marginLeft: 9 }]} onPress={handleCounterPress}>
            <View style={styles.buttonContent}>
              <BowIcon width={font(24)} height={font(24)} fill="white" />
              <Text style={styles.actionButtonText}>ARCO({arrows})</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Contenedor de Maia en la esquina inferior derecha */}
      <View style={styles.maiaContainer}>
        <View style={styles.healthContainer}>
          <HealthBar/>
        </View>
        <View style={styles.maiaIconBox}>
          {showDamagedMaia ? (
            <ShakyMaiaHeadIcon ref={maiaHeadIconRef} height={font(99)} width={font(99)} />
          ) : (
            <MaiaHeadIcon height={font(99)} width={font(99)} />
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
            levels={currentPhase.drawBarLevels}
            duration={currentPhase.drawBarDuration}
            onResult={handleAttackResult} 
          />
        </View>
      )}

      {showMoonTear && (
        <View style={styles.overlay}>
          <MoonTear 
            moonIcon={MoonIcon} 
            tearIcon={TearIcon} 
            difficulty={currentPhase.moonTearDifficulty} 
            patternLength={currentPhase.moonTearPattern} 
            onResult={handleDefenseResult} 
          />
        </View>
      )}
      {showRandomSequence && (
        <View style={styles.overlay}>
          <RandomSequenceGrid
            sequenceLength={currentPhase.gridLength} 
            onResult={handleDefenseResult}
            delay={currentPhase.gridDelay} 
          />
        </View>
      )}

      {/* HealingModal se muestra al presionar OBJETO */}
      <HealingModal 
        visible={showHealingModal} 
        onClose={() => setShowHealingModal(false)} 
        onHealingUsed={(used) => {
          if (used) {
            if(showEnemyInfo || showInfoButton){
              setShowInfoButton(false);
              setShowEnemyInfo(false);
              }
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
  
  healthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: "2%",
  },
  healthText: {
    fontSize: font(19),
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
    fontSize: font(15.5),
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
  winMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  winMessage: {
    fontSize: font(23),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '1%',
  },
  advanceButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: '15%',
  },
  advanceButtonText: {
    color: 'white',
    fontSize: font(18),
  },
  enemyInfoContainer:{
    alignItems: 'center',
    width: "100%",
    height: "40%",
    justifyContent: 'center',
  },
  enemyInfoTextContainer:{
    paddingVertical: '4%',
    justifyContent: 'center',
    paddingHorizontal: '1%',
    width: "95%",
    borderWidth: 3,
  },
  enemyInfoText:{
    fontSize: font(20),
    fontWeight: 'bold',
  },
  infoButton: {
    backgroundColor: 'black',
    padding: "2%",
    borderRadius: 5,
    
  },
  infoButtonText: {
    color: 'white',
    fontSize: font(14),
    fontWeight: 'bold',
  },
  damageContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: "2%",
    left:'8%',
  },
  damageText:{
    fontSize: font(20),
    fontWeight: 'bold',
    left:'10%',
  },
});

export default BattleScreen;
