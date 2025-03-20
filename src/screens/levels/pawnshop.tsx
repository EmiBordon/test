import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Image, BackHandler } from 'react-native';
import { MaiaIcon, ShopGirlIcon, PawnShopBoyIcon } from '../../components/SvgExporter';
import Inventory from '../../components/inventory';
import Location from '../../components/functions/location';
import ConversationChoiceModal from '../../components/modal/conversationchoicemodal';
import { conversations, Conversation } from '../../components/functions/conversations';
import { useSelector, useDispatch } from 'react-redux';
import { setCharacter } from '../../redux/charactersSlice';
import { font } from '../../components/functions/fontsize';
import PawnShopModal from '../../components/modal/pawnshopmodal';
import { useFocusEffect } from '@react-navigation/native';

const icons = [
  { 
    component: PawnShopBoyIcon, 
    height: font(140), 
    width: font(140),
    style: { top: '43%', left: '10%' } 
  },
];

const PawnShopScreen = () => {
  useFocusEffect(
       React.useCallback(() => {
         const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
         
         return () => backHandler.remove();
       }, [])
     );
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  // Variable para distinguir el modal: true para ShopModal, false para ConversationChoiceModal
  const [isShopModal, setIsShopModal] = useState(false);
  const [conversationContent, setConversationContent] = useState<Conversation | null>(null);
  
  const dispatch = useDispatch();
  const pawnshopboyState = useSelector((state: any) => state.characters.pawnshopboy);

  // Función para navegar a BattleScreen y actualizar el estado
  const handleAccept = () => {
    dispatch(setCharacter({ key: 'pawnshopboy', value: 1 }));
    setIsShopModal(true);
    setModalVisible(true);
  };

  const handleIconPress = () => {
    const { component: CurrentIcon } = icons[currentIconIndex];
    if (CurrentIcon === PawnShopBoyIcon && pawnshopboyState === 1) {
      setIsShopModal(true);
      setModalVisible(true);
    } else {
      // Para otros íconos, abrimos el modal de conversación
      setIsShopModal(false);
      setConversationContent(conversations.pawnshopboyconv1);
      setModalVisible(true);
    }
  };

  const { component: CurrentIcon, height, width, style: iconStyle } = icons[currentIconIndex];

  return (
    <View style={styles.container}>
      <Image source={require('../../images/pawnshop.jpg')} style={styles.backgroundImage} />

      <Pressable style={[styles.iconButton, iconStyle]} onPress={handleIconPress}>
        <CurrentIcon height={height} width={width} />
      </Pressable>

      <View style={styles.maiaContainer}>
        <MaiaIcon height={160} width={160} />
      </View>

      <Inventory />
      <Location text="Joyeria" />

      {modalVisible && (
        isShopModal ? (
          <PawnShopModal 
            visible={modalVisible}  
            onClose={() => setModalVisible(false)}
          />
        ) : (
          <ConversationChoiceModal 
            visible={modalVisible}  
            conversation={conversationContent}
            onClose={() => setModalVisible(false)}
            onAccept={handleAccept}
          />
        )
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
    width: '130%',
    height: '40%',
    //top:'10%',
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
  maiaContainer: {
    position: 'absolute',
    bottom: '10%',
    left: '50%',
    transform: [{ translateX: -80 }],
  },
});

export default PawnShopScreen;
