import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  BackHandler
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  MaiaIcon,
  ArrowIcon,
  GermisIcon,
  JoxIcon,
  GorjoxIcon,
  SignIcon,
  DeathIcon,
  RiffIcon
} from '../../components/SvgExporter';
import Inventory from '../../components/inventory';
import Location from '../../components/functions/location';
import ConversationModal from '../../components/modal/conversationmodal';
import ConversationChoiceModal from '../../components/modal/conversationchoicemodal';
import { conversations, Conversation } from '../../components/functions/conversations';
import { useSelector, useDispatch } from 'react-redux';
import { setLocation } from '../../redux/locationsSlice';
import { setCharacter } from '../../redux/charactersSlice';
import { saveBackup } from '../../redux/backupSlice';
import Box from '../../components/functions/boxicon';
import CodeBox from '../../components/functions/codeboxicon';
import SafeBox from '../../components/functions/safeboxicon';
import IconButton from '../../components/functions/iconbutton';
import RewardManager from '../../components/functions/rewardmanager';
import { font } from '../../components/functions/fontsize';
import EmptyBoxManager from '../../components/functions/emptyboxmanager';
import SimpleBattle from '../../components/battles/SimpleBattle';
import ShakyIcon, { ShakyIconRef } from '../../components/characters/shakymatticon';


const iconConfig = [
  {
    name: 'germis',
    component: GermisIcon,
    height: font(120),
    width: font(120),
    style: { top: '35%', left: '50%' },
    appearances: [
      {
        imageIndex: 3,
        requiredState: 2,
        conversation: conversations.gorjoxconv0,
        updateState: 3,
        modalType: 'modal2'
      },
      {
        imageIndex: 3,
        requiredState: 3,
        conversation: conversations.gorjoxconv2,
        modalType: 'modal2'
      },
    ]
  },
  {
    name: 'jox',
    component: JoxIcon,
    height: font(125),
    width: font(125),
    style: { top: '35%', left: '10%' },
    appearances: [
      {
        imageIndex: 3,
        requiredState: 2,
        conversation: conversations.gorjoxconv1,
        updateState: 3,
        modalType: 'modal2'
      },
      {
        imageIndex: 3,
        requiredState: 3,
        conversation: conversations.gorjoxconv2,
        modalType: 'modal2'
      },
    ]
  },
  {
    name: 'gorjox',
    component: GorjoxIcon,
    height: font(170),
    width: font(170),
    style: { top: '35%', left: '40%' },
    appearances: [
      {
        imageIndex: 3,
        requiredState: 1,
        conversation: conversations.gorjoxconv3,
        updateState: 2,
        modalType: 'modal2'
      },
      {
        imageIndex: 3,
        requiredState: 2,
        conversation: conversations.gorjoxconv4,
        modalType: 'modal2'
      },
    ]
  },
  {
    name: 'death',
    component: DeathIcon,
    height: font(160),
    width: font(160),
    style: { top: '35%', left: '20%' },
    appearances: [
      {
        imageIndex: 4,
        requiredState: 1,
        conversation: conversations.deathconv1,
        modalType: 'modal2'
      },
    ]
  },
  {
    name: 'riff',
    component: RiffIcon,
    height: font(90),
    width: font(90),
    style: { top: '35%', left: '29%' },
    appearances: [],
  },
];

// Configuración del SignIcon (se mantiene separado)
const signIconData = {
  component: SignIcon,
  height: font(100),
  width: font(100),
  style: { top: '40%', left: '70%' }
};

