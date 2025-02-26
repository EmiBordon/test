import React, { useState } from "react";
import { Modal, View, TouchableOpacity, Text, StyleSheet, Dimensions, Alert } from "react-native";
import { 
  Map1Icon, HouseIcon, PrisionIcon, StoreIcon, RestaurantIcon, BigHouseIcon, CaveIcon 
} from "../SvgExporter"; 

const Map1Modal = ({ visible, onClose, navigation }) => {
  const { height } = Dimensions.get("window");
  const modalHeight = height * 0.7; 

  // Estado para manejar la primera interacción con cada ícono
  const [iconStates, setIconStates] = useState({
    house: false,
    prison: false,
    store: false,
    restaurant: false,
    bigHouse: false,
    cave: false,
  });

  // Función para manejar la pulsación de los íconos
  const handleIconPress = (iconKey, action) => {
    setIconStates(prevState => {
      // Resetear todos los estados y activar solo el ícono presionado
      const newState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = key === iconKey ? !prevState[iconKey] : false;
        return acc;
      }, {});

      return newState;
    });

    // Si ya estaba activo antes de presionar, ejecutar acción
    if (iconStates[iconKey]) {
      action();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { height: modalHeight }]}>

          {/* 🔹 Mapa de fondo */}
          <View style={styles.mapContainer}>
            <Map1Icon width="136%" height="100%" style={styles.mapBackground} />
          </View>

          {/* 🔹 Íconos interactivos con nombres dinámicos */}
          {[
            { key: "house", icon: <HouseIcon width={70} height={70} />, text: "Casa", style: styles.iconHouse, action: () => { onClose(); navigation.replace("Home"); } },
            { key: "prison", icon: <PrisionIcon width={70} height={70} />, text: "Prisión", style: styles.iconPrison, action: () => Alert.alert("Prisión", "Este es el ícono de la prisión") },
            { key: "store", icon: <StoreIcon width={70} height={70} />, text: "Tienda", style: styles.iconStore, action: () => Alert.alert("Tienda", "Este es el ícono de la tienda") },
            { key: "restaurant", icon: <RestaurantIcon width={70} height={70} />, text: "Bar", style: styles.iconRestaurant, action: () => Alert.alert("Restaurante", "Este es el ícono del restaurante") },
            { key: "bigHouse", icon: <BigHouseIcon width={80} height={80} />, text: "Mansión", style: styles.iconBigHouse, action: () => Alert.alert("Mansión", "Este es el ícono de la mansión") },
            { key: "cave", icon: <CaveIcon width={70} height={70} />, text: "Cueva", style: styles.iconCave, action: () => Alert.alert("Cueva", "Este es el ícono de la cueva") },
          ].map(({ key, icon, text, style, action }) => (
            <View key={key} style={style}>
              {/* Mostrar el nombre si es la primera pulsación */}
              {iconStates[key] && <View style={styles.nameTag}><Text style={styles.nameText}>{text}</Text></View>}

              <TouchableOpacity onPress={() => handleIconPress(key, action)}>
                {icon}
              </TouchableOpacity>
            </View>
          ))}

          {/* 🔹 Botón de cierre */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <View style={styles.closeButtonInner}>
              <TouchableOpacity onPress={onClose}>
                <View style={styles.closeButtonBox}>
                  <View style={styles.closeButtonX} />
                  <View style={[styles.closeButtonX, { transform: [{ rotate: "90deg" }] }]} />
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.5)", 
    justifyContent: "center", 
    alignItems: "center" 
  },
  modalContainer: { 
    width: "90%", 
    backgroundColor: "white", 
    borderRadius: 10, 
    overflow: "hidden", 
    alignItems: "center",
    borderWidth: 4, 
    borderColor: "black",
    justifyContent: "center",
  },
  mapContainer: { 
    width: "100%", 
    height: "100%", 
    top: "1%",   
    left: "-20%", 
    marginTop: '30%',
  },
  mapBackground: { position: "absolute", top: 0, left: 0 },
  
  // 🔹 Estilos de los íconos con posiciones personalizables
  iconHouse: { position: "absolute", top: "65%", left: "14%", transform: [{ translateX: -30 }, { translateY: -30 }], zIndex: 20 },
  iconPrison: { position: "absolute", top: "60%", left: "78%", transform: [{ translateX: -30 }, { translateY: -30 }], zIndex: 20 },
  iconStore: { position: "absolute", top: "48%", left: "44%", transform: [{ translateX: -30 }, { translateY: -30 }], zIndex: 20 },
  iconRestaurant: { position: "absolute", top: "34%", left: "30%", transform: [{ translateX: -30 }, { translateY: -30 }], zIndex: 20 },
  iconBigHouse: { position: "absolute", top: "44%", left: "85%", transform: [{ translateX: -40 }, { translateY: -40 }], zIndex: 20 },
  iconCave: { position: "absolute", top: "80%", left: "80%", transform: [{ translateX: -30 }, { translateY: -30 }], zIndex: 20 },

  // 🔹 Estilos para etiquetas de nombres
  nameTag: { 
    position: "absolute", 
    top: -20, 
    left: "50%", 
    transform: [{ translateX: -30 }], 
    backgroundColor: "black", 
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    borderRadius: 5, 
  },
  nameText: { 
    color: "white", 
    fontSize: 12, 
    fontWeight: "bold" 
  },

  closeButton: { position: "absolute", top: 10, right: 10, zIndex: 10 },
  closeButtonInner: { backgroundColor: "rgba(255,255,255,0.8)", padding: 10, borderRadius: 5 },
  closeButtonBox: { width: 25, height: 25, justifyContent: "center", alignItems: "center" },
  closeButtonX: { position: "absolute", width: 30, height: 2, backgroundColor: "black", transform: [{ rotate: "45deg" }] },
});

export default Map1Modal;
