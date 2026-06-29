import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
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
  DeathIcon,
  RiffIcon
} from '../../components/SvgExporter';
import Inventory from '../../components/inventory';
import { useSelector, useDispatch } from 'react-redux';
import { setLocation } from '../../redux/locationsSlice';
import Box from '../../components/functions/boxicon';
import CodeBox from '../../components/functions/codeboxicon';
import SafeBox from '../../components/functions/safeboxicon';
import IconButton from '../../components/functions/iconbutton';
import RewardManager from '../../components/functions/rewardmanager';
import { font } from '../../components/functions/fontsize';
import EmptyBoxManager from '../../components/functions/emptyboxmanager';
import DamageOverlay from '../../components/functions/damageoverlay';
import SimpleBattle from '../../components/battles/SimpleBattle';
import ShakyIcon, { ShakyIconRef } from '../../components/characters/shakymatticon';




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
  const [currentSquare,setCurrentSquare ]= useState(7);
  const [showDamagedMaia, setShowDamagedMaia] = useState(false);
  const maiaShakeRef = useRef<ShakyIconRef>(null);
  const dispatch = useDispatch();
  const germisState = useSelector((state: any) => state.characters.germis);
  const joxState = useSelector((state: any) => state.characters.jox);
  const riffState = useSelector((state: any) => state.characters.riff);

  const handleImagePress = () => {
    handleNextImage();
  };

  const locationName = [
    { text: "Entrada de La Cueva" },
    { text: "Interior de La Cueva" },
    
  ];

  const backgroundImages = [
    require('../../images/cave1.jpg'),
    require('../../images/cave2.jpg'),
    require('../../images/cave3.jpg'),
    require('../../images/cave4.jpg'),
    require('../../images/cave5.jpg'),
    require('../../images/cave6.jpg'),
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

  // ── Configuración de flechas de navegación por imagen ──────────────────
  // Editar aquí para cambiar posición/transform de cada flecha por imagen.
  // Campos: top, left/right (número o string), transform (opcional).
  const NAV_ARROWS: Record<number, Array<{
    key: string;
    onPress: () => void;
    top: number | string;
    left?: number | string;
    right?: number | string;
    transform?: object[];
  }>> = {
    0: [
      { key: 'next', onPress: handleImagePress, top: font(300), right: font(144), transform: [{ rotate: '270deg' }] },
    ],
    1: [
      { key: 'back', onPress: handlePrevImage,  top: font(550), left: font(54),  transform: [{ rotate: '90deg' }] },
      { key: 'next', onPress: handleImagePress, top: font(250), right: font(88), transform: [{ rotate: '90deg' }] },
      { key: 'side', onPress: handlePrevIcon,   top: font(334), left: font(64),  transform: [{ rotate: '180deg' }]  },
    ],
    2: [
      { key: 'back', onPress: handlePrevImage,  top: font(620), left: font(214),  transform: [{ rotate: '90deg' }] },
      { key: 'next', onPress: handleImagePress, top: font(214), right: font(194), transform: [{ rotate: '90deg' }] },
      { key: 'side', onPress: handleNextIcon,   top: font(384), right: font(74) },
    ],
    3: [
      { key: 'back', onPress: handlePrevImage,  top: font(624), left: font(60),  transform: [{ rotate: '90deg' }] },
    ],
    4: [
      { key: 'side', onPress: handleNextIcon,   top: font(600), right: font(14) },
    ],
    5: [
      { key: 'side', onPress: handlePrevIcon,   top: font(614), left: font(14),  transform: [{ scaleX: -1 }] },
    ],
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
     
      <Image source={backgroundImages[currentImageIndex]} style={styles.backgroundImage} resizeMode="cover" />
      {currentImageIndex === 0 && (
     <CodeBox 
      boxKey='cavebox1'
      positionStyle={{ top: '52%', left: '40%' }}
      code="028173456"
      />
     )}
     {currentImageIndex === 1 && (
     <Box 
      boxKey='cavebox2'
      positionStyle={{ top: '80%', left: '40%' }}
      
      />
     )}
     {currentImageIndex === 2 && (
     <CodeBox 
      boxKey='cavebox3'
      positionStyle={{ top: '65%', left: '30%' }}
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
      {/* SimpleBattle: Germis (imageIndex 1, estado 0 o 1) */}
      {currentImageIndex === 1 && (germisState === 0 || germisState === 1) && (
        <SimpleBattle
          enemyName="Germis"
          enemyKey="germis"
          healthKey="germisHealth"
          Icon={GermisIcon}
          iconWidth={font(155)}
          iconHeight={font(155)}
          style={{ top: font(399), left: font(115) }}
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
          iconHeight={font(190)}
          style={{ top: '40%', left: '24%' }}
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
          iconWidth={font(160)}
          iconHeight={font(160)}
          style={{ top: '40%', left: '30%' }}
          onMaiaDamaged={() => setShowDamagedMaia(true)}
        />
      )}
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
      highlightedSquares={[22,17,12,7,13,16]}
      whiteSquare={currentSquare}
      sSquares={50}
      minisSquares={12}
      tSquares={25}
      mSquares={5}
      text={locationName[currentLocationIndex].text}
      />
      <RewardManager />
      <EmptyBoxManager />
      <DamageOverlay />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor:'#689692' },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width:'100%',
    height:'100%'
  },
  maiaContainer: {
    position: 'absolute',
    bottom: '10%',
    left: '50%',
    transform: [{ translateX: -80 }]
  }
});

export default CaveScreen;
