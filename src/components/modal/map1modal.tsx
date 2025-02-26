import React, { useState } from "react";
import { Modal, View, TouchableOpacity, Text, StyleSheet, Dimensions, Alert } from "react-native";
import { 
  Map1Icon, HouseIcon, PrisionIcon, StoreIcon, RestaurantIcon, BigHouseIcon, CaveIcon, CrossIcon
} from "../SvgExporter"; 

const Map1Modal = ({ visible, onClose, navigation }) => {
  const { height } = Dimensions.get("window");
  const modalHeight = height * 0.7; 

  // Estado para manejar el ícono seleccionado
  const [selectedIcon, setSelectedIcon] = useState(null);

  // Configuración de cada ícono
  const iconsConfig = [
    { key: "house", icon: <HouseIcon width={70} height={70} />, text: "Casa", style: styles.iconHouse, action: () => { onClose(); navigation.replace("Home"); } },
    { key: "prison", icon: <PrisionIcon width={70} height={70} />, text: "Prisión", style: styles.iconPrison, action: () => Alert.alert("Prisión", "Este es el ícono de la prisión") },
    { key: "store", icon: <StoreIcon width={70} height={70} />, text: "Tienda", style: styles.iconStore, action: () => Alert.alert("Tienda", "Este es el ícono de la tienda") },
    { key: "restaurant", icon: <RestaurantIcon width={70} height={70} />, text: "Bar", style: styles.iconRestaurant, action: () => Alert.alert("Restaurante", "Este es el ícono del restaurante") },
    { key: "bigHouse", icon: <BigHouseIcon width={80} height={80} />, text: "Mansión", style: styles.iconBigHouse, action: () => Alert.alert("Mansión", "Este es el ícono de la mansión") },
    { key: "cave", icon: <CaveIcon width={70} height={70} />, text: "Cueva", style: styles.iconCave, action: () => Alert.alert("Cueva", "Este es el ícono de la cueva") },
  ];

  // Al presionar un ícono se guarda su key como seleccionado
  const handleIconPress = (iconKey) => {
    setSelectedIcon(iconKey);
  };

  // Función para resetear la selección
  const resetSelection = () => {
    setSelectedIcon(null);
  };

  // Buscar la configuración del ícono seleccionado
  const selectedIconConfig = iconsConfig.find(item => item.key === selectedIcon);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { height: modalHeight }]}>

          {/* Texto de confirmación en la parte superior */}
          {selectedIconConfig && (
            <View style={styles.topPromptContainer}>
              <Text style={styles.promptText}>
                ¿Deseas viajar a {selectedIconConfig.text}?
              </Text>
            </View>
          )}

          {/* Mapa de fondo */}
          <View style={styles.mapContainer}>
            <Map1Icon width="136%" height="100%" style={styles.mapBackground} />
          </View>

          {/* Íconos interactivos */}
          {iconsConfig.map(({ key, icon, text, style }) => (
            <View key={key} style={style}>
              {selectedIcon === key && (
                <View style={styles.nameTag}>
                  <Text style={styles.nameText}>{text}</Text>
                </View>
              )}
              <TouchableOpacity onPress={() => handleIconPress(key)}>
                {icon}
              </TouchableOpacity>
            </View>
          ))}

          {/* Botones de acción en la parte inferior */}
          {selectedIconConfig && (
            <View style={styles.topButtonsContainer}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => { 
                  selectedIconConfig.action();
                  resetSelection();
                }}>
                <Text style={styles.actionButtonText}>Ir</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={resetSelection}>
                <Text style={styles.actionButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Botón de cierre usando CrossIcon */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <CrossIcon width={30} height={30} />
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
  
  // Posicionamiento de los íconos
  iconHouse: { position: "absolute", top: "65%", left: "14%", transform: [{ translateX: -30 }, { translateY: -30 }], zIndex: 20 },
  iconPrison: { position: "absolute", top: "60%", left: "78%", transform: [{ translateX: -30 }, { translateY: -30 }], zIndex: 20 },
  iconStore: { position: "absolute", top: "48%", left: "44%", transform: [{ translateX: -30 }, { translateY: -30 }], zIndex: 20 },
  iconRestaurant: { position: "absolute", top: "34%", left: "30%", transform: [{ translateX: -30 }, { translateY: -30 }], zIndex: 20 },
  iconBigHouse: { position: "absolute", top: "44%", left: "85%", transform: [{ translateX: -40 }, { translateY: -40 }], zIndex: 20 },
  iconCave: { position: "absolute", top: "80%", left: "80%", transform: [{ translateX: -30 }, { translateY: -30 }], zIndex: 20 },

  // Estilos para el prompt en la parte superior
  topPromptContainer: {
    position: "absolute",
    top: '5%',
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    zIndex: 30,
  },
  promptText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  // Estilos para los botones en la parte inferior
  topButtonsContainer: {
    position: "absolute",
    top: '12%',
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 30,
  },
  actionButton: {
    backgroundColor: "black",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  actionButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },

  closeButton: { position: "absolute", top: 10, right: 10, zIndex: 10 },

  // Estilos para el tag con el nombre sobre cada ícono
  nameTag: { 
    position: "absolute", 
    top: -20, 
    left: "50%", 
    transform: [{ translateX: -30 }],
    backgroundColor: "black", 
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    borderRadius: 5,
    zIndex: 30,
  },
  nameText: { 
    color: "white", 
    fontSize: 13, 
    fontWeight: "bold" 
  },
});

export default Map1Modal;
