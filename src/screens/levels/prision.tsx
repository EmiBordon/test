import React, { useState, useEffect } from 'react';
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
  TimIcon
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
import RewardManager from '../../components/functions/rewardmanager';
import { font } from '../../components/functions/fontsize';



const iconConfig = [
  {
    name: 'tim',
    component: TimIcon,
    height: font(130),
    width: font(130),
    style: { top: '39%', left: '10%' },
    appearances: [
      {
        imageIndex: 5,
        requiredState: 0,
        conversation: conversations.germisconv1,
        updateState: 1,
        modalType: 'modal2'
      },
      {
        imageIndex: 1,
        requiredState: 1,
        conversation: conversations.germisconv2,
        modalType: 'modal2'
      },
    ]
  },
];

// Configuración del SignIcon (se mantiene separado)


const PrisionScreen = () => {
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
  const dispatch = useDispatch();
  const prisionState = useSelector((state: any) => state.locations.prision);
  const prisionkey1State = useSelector((state: any) => state.objects.prisionkey1);
  const prisionkey2State = useSelector((state: any) => state.objects.prisionkey2);
  const timState = useSelector((state: any) => state.characters.tim);
  const germisState = useSelector((state: any) => state.characters.germis);
  const joxState = useSelector((state: any) => state.characters.jox);
  const gorjoxState = useSelector((state: any) => state.characters.gorjox);
  const healing = useSelector((state: any) => state.healing);
  const maia = useSelector((state: any) => state.maia);
  const weapons = useSelector((state: any) => state.weapons);

  // Mapa dinámico de estados para acceder por nombre
  const characterStates = {
    germis: germisState,
    jox: joxState,
    gorjox: gorjoxState,
    tim:timState,
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
    if (currentImageIndex === 0 && prisionkey1State === false) {
      setModalVisible(true);
      setConversationContent(conversations.caveclose1);
    }else if (currentImageIndex === 7 && prisionkey2State === false) {
      setModalVisible(true);
      setConversationContent(conversations.caveclose1);
    } else {
      handleNextImage();
    }
  };

  const locationName = [
    { text: "Prision" },
    { text: "Interior de la Prision" },
    
  ];


  const backgroundImages = [
    require('../../images/prison1.jpg'),
    require('../../images/prison2.jpg'),
    require('../../images/prison3.jpg'),
    require('../../images/prison4.jpg'),
    require('../../images/prison5.jpg'),
    require('../../images/prison6.jpg'),
    require('../../images/prison7.jpg'),
    require('../../images/prison8.jpg'),
    require('../../images/prison9.jpg'),
  ];

  const navigationStates = {
    0: { next: 1, square: 22, locationIndex: 0 },
    1: { next: 2, prev: 0, square: 17, locationIndex: 1 },
    2: {prev: 1, square: 12 },
    3: { prev: 8, square: 3 },
    4: {  prev: 7, square: 16 },
    5: { prev: 7, square: 10 },
    6: { next: 8, prev: 2, square: 13 },
    7: { next: 5, prev: 4, square: 15 },
    8: { next: 3, prev: 6, square: 8 }
  };
  const handleNextIcon = () => {
    if (currentImageIndex == 7) {
      setCurrentImageIndex(4);
   } else if (currentImageIndex == 4) {
    setCurrentImageIndex(1);
 }else if (currentImageIndex == 2) {
  setCurrentImageIndex(6);
}
  };

  const handlePrevIcon = () => {
    if (currentImageIndex == 1) {
       setCurrentImageIndex(4);
    } else if (currentImageIndex == 4) {
      setCurrentImageIndex(7);
   }else if (currentImageIndex == 6) {
    setCurrentImageIndex(2);
 }
  };

  const handleNextImage = () => {
    const currentState = navigationStates[currentImageIndex];
    if (currentState?.next !== undefined) {
      const nextIndex = currentState.next;
      setCurrentImageIndex(nextIndex);
      setCurrentSquare(navigationStates[nextIndex]?.square ?? -1);
      if (navigationStates[nextIndex]?.locationIndex !== undefined) {
        setCurrentLocationIndex(navigationStates[nextIndex].locationIndex);
      }
    }
  };

  const handlePrevImage = () => {
    const currentState = navigationStates[currentImageIndex];
    if (currentState?.prev !== undefined) {
      const prevIndex = currentState.prev;
      setCurrentImageIndex(prevIndex);
      setCurrentSquare(navigationStates[prevIndex]?.square ?? -1);
      if (navigationStates[prevIndex]?.locationIndex !== undefined) {
        setCurrentLocationIndex(navigationStates[prevIndex].locationIndex);
      }
    }
  };

  const handleAccept = () => {
    // Ejemplo de aceptar en un modal2: si la conversación es de Germis, guardar backup y navegar a la BattleScreen.
    if (
      conversationContent === conversations.germisconv1 ||
      conversationContent === conversations.germisconv2
    ) {
      dispatch(saveBackup({ healing, maia, weapons }));
      setModal2Visible(false);
      navigation.navigate('BattleScreen', { enemyName: 'Germis' });
    } else if (conversationContent === conversations.joxconv1 ||
      conversationContent === conversations.joxconv2) {
        dispatch(saveBackup({ healing, maia, weapons }));
      setModal2Visible(false);
      navigation.navigate('BattleScreen', { enemyName: 'Jox' });
      }else if (conversationContent === conversations.gorjoxconv1 ||
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
        <Pressable
          key={icon.name}
          style={[styles.iconButton, icon.style]}
          onPress={() => handleIconPress(icon.name)}
        >
          <icon.component height={icon.height} width={icon.width} />
        </Pressable>
      );
    });
  };

  useEffect(() => {
    if (currentImageIndex === 0) {
      setCurrentSquare(22);
    }else if (currentImageIndex === 1){
      setCurrentSquare(17);
    } else if (currentImageIndex === 4){
      setCurrentSquare(16);
    } else if (currentImageIndex === 6){
      setCurrentSquare(13);
    } else if (currentImageIndex === 2){
      setCurrentSquare(12); 
    } else if (currentImageIndex === 7){
      setCurrentSquare(15); 
    }else if (currentImageIndex === 5){
      setCurrentSquare(10); 
    }else if (currentImageIndex === 3){
      setCurrentSquare(3); 
    }else if (currentImageIndex === 8){
      setCurrentSquare(8); 
    }
    else {
      setCurrentSquare(22);
    } 
    }, [currentImageIndex]);

  return (
    <View style={styles.container}>
     {currentImageIndex === 12 && (
     <CodeBox 
      boxKey='cavebox1'
      positionStyle={{ top: '40%', left: '22%' }}
      code="028173456"
      />
     )}
     {currentImageIndex === 12 && (
     <Box 
      boxKey='cavebox2'
      positionStyle={{ top: '60%', left: '70%' }}
      
      />
     )}
     {currentImageIndex === 22 && (
     <CodeBox 
      boxKey='cavebox3'
      positionStyle={{ top: '60%', left: '30%' }}
      code="302845617"
      />
     )}
     {currentImageIndex === 32 && (
     <SafeBox 
      boxKey='cavebox4'
      positionStyle={{ top: '60%', left: '70%' }}
      code="4587"
      />
     )}
      <Image source={backgroundImages[currentImageIndex]} style={styles.backgroundImage} />
      {/* Presionando la imagen se ejecuta handleImagePress */}
      <Pressable style={styles.buttonImage} onPress={handleImagePress} />
     
        
      
      {/* Render de los íconos configurados */}
      {renderIcons()}
      {((currentImageIndex == 1) || (currentImageIndex == 5)|| (currentImageIndex == 2)|| (currentImageIndex == 3)
      || (currentImageIndex == 8)) &&(
        <View style={styles.backIcons}>
          <Pressable style={styles.arrowButton} onPress={handlePrevImage}>
            <ArrowIcon style={styles.backArrow} height={font(45)} width={font(45)} />
          </Pressable>
        </View>
      )}
          {((currentImageIndex == 2)||(currentImageIndex == 4)||(currentImageIndex == 7 ) )&& (
            <View style={styles.rightIcons}>
              <Pressable style={styles.arrowButton} onPress={handleNextIcon}>
                <ArrowIcon height={font(45)} width={font(45)} />
              </Pressable>
            </View>
            )}
          {((currentImageIndex == 1)||(currentImageIndex == 4)||(currentImageIndex == 6) )&& (
            <View style={styles.leftIcons}>
              <Pressable style={styles.arrowButton} onPress={handlePrevIcon}>
                <ArrowIcon style={styles.leftArrow} height={font(45)} width={font(45)} />
              </Pressable>
            </View>
          )}
      <View style={styles.maiaContainer}>
        <MaiaIcon height={font(150)} width={font(150)} />
      </View>
      <Inventory 
      highlightedSquares={[22,17,12,13,16,15,10,8,3]}
      whiteSquare={currentSquare}
      sSquares={50}
      minisSquares={12}
      tSquares={25}
      mSquares={5}
      />
      <RewardManager />
      <Location text={locationName[currentLocationIndex].text} />
      {modal2Visible && (
        <ConversationChoiceModal
          visible={modal2Visible}
          conversation={conversationContent}
          onClose={() => setModal2Visible(false)}
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
    height: '35%'
  },
  buttonImage: { width: '100%', height: '35%' },
  iconButton: { position: 'absolute' },
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

export default PrisionScreen;
