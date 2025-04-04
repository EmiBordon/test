import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Image, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaiaIcon, ArrowIcon, BarisIcon } from '../../components/SvgExporter';
import Inventory from '../../components/inventory';
import Location from '../../components/functions/location';
import ConversationModal from '../../components/modal/conversationmodal';
import { conversations,Conversation } from '../../components/functions/conversations';
import { useSelector, useDispatch } from 'react-redux';
import { setCharacter } from '../../redux/charactersSlice';
import { setLocation } from '../../redux/locationsSlice';
import Box from '../../components/functions/boxicon'; // <-- nuevo componente
import SafeBox from '../../components/functions/safeboxicon';
import RewardManager from '../../components/functions/rewardmanager';
import { incrementObjective } from '../../redux/objectivesSlice';
import { font } from '../../components/functions/fontsize';


const icons = [
  { 
    component: BarisIcon, 
    height: font(145), 
    width: font(145), 
    style: { top: '43%', left: '40%' } 
  },
  { 
    component: 'BoxIcon', // <-- indicamos con string porque el renderizado es diferente ahora
    height: 100, 
    width: 100, 
    style: { top: '45%', left: '30%' } 
  }
];

const BarScreen = () => {
  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => backHandler.remove();
    }, [])
  );

  const navigation = useNavigation();
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [conversationContent, setConversationContent] = useState<Conversation | null>(null);
  const [currentSquare,setCurrentSquare ]= useState(7);
  const dispatch = useDispatch();
  const barisState = useSelector((state: any) => state.characters.baris);

  const handleNextIcon = () => {
    setCurrentIconIndex((prevIndex) => (prevIndex + 1) % icons.length);
  };

  const handlePrevIcon = () => {
    setCurrentIconIndex((prevIndex) => (prevIndex - 1 + icons.length) % icons.length);
  };

  

 
  const handleIconPress = () => {
    const { component: CurrentIcon } = icons[currentIconIndex];
    if (CurrentIcon === BarisIcon) {
      if (barisState === 0) {
        setConversationContent(conversations.barisconv1);
        setModal2Visible(true);
        dispatch(incrementObjective());
        dispatch(setCharacter({ key: 'baris', value: 1 }));
        dispatch(setLocation({ key: 'cave', value: 1 }));
      } else if  (barisState === 1) {
        setConversationContent(conversations.barisconv2);
        setModal2Visible(true);
      }else if (barisState === 2) {
        setConversationContent(conversations.barisconv3);
        setModal2Visible(true);
      }
    }
  };
  
  
  const { component: CurrentIcon, height, width, style: iconStyle } = icons[currentIconIndex];
  const handleImagePress = () => {
    if (CurrentIcon !== BarisIcon) {
      setConversationContent(conversations.barclose);
      setModal2Visible(true);
  }};
  
  const backgroundImage = (CurrentIcon === BarisIcon)
    ? require('../../images/bar.jpg')
    : require('../../images/bardoor.jpg');

   useEffect(() => {
     if (currentIconIndex === 0) {
       setCurrentSquare(7);
     }else {
       setCurrentSquare(8);
     }  
     }, [currentIconIndex]); 

  return (
    <View style={styles.container}>
      <Image source={backgroundImage} style={styles.backgroundImage} />
      <Pressable style={styles.buttonImage} onPress={handleImagePress} />
      {CurrentIcon === 'BoxIcon' ? (
      <>
      <Box
       boxKey="barbox"
        positionStyle={{ top: '45%', left: '25%' }}
      />
        </>
        ) : (
      <Pressable style={[styles.iconButton, iconStyle]} onPress={handleIconPress}>
        <CurrentIcon height={height} width={width} />
      </Pressable>
      )}

        {currentIconIndex !== 0 &&(
      <View style={styles.leftIcons}>
          <Pressable style={styles.arrowButton} onPress={handlePrevIcon}>
          <ArrowIcon style={styles.leftArrow} height={font(45)} width={font(45)} />
        </Pressable>
      </View>
        )}
      {currentIconIndex === 0 &&(
      <View style={styles.rightIcons}>
        <Pressable style={styles.arrowButton} onPress={handleNextIcon}>
          <ArrowIcon height={font(45)} width={font(45)} />
        </Pressable>
      </View>
      )}
      <View style={styles.maiaContainer}>
        <MaiaIcon height={font(150)} width={font(150)} />
      </View>

      <Inventory 
      highlightedSquares={[7,8,5]}
      whiteSquare={currentSquare}
      minisSquares={16}
      sSquares={55}
      tSquares={9}
      mSquares={3}
      />
      <Location text="Bar" />
      
      <RewardManager />
      {modal2Visible && (
        <ConversationModal 
          visible={modal2Visible}  
          conversation={conversationContent}
          onClose={() => setModal2Visible(false)}
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
    height: '40%',
  },
  buttonImage: { width: '100%', height: '40%' },
  iconButton: {
    position: 'absolute',
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
  leftArrow: {
    transform: [{ scaleX: -1 }],
  },
  arrowButton: {
    width: font(45),
    height: font(45),
  },
  maiaContainer: {
    position: 'absolute',
    bottom: '10%',
    left: '50%',
    transform: [{ translateX: -80 }],
  },
});

export default BarScreen;
