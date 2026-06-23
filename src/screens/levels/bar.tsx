import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, BackHandler } from 'react-native';
import IconButton from '../../components/functions/iconbutton';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ArrowIcon, BarisIcon, QuestionMarkIcon } from '../../components/SvgExporter';
import PlanillaGrid from '../../components/planillagrid';
import Inventory from '../../components/inventory';
import ConversationModal from '../../components/modal/conversationmodal';
import { conversations, Conversation } from '../../components/functions/conversations';
import { useSelector, useDispatch } from 'react-redux';
import { setCharacter } from '../../redux/charactersSlice';
import { setLocation } from '../../redux/locationsSlice';
import Box from '../../components/functions/boxicon';
import RewardManager from '../../components/functions/rewardmanager';
import EmptyBoxManager from '../../components/functions/emptyboxmanager';
import { incrementObjective } from '../../redux/objectivesSlice';
import { font } from '../../components/functions/fontsize';

// ── Imágenes de fondo por índice ──────────────────────────────────────────────
const backgroundImages = [
  require('../../images/bar.jpg'),
  require('../../images/bardoor.jpg'),
];

// ── Ícono por índice de imagen ────────────────────────────────────────────────
// Editar aquí para ajustar posición y tamaño de cada ícono.
const iconConfig: Record<number, {
  width: number;
  height: number;
  style: object;
}> = {
  0: {
    width: font(145),
    height: font(145),
    style: { top: '43%', left: '40%' },
  },
  1: {
    width: font(145),
    height: font(145),
    style: { top: '65%', left: '65%' },
  },
};

// ── Flechas de navegación por imagen ─────────────────────────────────────────
// Editar aquí para cambiar posición/transform de cada flecha por imageIndex.
type ArrowDef = {
  key: string;
  dir: 'next' | 'prev';
  top: number | string;
  left?: number | string;
  right?: number | string;
  transform?: object[];
};

const NAV_ARROWS: Record<number, ArrowDef[]> = {
  0: [
    { key: 'next', dir: 'next', top: '40%', right: '5%', transform: [{ rotate: '260deg' }] },
  ],
  1: [
    { key: 'back', dir: 'prev', top: '55%', left: '5%', transform: [{ rotate: '240deg' }] },
  ],
};

const BarScreen = () => {
  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => backHandler.remove();
    }, [])
  );

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [planillaVisible, setPlanillaVisible] = useState(false);
  const [conversationContent, setConversationContent] = useState<Conversation | null>(null);
  const [currentSquare, setCurrentSquare] = useState(7);

  const dispatch = useDispatch();
  const barisState = useSelector((state: any) => state.characters.baris);

  const handleNextImage = () => {
    setCurrentImageIndex(prev => Math.min(prev + 1, backgroundImages.length - 1));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => Math.max(prev - 1, 0));
  };

  const handleIconPress = () => {
    if (currentImageIndex !== 0) return;
    if (barisState === 0) {
      setConversationContent(conversations.barisconv1);
      setModal2Visible(true);
      dispatch(incrementObjective());
      dispatch(setCharacter({ key: 'baris', value: 1 }));
      dispatch(setLocation({ key: 'cave', value: 1 }));
    } else if (barisState === 1) {
      setConversationContent(conversations.barisconv2);
      setModal2Visible(true);
    } else if (barisState === 2) {
      setConversationContent(conversations.barisconv3);
      setModal2Visible(true);
    }
  };

  useEffect(() => {
    setCurrentSquare(currentImageIndex === 0 ? 7 : 8);
  }, [currentImageIndex]);

  const cfg = iconConfig[currentImageIndex];

  return (
    <View style={styles.container}>
      <Image
        source={backgroundImages[currentImageIndex]}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Ícono de bar.jpg: BarisIcon */}
      {currentImageIndex === 0 && (
        <IconButton
          Icon={BarisIcon}
          width={cfg.width}
          height={cfg.height}
          style={cfg.style}
          onPress={handleIconPress}
        />
      )}

      {/* Íconos de bardoor.jpg: Box + QuestionMarkIcon */}
      {currentImageIndex === 1 && (
        <>
          <Box
            boxKey="barbox"
            positionStyle={cfg.style}
          />
          <IconButton
            Icon={QuestionMarkIcon}
            width={font(70)}
            height={font(70)}
            style={{ top: '15%', left: '43%' }}
            onPress={() => setPlanillaVisible(true)}
          />
        </>
      )}

      {/* Flechas de navegación */}
      {(NAV_ARROWS[currentImageIndex] ?? []).map(arrow => (
        <IconButton
          key={arrow.key}
          Icon={ArrowIcon}
          width={font(45)}
          height={font(45)}
          style={{
            top: arrow.top,
            ...(arrow.left  !== undefined ? { left:  arrow.left  } : {}),
            ...(arrow.right !== undefined ? { right: arrow.right } : {}),
            ...(arrow.transform && arrow.transform.length > 0 ? { transform: arrow.transform } : {}),
          }}
          onPress={arrow.dir === 'next' ? handleNextImage : handlePrevImage}
        />
      ))}

      <Inventory
        highlightedSquares={[7, 8, 5]}
        whiteSquare={currentSquare}
        minisSquares={16}
        sSquares={55}
        tSquares={9}
        mSquares={3}
        text="Bar"
      />
      <RewardManager />
      <EmptyBoxManager />

      {modal2Visible && (
        <ConversationModal
          visible={modal2Visible}
          conversation={conversationContent}
          onClose={() => setModal2Visible(false)}
        />
      )}
      <PlanillaGrid
        visible={planillaVisible}
        onClose={() => setPlanillaVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
});

export default BarScreen;
