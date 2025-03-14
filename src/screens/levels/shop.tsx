import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaiaIcon, MattIcon, DoorIcon, ChestCloseIcon, ArrowIcon, ShopGirlIcon } from '../../components/SvgExporter';
import Inventory from '../../components/inventory';
import Location from '../../components/functions/location';
import ConversationChoiceModal from '../../components/modal/conversationchoicemodal';
import ShopModal from '../../components/modal/shopmodal';
import { conversations, Conversation } from '../../components/functions/conversations';
import { useSelector, useDispatch } from 'react-redux';
import { setMattState } from '../../redux/mattSlice';

const icons = [
  { 
    component: ShopGirlIcon, 
    height: 150, 
    width: 150, 
    style: { top: '50%', left: '40%' } 
  },
  { 
    component: DoorIcon, 
    height: 150, 
    width: 150, 
    style: { top: '8%', left: '30%' } 
  },
  { 
    component: ChestCloseIcon, 
    height: 100, 
    width: 100, 
    style: { top: '30%', left: '70%' } 
  }
];

const ShopScreen = () => {
  const navigation = useNavigation();
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  // Variable para distinguir el modal: true para ShopModal, false para ConversationChoiceModal
  const [isShopModal, setIsShopModal] = useState(false);
  const [conversationContent, setConversationContent] = useState<Conversation | null>(null);
  
  const dispatch = useDispatch();
  const mattState = useSelector((state: any) => state.matt.value);

  // Función para navegar a BattleScreen y actualizar el estado
  const handleAccept = () => {
    dispatch(setMattState(2));
    navigation.replace('BattleScreen');
  };

  const handleIconPress = () => {
    const { component: CurrentIcon } = icons[currentIconIndex];
    if (CurrentIcon === ShopGirlIcon) {
      // Si se toca ShopGirlIcon, abrimos el modal de tienda
      setIsShopModal(true);
      setModalVisible(true);
    } else {
      // Para otros íconos, abrimos el modal de conversación
      setIsShopModal(false);
      setConversationContent(conversations.mattconv2);
      setModalVisible(true);
    }
  };

  const { component: CurrentIcon, height, width, style: iconStyle } = icons[currentIconIndex];

  return (
    <View style={styles.container}>
      <Image source={require('../../images/shop.jpg')} style={styles.backgroundImage} />

      <Pressable style={[styles.iconButton, iconStyle]} onPress={handleIconPress}>
        <CurrentIcon height={height} width={width} />
      </Pressable>

      <View style={styles.maiaContainer}>
        <MaiaIcon height={160} width={160} />
      </View>

      <Inventory />
      <Location text="Tienda" />

      {modalVisible && (
        isShopModal ? (
          <ShopModal 
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
    width: '100%',
    height: '50%',
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

export default ShopScreen;
