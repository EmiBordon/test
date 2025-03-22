import React, { useState } from 'react';
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
  SignIcon
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const iconConfig = [
  {
    name: 'germis',
    component: GermisIcon,
    height: SCREEN_HEIGHT * 0.15,
    width: SCREEN_WIDTH * 0.3,
    style: { top: '35%', left: '10%' },
    appearances: [
      {
        imageIndex: 1,
        requiredState: 0,
        conversation: conversations.germisconv1,
        updateState: 1,
        modalType: 'modal2'
      },
      {
        imageIndex: 1,
        requiredState: 1,
        conversation: conversations.germisconv2,
        // No actualizamos el estado en este paso
        modalType: 'modal2'
      },
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
    height: SCREEN_HEIGHT * 0.18,
    width: SCREEN_WIDTH * 0.3,
    style: { top: '35%', left: '60%' },
    appearances: [
      {
        imageIndex: 2,
        requiredState: 0,
        conversation: conversations.joxconv1,
        updateState: 1,
        modalType: 'modal2'
      },
      {
        imageIndex: 2,
        requiredState: 1,
        conversation: conversations.joxconv2,
        modalType: 'modal2'
      },
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
    height: SCREEN_HEIGHT * 0.5,
    width: SCREEN_WIDTH * 0.5,
    style: { top: '20%', left: '40%' },
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
  }
];

// Configuración del SignIcon (se mantiene separado)
const signIconData = {
  component: SignIcon,
  height: SCREEN_HEIGHT * 0.25,
  width: SCREEN_WIDTH * 0.25,
  style: { top: '35%', left: '70%' }
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

  const dispatch = useDispatch();
  const caveState = useSelector((state: any) => state.locations.cave);
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
    gorjox: gorjoxState
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
    { text: "Interior de La Cueva 1" },
    { text: "Interior de La Cueva 2" },
    { text: "Interior de La Cueva 3" },
  ];

  const backgroundImages = [
    require('../../images/cave1.jpg'),
    require('../../images/cave7.jpg'),
    require('../../images/cave3.jpg'),
    require('../../images/cave6.jpg'),
  ];

  const handleNextImage = () => {
    if (currentImageIndex < backgroundImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setCurrentLocationIndex(currentLocationIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex !== 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      setCurrentLocationIndex(currentLocationIndex - 1);
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
        <Pressable
          style={[styles.iconButton, signIconData.style]}
          onPress={() => {
            setModalVisible(true);
            setConversationContent(conversations.sign1);
          }}
        >
          <signIconData.component height={signIconData.height} width={signIconData.width} />
        </Pressable>
      )}
      {/* Render de los íconos configurados */}
      {renderIcons()}
      {currentImageIndex !== 0 && (
        <View style={styles.sideIcons}>
          <Pressable style={styles.arrowButton} onPress={handlePrevImage}>
            <ArrowIcon style={styles.leftArrow} height={50} width={50} />
          </Pressable>
        </View>
      )}
      <View style={styles.maiaContainer}>
        <MaiaIcon height={160} width={160} />
      </View>
      <Inventory />
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
    height: '30%'
  },
  buttonImage: { width: '100%', height: '30%' },
  iconButton: { position: 'absolute' },
  sideIcons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    position: 'absolute',
    top: '70%',
    paddingHorizontal: '2%'
  },
  leftArrow: { transform: [{ rotate: '90deg' }] },
  arrowButton: { width: 50, height: 50 },
  maiaContainer: {
    position: 'absolute',
    bottom: '10%',
    left: '50%',
    transform: [{ translateX: -80 }]
  }
});

export default CaveScreen;
