import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  SwordIcon,
  DaggersIcon,
  DoubleSwordIcon,
  PirateSwordIcon,
  SuperSwordIcon,
  BowIcon,
  ShieldIcon,
  ManaBookIcon,
  MoonIcon,
  TearIcon,
} from '../SvgExporter';

const WEAPON_ICONS: Record<number, React.ComponentType<any>> = {
  0: SwordIcon,
  1: DaggersIcon,
  2: DoubleSwordIcon,
  3: PirateSwordIcon,
  4: SuperSwordIcon,
};
import {
  decrementCharacterHealth,
  setCharacter,
  CharactersState,
  HealthKey,
} from '../../redux/charactersSlice';
import { decrementMaiaCurrentHealth } from '../../redux/maiaSlice';
import { decrementArrows } from '../../redux/weaponsSlice';
import EnemyHealthBar from '../enemyhealthbar';
import DrawBar from '../functions/drawbar';
import ShootingCircle from '../functions/shootingcircle';
import MoonTear from '../functions/moontear';
import RandomSequenceGrid from '../functions/sequencegrid';
import PlanillaGrid from '../planillagrid';
import { enemies } from './enemyData';
import { getCurrentPhase } from './enemyLogic';
import { font } from '../functions/fontsize';
import ShakyIcon, { ShakyIconRef } from '../characters/shakymatticon';

interface SimpleBattleProps {
  enemyName: string;
  enemyKey: keyof CharactersState;
  healthKey: HealthKey;
  Icon: React.ComponentType<any>;
  iconWidth: number;
  iconHeight: number;
  style?: object;
  onMaiaDamaged?: () => void;
}

const weaponDamageMap: Record<number, number> = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 10 };