const CaveScreen = () => {
  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => backHandler.remove();
    }, [])
  );

  const navigation = useNavigation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [conversationContent, setConversationContent] = useState<Conversation | null>(null);
  const [currentSquare,setCurrentSquare ]= useState(7);
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [showDamagedMaia, setShowDamagedMaia] = useState(false);
  const maiaShakeRef = useRef<ShakyIconRef>(null);
  const dispatch = useDispatch();
  const caveState = useSelector((state: any) => state.locations.cave);
  const germisState = useSelector((state: any) => state.characters.germis);
  const joxState = useSelector((state: any) => state.characters.jox);
  const gorjoxState = useSelector((state: any) => state.characters.gorjox);
  const deathState = useSelector((state: any) => state.characters.death);
  const riffState = useSelector((state: any) => state.characters.riff);
  const healing = useSelector((state: any) => state.healing);
  const maia = useSelector((state: any) => state.maia);
  const weapons = useSelector((state: any) => state.weapons);

  // Mapa dinámico de estados para acceder por nombre
  const characterStates = {
    germis: germisState,
    jox: joxState,
    gorjox: gorjoxState,
    death:deathState,
    riff:riffState,
  };

  // Función que obtiene la configuración de aparición para un ícono dado el nombre y la imagen actual.
  const getIconAppearance = (iconName: string) => {
    const icon = iconConfig.find(ic => ic.name === iconName);
    if (!icon) return null;
    return icon.appearances.find(app =>
      app.imageIndex === currentImageIndex &&
      app.requiredState === characterStates[iconName]
    );
  };

  // Manejador del Press sobre un ícono
  const handleIconPress = (iconName: string) => {
    const appearance = getIconAppearance(iconName);
    if (!appearance) return;
    if (appearance.modalType === 'modal2') {
      setModal2Visible(true);
    } else {
      setModalVisible(true);
    }
    setConversationContent(appearance.conversation);
    if (appearance.updateState !== null && appearance.updateState !== undefined) {
      dispatch(setCharacter({ key: iconName, value: appearance.updateState }));
    }
  };

  // Manejador para la imagen de fondo
  const handleImagePress = () => {
    if (currentImageIndex === 0 && caveState === 0) {
      setModalVisible(true);
      setConversationContent(conversations.caveclose1);
    } else if (currentImageIndex === 1 && germisState < 2) {
      setModalVisible(true);
      setConversationContent(conversations.caveclose2);
    } else if (currentImageIndex === 2 && joxState < 2) {
      setModalVisible(true);
      setConversationContent(conversations.caveclose3);
    } else {
      handleNextImage();
    }
  };

  const locationName = [
    { text: "Entrada de La Cueva" },
    { text: "Interior de La Cueva" },
    
  ];

  const backgroundImages = [
    require('../../images/cave1.jpg'),
    require('../../images/cave7.jpg'),
    require('../../images/cave3.jpg'),
    require('../../images/cave6.jpg'),
    require('../../images/cave2.jpg'),
    require('../../images/cave4.jpg'),
  ];
  const handleNextIcon = () => {
    if (currentImageIndex == 2) {
      setCurrentImageIndex(5);
   } else if (currentImageIndex == 4) {
    setCurrentImageIndex(1);
 }
  };

  const handlePrevIcon = () => {
    if (currentImageIndex == 1) {
       setCurrentImageIndex(4);
    } else if (currentImageIndex == 5) {
      setCurrentImageIndex(2);
   }
  };

  const handleNextImage = () => {
    if ((currentImageIndex > -1) && (currentImageIndex < 3)) {
      setCurrentImageIndex(currentImageIndex + 1);
      setCurrentLocationIndex(1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex !== 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
    if (currentImageIndex == 1) {
      setCurrentLocationIndex(0);
    }
  };

  const handleAccept = () => {
    // Ejemplo de aceptar en un modal2: si la conversación es de Germis, guardar backup y navegar a la BattleScreen.
    if (conversationContent === conversations.gorjoxconv1 ||
        conversationContent === conversations.gorjoxconv2||
        conversationContent === conversations.gorjoxconv0) {
        dispatch(setCharacter({ key: 'germis', value: 4 }));
        dispatch(setCharacter({ key: 'jox', value: 4 }));
        dispatch(setCharacter({ key: 'gorjox', value: 1 }));
        setModal2Visible(false);
        }else if (conversationContent === conversations.gorjoxconv3 ||
          conversationContent === conversations.gorjoxconv4) {
          dispatch(saveBackup({ healing, maia, weapons }));
          setModal2Visible(false);
          navigation.navigate('BattleScreen', { enemyName: 'Gorjox' });
          }else if (conversationContent === conversations.deathconv1 )
             {
              dispatch(setCharacter({ key: 'death', value: 2 }));
              setModal2Visible(false);
            }
  };
  const handleClose = () => {
    if (conversationContent === conversations.deathconv1 ) {
    setModal2Visible(false);
    dispatch(setCharacter({ key: 'death', value: 0 }));
    } else {
      setModal2Visible(false);
    }
  };

  // Renderiza los íconos de acuerdo a la configuración y la imagen actual
  const renderIcons = () => {
    return iconConfig.map(icon => {
      const appearance = icon.appearances.find(app =>
        app.imageIndex === currentImageIndex &&
        app.requiredState === characterStates[icon.name]
      );
      if (!appearance) return null;
      return (
        <IconButton
          key={icon.name}
          Icon={icon.component}
          width={icon.width}
          height={icon.height}
          style={icon.style}
          onPress={() => handleIconPress(icon.name)}
        />
      );
    });
  };

  useEffect(() => {
    if (currentImageIndex === 0) {
      setCurrentSquare(22);
    }else if (currentImageIndex === 1){
      setCurrentSquare(17);
    } else if (currentImageIndex === 2){
      setCurrentSquare(12);
    } else if (currentImageIndex === 4){
      setCurrentSquare(16);
    } else if (currentImageIndex === 5){
      setCurrentSquare(13);
    } 
    else {
      setCurrentSquare(7);
    } 
    }, [currentImageIndex]);

  useEffect(() => {
    if (showDamagedMaia) {
      setTimeout(() => { maiaShakeRef.current?.triggerShake(); }, 100);
      setTimeout(() => { setShowDamagedMaia(false); }, 1000);
    }
  }, [showDamagedMaia]);

  return (
    <View style={styles.container}>
     {currentImageIndex === 0 && (
     <CodeBox 
      boxKey='cavebox1'
      positionStyle={{ top: '40%', left: '22%' }}
      code="028173456"
      />
     )}
     {currentImageIndex === 1 && (
     <Box 
      boxKey='cavebox2'
      positionStyle={{ top: '60%', left: '70%' }}
      
      />
     )}
     {currentImageIndex === 2 && (
     <CodeBox 
      boxKey='cavebox3'
      positionStyle={{ top: '60%', left: '30%' }}
      code="302845617"
      />
     )}
     {currentImageIndex === 3 && (
     <SafeBox 
      boxKey='cavebox4'
      positionStyle={{ top: '60%', left: '70%' }}
      code="4587"
      />
     )}
      <Image source={backgroundImages[currentImageIndex]} style={styles.backgroundImage} />
      {/* Presionando la imagen se ejecuta handleImagePress */}
      <Pressable style={styles.buttonImage} onPress={handleImagePress} />
      {/* SignIcon (se muestra en la primera imagen) */}
      {currentImageIndex === 0 && (
        <IconButton
          Icon={signIconData.component}
          width={signIconData.width}
          height={signIconData.height}
          style={signIconData.style}
          onPress={() => {
            setModalVisible(true);
            setConversationContent(conversations.sign1);
          }}
        />
      )}
      {/* Render de los íconos configurados */}
      {renderIcons()}

      {/* SimpleBattle: Germis (imageIndex 1, estado 0 o 1) */}
      {currentImageIndex === 1 && (germisState === 0 || germisState === 1) && (
        <SimpleBattle
          enemyName="Germis"
          enemyKey="germis"
          healthKey="germisHealth"
          Icon={GermisIcon}
          iconWidth={font(105)}
          iconHeight={font(105)}
          style={{ top: '35%', left: '50%' }}
          onMaiaDamaged={() => setShowDamagedMaia(true)}
        />
      )}

      {/* SimpleBattle: Jox (imageIndex 2, estado 0 o 1) */}
      {currentImageIndex === 2 && (joxState === 0 || joxState === 1) && (
        <SimpleBattle
          enemyName="Jox"
          enemyKey="jox"
          healthKey="joxHealth"
          Icon={JoxIcon}
          iconWidth={font(110)}
          iconHeight={font(110)}
          style={{ top: '35%', left: '10%' }}
          onMaiaDamaged={() => setShowDamagedMaia(true)}
        />
      )}

      {/* SimpleBattle: Riff (imageIndex 5, estado 0 o 1) */}
      {currentImageIndex === 5 && (riffState === 0 || riffState === 1) && (
        <SimpleBattle
          enemyName="Riff"
          enemyKey="riff"
          healthKey="riffHealth"
          Icon={RiffIcon}
          iconWidth={font(80)}
          iconHeight={font(80)}
          style={{ top: '35%', left: '29%' }}
          onMaiaDamaged={() => setShowDamagedMaia(true)}
        />
      )}
      {(currentImageIndex > 0) && (currentImageIndex < 4) &&(
        <View style={styles.backIcons}>
          <Pressable style={styles.arrowButton} onPress={handlePrevImage}>
            <ArrowIcon style={styles.backArrow} height={font(45)} width={font(45)} />
          </Pressable>
        </View>
      )}
          {((currentImageIndex == 2)||(currentImageIndex == 4) )&& (
            <View style={styles.rightIcons}>
              <Pressable style={styles.arrowButton} onPress={handleNextIcon}>
                <ArrowIcon height={font(45)} width={font(45)} />
              </Pressable>
            </View>
            )}
          {((currentImageIndex == 1)||(currentImageIndex == 5) )&& (
            <View style={styles.leftIcons}>
              <Pressable style={styles.arrowButton} onPress={handlePrevIcon}>
                <ArrowIcon style={styles.leftArrow} height={font(45)} width={font(45)} />
              </Pressable>
            </View>
          )}
      <View style={styles.maiaContainer}>
        {showDamagedMaia
          ? <ShakyIcon ref={maiaShakeRef} Icon={MaiaIcon} height={font(150)} width={font(150)} />
          : <MaiaIcon height={font(150)} width={font(150)} />
        }
      </View>
      <Inventory 
      highlightedSquares={[22,17,12,7,13,16]}
      whiteSquare={currentSquare}
      sSquares={50}
      minisSquares={12}
      tSquares={25}
      mSquares={5}
      />
      <RewardManager />
      <EmptyBoxManager />
      <Location text={locationName[currentLocationIndex].text} />
      {modal2Visible && (
        <ConversationChoiceModal
          visible={modal2Visible}
          conversation={conversationContent}
          onClose={handleClose}
          onAccept={handleAccept}
        />
      )}
      {modalVisible && (
        <ConversationModal
          visible={modalVisible}
          conversation={conversationContent}
          onClose={() => setModalVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '30%'
  },
  buttonImage: { width: '100%', height: '30%' },
  backIcons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    position: 'absolute',
    top: '70%',
    paddingHorizontal: '2%'
  },
  leftIcons: {
    flexDirection: 'row',
    position: 'absolute',
    top: '50%',
    left: 0, // Alinea el contenedor al borde derecho
    paddingHorizontal: '2%',
    justifyContent: 'flex-end', // Alinea los íconos a la derecha dentro del contenedor
    width: 'auto', // O eliminá la propiedad 'width' si no hace falta ocupar todo el ancho
  },
  rightIcons: {
    flexDirection: 'row',
    position: 'absolute',
    top: '50%',
    right: 0, // Alinea el contenedor al borde derecho
    paddingHorizontal: '2%',
    justifyContent: 'flex-end', // Alinea los íconos a la derecha dentro del contenedor
    width: 'auto', // O eliminá la propiedad 'width' si no hace falta ocupar todo el ancho
  },
  backArrow: { transform: [{ rotate: '90deg' }] },
  arrowButton: { width: font(45), height: font(45) },
  leftArrow: {
    transform: [{ scaleX: -1 }],
  },
  maiaContainer: {
    position: 'absolute',
    bottom: '10%',
    left: '50%',
    transform: [{ translateX: -80 }]
  }
});

export default CaveScreen;
