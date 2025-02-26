import React from "react";
import { Modal, View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Map1Icon, HouseIcon } from "../SvgExporter"; 

const Map1Modal = ({ visible, onClose, navigation }) => { // 🔹 Recibe navigation como prop
  const { height } = Dimensions.get("window");
  const modalHeight = height * 0.7; 

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { height: modalHeight }]}>
          <View style={styles.mapContainer}>
            <Map1Icon width="136%" height="100%" style={styles.mapBackground} />
          </View>

          
          <TouchableOpacity 
            style={styles.iconHouse} 
            onPress={() => {
              onClose();  // 🔹 Cierra el modal antes de navegar
              navigation.navigate("Tutorial"); // ✅ Ahora navigation está definido
            }}
          >
            <HouseIcon width={70} height={70} />
          </TouchableOpacity>

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
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
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
  
  iconHouse: { 
    position: "absolute", 
    top: "65%",   
    left: "14%",  
    transform: [{ translateX: -30 }, { translateY: -30 }], 
    zIndex: 20, 
  },

  closeButton: { position: "absolute", top: 10, right: 10, zIndex: 10 },
  closeButtonInner: { backgroundColor: "rgba(255,255,255,0.8)", padding: 10, borderRadius: 5 },
  closeButtonBox: { width: 25, height: 25, justifyContent: "center", alignItems: "center" },
  closeButtonX: { position: "absolute", width: 30, height: 2, backgroundColor: "black", transform: [{ rotate: "45deg" }] },
});

export default Map1Modal;
