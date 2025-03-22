import React, { useState } from "react";
import { Modal, View, TouchableOpacity, Text, StyleSheet, Dimensions, Alert } from "react-native";
import { 
  Map1Icon, HouseIcon, PrisionIcon, StoreIcon, RestaurantIcon, BigHouseIcon, CaveIcon, CrossIcon, PawnShopIcon
} from "../SvgExporter"; 
import { font } from "../functions/fontsize";

const Map1Modal = ({ visible, onClose, navigation }) => {
  const { height } = Dimensions.get("window");
  const modalHeight = height * 0.7; 

  // Estado para manejar el ícono seleccionado
  const [selectedIcon, setSelectedIcon] = useState(null);

  // Configuración de cada ícono
  const iconsConfig = [
    { key: "house", icon: <HouseIcon width={font(55)} height={font(55)} />, text: "Casa", style: styles.iconHouse, action: () => { onClose(); navigation.replace("Tutorial"); } },
    { key: "prison", icon: <PrisionIcon width={font(60)} height={font(60)} />, text: "Prisión", style: styles.iconPrison, action: () => Alert.alert("Prision no disponible en la demo") },
    { key: "store", icon: <StoreIcon width={font(50)} height={font(50)} />, text: "Tienda", style: styles.iconStore, action: () => { onClose(); navigation.replace("Shop"); } },
    { key: "restaurant", icon: <RestaurantIcon width={font(55)} height={font(55)} />, text: "Bar", style: styles.iconRestaurant, action: () => { onClose(); navigation.replace("Bar"); } },
    { key: "bigHouse", icon: <BigHouseIcon width={font(65)} height={font(65)} />, text: "Mansión", style: styles.iconBigHouse, action: () => Alert.alert("Mansion no disponible en la demo") },
    { key: "cave", icon: <CaveIcon width={font(40)} height={font(40)} />, text: "Cueva", style: styles.iconCave, action: () => { onClose(); navigation.replace("Cave"); } },
    { key: "pawnShop", icon: <PawnShopIcon width={font(55)} height={font(55)} />, text: "Joyeria", style: styles.iconPawnShop, action: () => { onClose(); navigation.replace("PawnShop"); } },
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
            <Map1Icon width="120%" height="100%" style={styles.mapBackground} />
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
          <TouchableOpacity style={styles.closeButton} onPress={() => { 
                  onClose();
                  resetSelection();
                }}>
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
    width: "95%", 
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
    //top: "1%",   
    left: "-15%", 
    marginTop: '30%',
  },
  mapBackground: { position: "absolute", top: 0, left: 0 },
  
  // Posicionamiento de los íconos
  iconHouse: { position: "absolute", top: "35%", left: "9%", transform: [{ translateX: -30 }, { translateY: -30 }], zIndex: 20 },
  iconPrison: { position: "absolute", top: "68%", left: "77%", transform: [{ translateX: -30 }, { translateY: -30 }], zIndex: 20 },
  iconStore: { position: "absolute", top: "58%", left: "55%", transform: [{ translateX: -30 }, { translateY: -30 }], zIndex: 20 },
  iconRestaurant: { position: "absolute", top: "40%", left: "33%", transform: [{ translateX: -30 }, { translateY: -30 }], zIndex: 20 },
  iconBigHouse: { position: "absolute", top: "35%", left: "88%", transform: [{ translateX: -40 }, { translateY: -40 }], zIndex: 20 },
  iconCave: { position: "absolute", top: "70%", left: "42%", transform: [{ translateX: -30 }, { translateY: -30 }], zIndex: 20 },
  iconPawnShop: { position: "absolute", top: "84%", left: "74%", transform: [{ translateX: -30 }, { translateY: -30 }], zIndex: 20 },
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
    fontSize: font(18),
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
    fontSize: font(15),
    fontWeight: "bold",
  },

  closeButton: { position: "absolute", top: 10, right: 10, zIndex: 10 },

  // Estilos para el tag con el nombre sobre cada ícono
  nameTag: { 
    position: "absolute", 
    bottom: "100%", 
    left: "55%", 
    transform: [{ translateX: -30 }],
    backgroundColor: "black", 
    paddingHorizontal: font(2), 
    paddingVertical: font(3), 
    borderRadius: 5,
    //zIndex: 90,
  },
  nameText: { 
    color: "white", 
    fontSize: font(13), 
    fontWeight: "bold" 
  },
});

export default Map1Modal;
