import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Image, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaiaIcon, MattIcon, DoorIcon, ChestCloseIcon, ArrowIcon } from '../../components/SvgExporter';
import Inventory from '../../components/inventory';
import Location from '../../components/functions/location';
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

const icons = [
  { 
    component: MattIcon, 
    height: 150, 
    width: 150, 
    style: { top: '30%', left: '10%' } 
  },
  { 
    component: ChestCloseIcon, 
    height: 100, 
    width: 100, 
    style: { top: '32%', left: '70%' } 
  }
];

const TutorialScreen = () => {
  type TutorialScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tutorial'>;
  const navigation = useNavigation<TutorialScreenNavigationProp>();
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [conversationContent, setConversationContent] = useState<Conversation | null>(null);
  const [currentSquare,setCurrentSquare ]= useState(7);

  const dispatch = useDispatch();
  const mattState = useSelector((state: any) => state.matt.value);
  const healing = useSelector((state: any) => state.healing);
  const maia = useSelector((state: any) => state.maia);
  const weapons = useSelector((state: any) => state.weapons);
  

  
 useEffect(() => {
  if (currentIconIndex === 0) {
    setCurrentSquare(7);
  }else {
    setCurrentSquare(8);
  }  
  }, [currentIconIndex]);
  // Bloquear botón "back" físico
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

  const handleNextIcon = () => {
    setCurrentIconIndex((prevIndex) => (prevIndex + 1) % icons.length);
  };

  const handlePrevIcon = () => {
    setCurrentIconIndex((prevIndex) => (prevIndex - 1 + icons.length) % icons.length);
  };

  const handleAccept = () => {
    if(conversationContent === conversations.mattconv1 ||
      conversationContent === conversations.mattconv2 ){
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
    setModal2Visible(false)
  };


  const handleIconPress = () => {
    const { component: CurrentIcon } = icons[currentIconIndex];
    if (CurrentIcon === MattIcon) {
      setCurrentSquare(7);
      if (mattState === 0) {
        setConversationContent(conversations.mattconv1);
        dispatch(incrementObjective());
        dispatch(setMattState(1));
        setModalVisible(true);
      } else if (mattState === 1) {
        setConversationContent(conversations.mattconv2);
        setModalVisible(true);
      }else if (mattState === 2) {
        setConversationContent(conversations.mattconv3);
        setModal2Visible(true);
        dispatch(setMattState(3));
        dispatch(setMapTrue('map1'));
        dispatch(incrementObjective());
      }else if (mattState === 3) {
        setConversationContent(conversations.mattconv4);
        setModal2Visible(true);
      }
      else if (mattState === 4) {
        setConversationContent(conversations.mattconv5);
        setModal2Visible(true);
      }
    } else {
      setConversationContent(conversations.homechestclose);
      setModal2Visible(true);
      
    }
  };

  const { component: CurrentIcon, height, width, style: iconStyle } = icons[currentIconIndex];

  return (
    <View style={styles.container}>
      <Image source={require('../../images/floor2.jpg')} style={styles.backgroundImage} />

      <Pressable style={[styles.iconButton, iconStyle]} onPress={handleIconPress}>
        <CurrentIcon height={height} width={width} />
      </Pressable>

      <View style={styles.sideIcons}>
        <Pressable style={styles.arrowButton} onPress={handlePrevIcon}>
          <ArrowIcon style={styles.leftArrow} height={50} width={50} />
        </Pressable>
        <Pressable style={styles.arrowButton} onPress={handleNextIcon}>
          <ArrowIcon height={50} width={50} />
        </Pressable>
      </View>

      <View style={styles.maiaContainer}>
        <MaiaIcon height={160} width={160} />
      </View>

      <Inventory 
      highlightedSquares={[7,8]}
      whiteSquare={currentSquare}
      sSquares={55}
      minisSquares={16}
      tSquares={9}
      mSquares={3}
      />
      <Location text="Casa" />

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
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '25%',
  },
  iconButton: {
    position: 'absolute',
  },
  sideIcons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    position: 'absolute',
    top: '50%',
    paddingHorizontal: '2%',
  },
  leftArrow: {
    transform: [{ scaleX: -1 }],
  },
  arrowButton: {
    width: 50,
    height: 50,
  },
  maiaContainer: {
    position: 'absolute',
    bottom: '10%',
    left: '50%',
    transform: [{ translateX: -80 }],
  },
});

export default TutorialScreen;
