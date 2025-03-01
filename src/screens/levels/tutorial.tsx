import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Alert, Image } from 'react-native';
import { DoorIcon, MattIcon, ChestCloseIcon, ArrowIcon, MaiaIcon } from '../../components/SvgExporter';
import Inventory from '../../components/inventory';
import Location from '../../components/functions/location';
import ConversationModal from "../../components/modal/conversationmodal"; // Asegúrate de que la ruta sea correcta
import { conversations } from "../../components/functions/conversations";
import { useSelector, useDispatch } from 'react-redux';
import { setMattState } from '../../redux/mattSlice';

const icons = [
  { 
    component: MattIcon, 
    height: 150, 
    width: 150, 
    style: { top: '30%', left: '10%' } 
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

const TutorialScreen = () => {
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [conversationContent, setConversationContent] = useState(null);
  
  const dispatch = useDispatch();
  const mattState = useSelector(state => state.matt.value);

  const handleNextIcon = () => {
    setCurrentIconIndex((prevIndex) => (prevIndex + 1) % icons.length);
  };

  const handlePrevIcon = () => {
    setCurrentIconIndex((prevIndex) => (prevIndex - 1 + icons.length) % icons.length);
  };

  const handleIconPress = () => {
    // Verificamos si el ícono actual es el MattIcon
    const { component: CurrentIcon } = icons[currentIconIndex];
    if (CurrentIcon === MattIcon) {
      if (mattState === 0) {
        // Si el estado es 0, se muestra la conversación 1 y se cambia el estado a 1
        setConversationContent(conversations.mattconv1);
        dispatch(setMattState(1));
        setModalVisible(true);
      } else if (mattState === 1) {
        // Si el estado ya es 1, se muestra la conversación 2 sin cambiar el estado
        setConversationContent(conversations.mattconv2);
        setModalVisible(true);
      }
    } else {
      Alert.alert('Item seleccionado');
    }
  };

  const { component: CurrentIcon, height, width, style: iconStyle } = icons[currentIconIndex];

  return (
    <View style={styles.container}>
      {/* Imagen de fondo */}
      <Image source={require('../../images/floor2.jpg')} style={styles.backgroundImage} />

      {/* Ícono principal configurable */}
      <Pressable style={[styles.iconButton, iconStyle]} onPress={handleIconPress}>
        <CurrentIcon height={height} width={width} />
      </Pressable>

      {/* Botones para navegar entre íconos */}
      <View style={styles.sideIcons}>
        <Pressable style={styles.arrowButton} onPress={handlePrevIcon}>
          <ArrowIcon style={styles.leftArrow} height={50} width={50} />
        </Pressable>
        <Pressable style={styles.arrowButton} onPress={handleNextIcon}>
          <ArrowIcon height={50} width={50} />
        </Pressable>
      </View>

      {/* MaiaIcon se muestra de forma estática */}
      <View style={styles.maiaContainer}>
        <MaiaIcon height={160} width={160} />
      </View>

      <Inventory />
      <Location text="Casa de los River" />

      {/* Modal de conversación */}
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
