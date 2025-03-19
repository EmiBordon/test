import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaiaIcon, ArrowIcon, BarisIcon, BoxIcon, CoinsIcon } from '../../components/SvgExporter';
import Inventory from '../../components/inventory';
import Location from '../../components/functions/location';
import ConversationChoiceModal from '../../components/modal/conversationchoicemodal';
import ConversationModal from '../../components/modal/conversationmodal';
import NewItemModal from '../../components/modal/newitemmodal';
import { conversations, Conversation } from '../../components/functions/conversations';
import { useSelector, useDispatch } from 'react-redux';
import { incrementCoins } from '../../redux/coinsSlice';
import { setBarboxFalse } from '../../redux/boxesSlice';
import { setBaris } from '../../redux/charactersSlice';
import { setCave } from '../../redux/locationsSlice';

const icons = [
  { 
    component: BarisIcon, 
    height: 150, 
    width: 150, 
    style: { top: '43%', left: '40%' } 
  },
  { 
    component: BoxIcon, 
    height: 100, 
    width: 100, 
    style: { top: '45%', left: '30%' } 
  }
];

const BarScreen = () => {
  const navigation = useNavigation();
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [conversationContent, setConversationContent] = useState<Conversation | null>(null);
  const [newItemModalVisible, setNewItemModalVisible] = useState(false);

  const dispatch = useDispatch();
  const barboxState = useSelector((state: any) => state.boxes.barbox);
  const barisState = useSelector((state: any) => state.characters.baris);

  const handleNextIcon = () => {
    setCurrentIconIndex((prevIndex) => (prevIndex + 1) % icons.length);
  };

  const handlePrevIcon = () => {
    setCurrentIconIndex((prevIndex) => (prevIndex - 1 + icons.length) % icons.length);
  };

  // En handleAccept, si la conversación actual es de openbox se muestra el NewItemModal,
  // se incrementan las monedas y se actualiza el estado de barbox a false.
  const handleAccept = () => {
    if (conversationContent === conversations.openbox) {
      setModalVisible(false);
      setNewItemModalVisible(true);
      dispatch(incrementCoins(70));
      dispatch(setBarboxFalse());
    } else {
      // Otra lógica para distintas conversaciones, si es necesario.
    }
  };

  // En handleIconPress, si el ícono actual es BoxIcon y barboxState es true se abre el modal.
  // Si es BoxIcon y barboxState es false, no hace nada.
  const handleIconPress = () => {
    const { component: CurrentIcon } = icons[currentIconIndex];
    if (CurrentIcon === BoxIcon) {
      if (barboxState) {
        setConversationContent(conversations.openbox);
        setModalVisible(true);
      } else {
        // El icono está "desaparecido", por lo que no se ejecuta acción.
      }
    } else if (CurrentIcon === BarisIcon) {
      if (barisState === 0){
        setConversationContent(conversations.barisconv1);
        setModal2Visible(true);
        dispatch(setBaris(1));
        dispatch(setCave(1));
      } else{
        setConversationContent(conversations.barisconv2);
        setModal2Visible(true);
      }
    }
  };

  // Obtenemos la información del ícono actual
  const { component: CurrentIcon, height, width, style: iconStyle } = icons[currentIconIndex];

  // La imagen de fondo depende del tipo de ícono (BarisIcon: bar.jpg, BoxIcon: bardoor.jpg)
  const backgroundImage = (CurrentIcon === BarisIcon)
    ? require('../../images/bar.jpg')
    : require('../../images/bardoor.jpg');

  return (
    <View style={styles.container}>
      <Image source={backgroundImage} style={styles.backgroundImage} />

      <Pressable style={[styles.iconButton, iconStyle]} onPress={handleIconPress}>
        {
          // Si es BoxIcon y barboxState es false, no renderizamos el ícono
          (CurrentIcon === BoxIcon && !barboxState)
            ? null
            : <CurrentIcon height={height} width={width} />
        }
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

      <Inventory />
      <Location text="Bar" />

      {/* NewItemModal para mostrar el nuevo ítem */}
      <NewItemModal
        visible={newItemModalVisible}
        onClose={() => setNewItemModalVisible(false)}
        icon={<CoinsIcon height="50" width="50" />}
        name="10 Monedas"
        description=""
      />

      {modal2Visible && (
        <ConversationModal 
          visible={modal2Visible}  
          conversation={conversationContent}
          onClose={() => setModal2Visible(false)}
        />
      )}  


      {modalVisible && (
        <ConversationChoiceModal 
          visible={modalVisible}  
          conversation={conversationContent}
          onClose={() => setModalVisible(false)}
          onAccept={handleAccept}
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
    height: '40%',
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

export default BarScreen;
