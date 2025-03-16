import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Alert, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaiaIcon, ArrowIcon, GermisIcon, JoxIcon, GorjoxIcon, SignIcon } from '../../components/SvgExporter';
import Inventory from '../../components/inventory';
import Location from '../../components/functions/location';
import ConversationModal from '../../components/modal/conversationmodal';
import { conversations, Conversation } from '../../components/functions/conversations';
import { useSelector, useDispatch } from 'react-redux';
import AnimatedArrow from '../../components/functions/animatedarrow';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const icons = [
  { 
    component: GermisIcon, 
    height: SCREEN_HEIGHT * 0.15, 
    width: SCREEN_WIDTH * 0.3, 
    style: { top: '35%', left: '10%' },
  },
  { 
    component: JoxIcon, 
    height: SCREEN_HEIGHT * 0.18, 
    width: SCREEN_WIDTH * 0.3,  
    style: { top: '35%', left: '60%' },
  },
  { 
    component: GorjoxIcon, 
    height: SCREEN_HEIGHT * 0.5, 
    width: SCREEN_WIDTH * 0.5,  
    style: { top: '20%', left: '40%' },
  }
];

// Objeto para controlar el SignIcon
const signIconData = {
  component: SignIcon,
  height: SCREEN_HEIGHT * 0.25, // Puedes ajustar este valor
  width: SCREEN_WIDTH * 0.25,   // Puedes ajustar este valor
  style: { top: '35%', left: '70%' } // Ajusta la posición según tus necesidades
};

const CaveScreen = () => {
  const navigation = useNavigation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [conversationContent, setConversationContent] = useState<Conversation | null>(null);
  
  const dispatch = useDispatch();
  const handleOpenModal = () => {
      setModalVisible(true);
      setConversationContent(conversations.sign1);
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

  const handleIconPress = () => {
    Alert.alert('Item seleccionado');
  };

  // Si la ubicación es "Entrada de La Cueva" (índice 0), no se muestra ninguno de los otros íconos.
  // En caso contrario, usamos currentLocationIndex - 1 para acceder al ícono correcto.
  const iconIndex = currentLocationIndex - 1;
  const currentIconData = iconIndex >= 0 ? icons[iconIndex] : null;

  return (
    <View style={styles.container}>
      {/* Fondo de la cueva */}
      <Image 
        source={backgroundImages[currentImageIndex]} 
        style={styles.backgroundImage} 
      />
      
      {/* Botón para avanzar a la siguiente imagen */}
      <Pressable style={styles.buttonImage} onPress={handleNextImage} />

      {/* SignIcon controlado igual que los demás íconos */}
      {currentImageIndex === 0 && (
        <Pressable style={[styles.iconButton, signIconData.style]} onPress={handleOpenModal}>
          <signIconData.component height={signIconData.height} width={signIconData.width} />
        </Pressable>
      )}

      {/* Ícono de ubicación según la lógica existente */}
      {currentIconData && (
        <Pressable style={[styles.iconButton, currentIconData.style]} onPress={handleIconPress}>
          <currentIconData.component height={currentIconData.height} width={currentIconData.width} />
        </Pressable>
      )}

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
      <Location text={locationName[currentLocationIndex].text} />
     

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
    height: '30%',
  },
  buttonImage: {
    width: '100%',
    height: '30%',
  },
  iconButton: {
    position: 'absolute',
  },
  sideIcons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    position: 'absolute',
    top: '70%',
    paddingHorizontal: '2%',
  },
  leftArrow: {
    transform: [{ rotate: "90deg" }],
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
  animatedArrow: {
    position: 'absolute',
    top: '35%',
    left: '55%',
  },
});

export default CaveScreen;
