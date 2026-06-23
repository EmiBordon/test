import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, BackHandler } from 'react-native';
import IconButton from '../../components/functions/iconbutton';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MattIcon, ChestCloseIcon, ArrowIcon } from '../../components/SvgExporter';
import Inventory from '../../components/inventory';
import ConversationModal from '../../components/modal/conversationmodal';
import ConversationChoiceModal from '../../components/modal/conversationchoicemodal';
import { conversations, Conversation } from '../../components/functions/conversations';
import { useSelector, useDispatch } from 'react-redux';
import { setMattState } from '../../redux/mattSlice';
import { saveBackup } from "../../redux/backupSlice";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../components/battles/types';
import { setMapTrue } from '../../redux/locationsSlice';
import { incrementObjective } from '../../redux/objectivesSlice';
import { font } from '../../components/functions/fontsize';

// ── Imágenes de fondo por índice ──────────────────────────────────────────────
const backgroundImages = [
  require('../../images/home1.jpg'),
  require('../../images/home2.jpg'),
];

// ── Ícono por índice de imagen ────────────────────────────────────────────────
// Editar aquí para ajustar posición, tamaño de cada ícono.
const iconConfig: Record<number, {
  component: React.ComponentType<any>;
  width: number;
  height: number;
  style: object;
}> = {
  0: {
    component: MattIcon,
    width: font(160),
    height: font(160),
    style: { top: '50%', left: '50%' },
  },
  1: {
    component: ChestCloseIcon,
    width: font(120),
    height: font(120),
    style: { top: '37%', left: '27%' },
  },
};

const TutorialScreen = () => {
  type TutorialScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tutorial'>;
  const navigation = useNavigation<TutorialScreenNavigationProp>();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [conversationContent, setConversationContent] = useState<Conversation | null>(null);
  const [currentSquare, setCurrentSquare] = useState(7);

  const dispatch = useDispatch();
  const mattState = useSelector((state: any) => state.matt.value);
  const healing = useSelector((state: any) => state.healing);
  const maia = useSelector((state: any) => state.maia);
  const weapons = useSelector((state: any) => state.weapons);

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => backHandler.remove();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(false);
      return () => {};
    }, [])
  );

  useEffect(() => {
    setCurrentSquare(currentImageIndex === 0 ? 7 : 4);
  }, [currentImageIndex]);

  const handleNextImage = () => {
    setCurrentImageIndex(prev => Math.min(prev + 1, backgroundImages.length - 1));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => Math.max(prev - 1, 0));
  };

  const handleIconPress = () => {
    const icon = iconConfig[currentImageIndex];
    if (!icon) return;

    if (icon.component === MattIcon) {
      if (mattState === 0) {
        setConversationContent(conversations.mattconv1);
        dispatch(incrementObjective());
        dispatch(setMattState(1));
        setModalVisible(true);
      } else if (mattState === 1) {
        setConversationContent(conversations.mattconv2);
        setModalVisible(true);
      } else if (mattState === 2) {
        setConversationContent(conversations.mattconv3);
        setModal2Visible(true);
        dispatch(setMattState(3));
        dispatch(setMapTrue('map1'));
        dispatch(incrementObjective());
      } else if (mattState === 3) {
        setConversationContent(conversations.mattconv4);
        setModal2Visible(true);
      } else if (mattState === 4) {
        setConversationContent(conversations.mattconv5);
        setModal2Visible(true);
      }
    } else {
      setConversationContent(conversations.homechestclose);
      setModal2Visible(true);
    }
  };

  const handleAccept = () => {
    if (
      conversationContent === conversations.mattconv1 ||
      conversationContent === conversations.mattconv2
    ) {
      dispatch(saveBackup({ healing, maia, weapons }));
      setModalVisible(false);
      navigation.navigate('BattleScreen', { enemyName: 'Matt' });
    } else {
      dispatch(setMattState(3));
      setModalVisible(false);
      dispatch(setMapTrue('map1'));
    }
  };

  const handleClose = () => {
    setModal2Visible(false);
  };

  // ── Flechas de navegación por imagen ─────────────────────────────────────
  // Editar aquí para cambiar posición/transform de cada flecha por imageIndex.
  const NAV_ARROWS: Record<number, Array<{
    key: string;
    onPress: () => void;
    top: number | string;
    left?: number | string;
    right?: number | string;
    transform?: object[];
  }>> = {
    0: [
      { key: 'next', onPress: handleNextImage, top: '40%', right: '45%', transform: [{ rotate: '270deg' }] },
    ],
    1: [
      { key: 'back', onPress: handlePrevImage, top: '74%', left: '70%', transform: [{ rotate: '60deg' }] },
    ],
  };

  const currentIcon = iconConfig[currentImageIndex];

  return (
    <View style={styles.container}>
      <Image
        source={backgroundImages[currentImageIndex]}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Ícono del estado actual */}
      {currentIcon && (
        <IconButton
          Icon={currentIcon.component}
          width={currentIcon.width}
          height={currentIcon.height}
          style={currentIcon.style}
          onPress={handleIconPress}
        />
      )}

      {/* Flechas de navegación */}
      {(NAV_ARROWS[currentImageIndex] ?? []).map(arrow => (
        <IconButton
          key={arrow.key}
          Icon={ArrowIcon}
          width={font(50)}
          height={font(50)}
          style={{
            top: arrow.top,
            ...(arrow.left  !== undefined ? { left:  arrow.left  } : {}),
            ...(arrow.right !== undefined ? { right: arrow.right } : {}),
            ...(arrow.transform           ? { transform: arrow.transform } : {}),
          }}
          onPress={arrow.onPress}
        />
      ))}

      <Inventory
        highlightedSquares={[7, 4]}
        whiteSquare={currentSquare}
        sSquares={55}
        minisSquares={16}
        tSquares={9}
        mSquares={3}
        text="Casa"
      />

      {modalVisible && (
        <ConversationChoiceModal
          visible={modalVisible}
          conversation={conversationContent}
          onClose={() => setModalVisible(false)}
          onAccept={handleAccept}
        />
      )}
      {modal2Visible && (
        <ConversationModal
          visible={modal2Visible}
          conversation={conversationContent}
          onClose={handleClose}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b8810a42',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
});

export default TutorialScreen;