const SimpleBattle: React.FC<SimpleBattleProps> = ({
  enemyName,
  enemyKey,
  healthKey,
  Icon,
  iconWidth,
  iconHeight,
  style,
  onMaiaDamaged,
}) => {
  const dispatch = useDispatch();
  const characterState      = useSelector((state: any) => state.characters[enemyKey]);
  const enemyCurrentHealth  = useSelector((state: any) => state.characters[healthKey]);
  const currentWeapon       = useSelector((state: any) => state.weapons.currentWeapon);
  const arrows              = useSelector((state: any) => state.weapons.arrows);

  const [showBattleUI,       setShowBattleUI]       = useState(false);
  const [showDrawBar,        setShowDrawBar]         = useState(false);
  const [showShootingCircle, setShowShootingCircle]  = useState(false);
  const [showMoonTear,       setShowMoonTear]        = useState(false);
  const [showSequenceGrid,   setShowSequenceGrid]    = useState(false);
  const [showPlanillaGrid,   setShowPlanillaGrid]    = useState(false);
  const [showDamagedEnemy, setShowDamagedEnemy] = useState(false);

  const enemyIconRef = useRef<ShakyIconRef>(null);

  useEffect(() => {
    if (showDamagedEnemy) {
      setTimeout(() => { enemyIconRef.current?.triggerShake(); }, 100);
      setTimeout(() => { setShowDamagedEnemy(false); }, 1000);
    }
  }, [showDamagedEnemy]);

  if (characterState === 2) return null;

  const currentEnemy = enemies.find(e => e.name === enemyName) ?? enemies[0];
  const currentPhase = getCurrentPhase(currentEnemy, enemyCurrentHealth);
  const damage = weaponDamageMap[currentWeapon] ?? 1;

  const killOrAdvance = (delta: number, nextState: number) => {
    const newHealth = Math.max(0, enemyCurrentHealth - delta);
    dispatch(decrementCharacterHealth({ key: healthKey, delta }));
    setShowDamagedEnemy(true);
    if (newHealth <= 0) {
      setShowBattleUI(false);
      setTimeout(() => {
        dispatch(setCharacter({ key: enemyKey, value: 2 }));
      }, 1000);
    } else {
      dispatch(setCharacter({ key: enemyKey, value: nextState }));
    }
  };

  const handleSwordResult = (result: boolean) => {
    setShowDrawBar(false);
    if (result) {
      killOrAdvance(damage, 1);
    } else {
      dispatch(setCharacter({ key: enemyKey, value: 1 }));
    }
  };

  const handleBowResult = (result: boolean) => {
    setShowShootingCircle(false);
    dispatch(decrementArrows(1));
    if (result) killOrAdvance(1, 0);
  };

  const handleShieldResult = (result: boolean) => {
    setShowMoonTear(false);
    setShowSequenceGrid(false);
    if (!result) {
      dispatch(decrementMaiaCurrentHealth(currentPhase.damage));
      onMaiaDamaged?.();
    }
    dispatch(setCharacter({ key: enemyKey, value: 0 }));
  };

  const handleShieldPress = () => {
    if (Math.random() < 0.5) setShowMoonTear(true);
    else setShowSequenceGrid(true);
  };

  return (
    <>
      <View style={[styles.wrapper, style, { width: iconWidth, height: iconHeight }]}>
        {/* HealthBar encima del ícono — absoluta, no afecta el layout */}
        {showBattleUI && (
          <View style={styles.healthBarAbove}>
            <EnemyHealthBar
              enemyHealth={currentEnemy.health}
              enemyCurrentHealth={enemyCurrentHealth}
            />
          </View>
        )}

        <TouchableOpacity onPress={() => setShowBattleUI(prev => !prev)}>
          {showDamagedEnemy
            ? <ShakyIcon ref={enemyIconRef} Icon={Icon} width={iconWidth} height={iconHeight} />
            : <Icon width={iconWidth} height={iconHeight} />
          }
        </TouchableOpacity>

        {/* Botones de acción — absolutos debajo del ícono */}
        {showBattleUI && (
          <View style={[styles.actionsRow, { top: iconHeight }]}>
            {characterState === 0 && (
              <>
                <TouchableOpacity style={styles.actionBtn} onPress={() => setShowDrawBar(true)}>
                  {React.createElement(WEAPON_ICONS[currentWeapon] ?? SwordIcon, { width: font(36), height: font(36) })}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, arrows === 0 && styles.actionBtnDisabled]}
                  onPress={() => setShowShootingCircle(true)}
                  disabled={arrows === 0}
                >
                  <BowIcon width={font(36)} height={font(36)} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => setShowPlanillaGrid(true)}>
                  <ManaBookIcon width={font(36)} height={font(36)} />
                </TouchableOpacity>
              </>
            )}
            {characterState === 1 && (
              <>
                <TouchableOpacity style={styles.actionBtn} onPress={handleShieldPress}>
                  <ShieldIcon width={font(36)} height={font(36)} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => setShowPlanillaGrid(true)}>
                  <ManaBookIcon width={font(36)} height={font(36)} />
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

      </View>

      {/* Mini-juegos en Modal para cubrir toda la pantalla */}
      <Modal visible={showDrawBar} transparent animationType="fade">
        <View style={styles.overlay}>
          <DrawBar
            levels={currentPhase.drawBarLevels}
            duration={currentPhase.drawBarDuration}
            onResult={handleSwordResult}
          />
        </View>
      </Modal>

      <Modal visible={showShootingCircle} transparent animationType="fade">
        <View style={styles.overlay}>
          <ShootingCircle
            rotationDuration={1800}
            shrinkDuration={8000}
            minDiameter={150}
            onResult={handleBowResult}
          />
        </View>
      </Modal>

      <Modal visible={showMoonTear} transparent animationType="fade">
        <View style={styles.overlay}>
          <MoonTear
            moonIcon={MoonIcon}
            tearIcon={TearIcon}
            difficulty={currentPhase.moonTearDifficulty}
            patternLength={currentPhase.moonTearPattern}
            onResult={handleShieldResult}
          />
        </View>
      </Modal>

      <Modal visible={showSequenceGrid} transparent animationType="fade">
        <View style={styles.overlay}>
          <RandomSequenceGrid
            sequenceLength={currentPhase.gridLength}
            onResult={handleShieldResult}
            delay={currentPhase.gridDelay}
          />
        </View>
      </Modal>

      <PlanillaGrid
        visible={showPlanillaGrid}
        onClose={() => setShowPlanillaGrid(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    alignItems: 'center',
  },
  healthBarAbove: {
    position: 'absolute',
    bottom: '100%',
    alignSelf: 'center',
  },
  actionsRow: {
    position: 'absolute',
    flexDirection: 'row',
    gap: font(8),
    paddingTop: font(6),
  },
  actionBtn: {
    backgroundColor: 'rgba(151, 151, 151, 0.57)',
    borderRadius: font(8),
    padding: font(6),
  },
  actionBtnDisabled: {
    opacity: 0.35,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.49)',
  },
});

export default SimpleBattle;
