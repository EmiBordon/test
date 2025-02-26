import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Animated, Alert } from 'react-native';
import { DoorIcon, Key1Icon, ChestCloseIcon, ArrowIcon, MaiaIcon } from '../../components/SvgExporter';
import Inventory from '../../components/inventory';

const icons = [
  { component: DoorIcon, height: 150, width: 150 },
  { component: Key1Icon, height: 60, width: 60 },
  { component: ChestCloseIcon, height: 100, width: 100 }
];

const TutorialScreen = () => {
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [maiaPosition] = useState(new Animated.Value(0));
  const [isNear, setIsNear] = useState(false);
  

  const handleNextIcon = () => {
    setCurrentIconIndex((prevIndex) => (prevIndex + 1) % icons.length);
  };

  const handlePrevIcon = () => {
    setCurrentIconIndex((prevIndex) => (prevIndex - 1 + icons.length) % icons.length);
  };

  const resetMaiaPosition = () => {
    Animated.timing(maiaPosition, {
      toValue: 0,
      duration: 1000, // Ajusta la velocidad del regreso
      useNativeDriver: true,
    }).start(() => setIsNear(false));
  };

  const moveMaiaToIcon = () => {
    Animated.timing(maiaPosition, {
      toValue: 1,
      duration: 1000, // Ajusta la velocidad de acercamiento
      useNativeDriver: true,
    }).start(() => setIsNear(true));
  };

  const handleIconPress = () => {
    if (!isNear) {
      moveMaiaToIcon();
    } else {
      Alert.alert('Item seleccionado');
    }
  };

  const { component: CurrentIcon, height, width } = icons[currentIconIndex];

  return (
    <View style={styles.container}>
      <Pressable style={styles.doorButton} onPress={handleIconPress}>
        <CurrentIcon height={height} width={width} />
      </Pressable>
      
      <View style={styles.sideIcons}>
        <Pressable style={styles.arrowButton} onPress={handlePrevIcon} onLongPress={resetMaiaPosition}>
          <ArrowIcon style={styles.leftArrow} height={50} width={50} />
        </Pressable>
        <Pressable style={styles.arrowButton} onPress={handleNextIcon} onLongPress={resetMaiaPosition}>
          <ArrowIcon height={50} width={50} />
        </Pressable>
      </View>
      
      <Animated.View style={[styles.maiaContainer, {
        transform: [{ translateY: maiaPosition.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -360], // Ajusta la distancia de movimiento
        }) }]
      }]}
      >
        <MaiaIcon height={160} width={160} />
      </Animated.View>
      <Inventory />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  doorButton: {
    position: 'absolute',
    top: '7%',
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
  },
});

export default TutorialScreen;
