// BattleScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { 
  GermisIcon,MattIcon, MaiaHeadIcon, HearthIcon, BrokenHearthIcon, MoonIcon, TearIcon, 
  GarbageIcon, ShieldIcon, WhiteSwordIcon, TextBubbleRightIcon, BowIcon, CrossBowIcon, QuiverArrowIcon 
} from '../SvgExporter';
import ShakyGermisIcon, {ShakyGermisIconRef} from '../characters/shakygermisicon';
import { useSelector, useDispatch } from 'react-redux';
import DrawBar from '../functions/drawbar';
import RandomSequenceGrid from '../functions/sequencegrid';
import ShakyMaiaHeadIcon, { ShakyMaiaHeadIconRef } from '../characters/shakymaiaheadicon';
import ShootingCircle from '../functions/shootingcircle';
import MoonTear from '../functions/moontear';
import { decrementMaiaCurrentHealth, incrementMaiaCurrentHealth } from '../../redux/maiaSlice';
import { decrementArrows } from '../../redux/weaponsSlice';

const GermisBattle: React.FC = () => {
  // Estados y referencias existentes
  const dispatch = useDispatch();
  const maiaHealth = useSelector((state: any) => state.maia.maiahealth);
  const maiaCurrentHealth = useSelector((state: any) => state.maia.maiacurrenthealth);
  const arrows = useSelector((state: any) => state.weapons.arrows);

  const [mattCurrentHealth, setMattCurrentHealth] = useState(10);
  const [mattMaxHealth, setMattMaxHealth] = useState(10);

  const [showDrawBar, setShowDrawBar] = useState(false);
  const [showShootingCircle, setShowShootingCircle] = useState(false);
  const [showRandomSequence, setShowRandomSequence] = useState(false);
  const [showMoonTear, setShowMoonTear] = useState(false);
  const [showAttackButton, setShowAttackButton] = useState(true);
  const [showDefenderButton, setShowDefenderButton] = useState(false);
  const [showDamagedMatt, setShowDamagedMatt] = useState(false);
  const [showDamagedMaia, setShowDamagedMaia] = useState(false);
  const [showBrokenHearthMatt, setShowBrokenHearthMatt] = useState(false);
  const [showBrokenHearthMaia, setShowBrokenHearthMaia] = useState(false);

  // Refs para animaciones
  const germisIconRef = useRef<ShakyGermisIconRef>(null);
  const maiaHeadIconRef = useRef<ShakyMaiaHeadIconRef>(null);

  // Array de diálogos y estado para controlar el índice actual
  const dialogueMessages = [
    "Comencemos!",
    "¡No te rindas!",
    "¡Ataca ahora!"
  ];
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);

  // Función para avanzar al siguiente diálogo al tocar la burbuja
  const handleDialoguePress = () => {
    setCurrentDialogueIndex(prev => (prev + 1) % dialogueMessages.length);
  };

  // Efecto de daño para Matt
  useEffect(() => {
    if (showDamagedMatt) {
      setTimeout(() => {
        germisIconRef.current?.triggerShake();
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

  const handleCounterResult = (result: boolean) => {
    setShowShootingCircle(false);
  
    if (result) {
      // Solo animación de daño para Matt
      setShowDamagedMatt(true);
      // Volver solo al botón de ataque
      setShowAttackButton(true);
      setShowDefenderButton(false);
    } else {
      // Volver a mostrar Defensa y Flecha
      setShowDefenderButton(true);
      setShowAttackButton(false);
    }
  };

  // Callback para el mini-juego de DEFENDER (RandomSequenceGrid)
  const handleDefenseResult = (result: boolean) => {
    setShowMoonTear(false);
    setShowAttackButton(true);
    if (!result) {
      dispatch(decrementMaiaCurrentHealth(1));
      setShowBrokenHearthMaia(true);
      setShowDamagedMaia(true);
      setTimeout(() => setShowBrokenHearthMaia(false), 1000);
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
    // Si no hay suficientes flechas, no hace nada
  };

  const handleDefensePress = () => {
    setShowDefenderButton(false);
    setShowMoonTear(true);
  };

  return (
    <View style={styles.container}>
      {/* Parte superior: salud, diálogo y Matt */}
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
        <View style={styles.dialogueAndMattContainer}>
          {/* Contenedor para el diálogo con el icono grande */}
          
            <View style={styles.iconContainer}>
              <TextBubbleRightIcon height={170} width={170} />
              <Text style={styles.dialogueText}>
                {dialogueMessages[currentDialogueIndex]}
              </Text>
            </View>
          
          {/* Icono de Matt */}
          {showDamagedMatt ? (
            <ShakyGermisIcon ref={germisIconRef} height={220} width={220} />
          ) : (
            <GermisIcon height={220} width={220} />
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
          <TouchableOpacity style={[styles.actionButton, { marginLeft: 9 }]} onPress={() => {}}>
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
              <BowIcon width={25} height={25} fill="white"/>
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

      {/* Overlay para ShootingCircle (contra) */}
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
       {/* Overlay para DrawBar (ataque) */}
       {showDrawBar && (
        <View style={styles.overlay}>
          <DrawBar
            levels={3}
            duration={1500}
            onResult={handleAttackResult} 
          />
        </View>
      )}

      {/* Overlay para RandomSequenceGrid (defensa) */}
      {showMoonTear && (
        <View style={styles.overlay}>
          <MoonTear 
            moonIcon={MoonIcon} 
            tearIcon={TearIcon} 
            difficulty={3} 
            patternLength={4} 
            onResult={handleDefenseResult} 
          />
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
    marginTop: "7%",
    left: '5%',
  },
  dialogueAndMattContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    right: "15%",
  },
  iconContainer: {
    position: 'relative',
    width: "30%",
    height: "35%",
    justifyContent: 'center',
    alignItems: 'center',
    left: "9%",
    bottom:'25%',
    
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
    left: "5%",
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
    right: "5%",
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

export default GermisBattle;
