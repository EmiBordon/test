import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Alert, Modal } from "react-native";
import { 
  MapIcon, ChestOpenIcon, 
  MapInv1Icon, MapInv2Icon, MapInv3Icon, BagPackIcon, NoteBookIcon, DianaIcon
} from "../components/SvgExporter"; // Importa los íconos
import Map1Modal from "../components/modal/map1modal"; // Importa el modal del mapa 1
import Map2Modal from "../components/modal/map2modal"; // Importa el modal del mapa 2
import BagPackModal from "../components/modal/bagpackmodal"; // Importa el modal de la mochila
import NotesModal from "../components/modal/notesmodal"; // Importa el modal de las notas
import { useNavigation } from "@react-navigation/native";

const Inventory = () => {
  // Estado para manejar la visibilidad de los íconos adicionales del mapa
  const [showMapOptions, setShowMapOptions] = useState(false);
  const navigation = useNavigation();
  // Estado para manejar si los mapas están desbloqueados o bloqueados
  const [mapStates, setMapStates] = useState({
    mapInv1: true,
    mapInv2: false,
    mapInv3: false,
  });

  // Estados para manejar la visibilidad de los modales
  const [map1ModalVisible, setMap1ModalVisible] = useState(false);
  const [map2ModalVisible, setMap2ModalVisible] = useState(false);
  const [bagPackModalVisible, setBagPackModalVisible] = useState(false);
  const [notesModalVisible, setNotesModalVisible] = useState(false);

  // Función para manejar el despliegue de los íconos
  const toggleMapOptions = () => {
    setShowMapOptions(!showMapOptions);
  };

  // Función que maneja la acción de cada casillero
  const handleItemPress = (item) => {
    const messages = {
      key2: "Usaste la llave 2 🔑",
      chestClosed: "El cofre está cerrado 🔒",
      chestOpen: "Abriste el cofre 🎁",
    };
    Alert.alert("Inventario", messages[item]);
  };

  // Función para manejar la interacción con los mapas
  const handleMapPress = (mapKey) => {
    if (mapStates[mapKey]) {
      if (mapKey === "mapInv1") {
        setMap1ModalVisible(true); // Abre Map1Modal
      } else if (mapKey === "mapInv2") {
        setMap2ModalVisible(true); // Abre Map2Modal
      } else {
        Alert.alert("Inventario", `Usaste el ${mapKey} 🗺️`);
      }
    } else {
      // Lógica para mapas bloqueados, si corresponde
    }
  };

  return (
    <View style={styles.inventoryContainer}>
      {/* Casillero 1 - BagPackIcon para abrir la mochila */}
      <TouchableOpacity style={styles.slot} onPress={() => setBagPackModalVisible(true)}>
        <BagPackIcon width={40} height={40} />
      </TouchableOpacity>

      {/* Casillero 2 - Mapa con opciones */}
      <View style={styles.mapContainer}>
        <TouchableOpacity style={styles.slot} onPress={toggleMapOptions}>
          <MapIcon width={40} height={40} />
        </TouchableOpacity>
        {showMapOptions && (
          <View style={styles.mapOptions}>
            <TouchableOpacity onPress={() => handleMapPress("mapInv1")}>
              <MapInv1Icon width={40} height={40} fill={mapStates.mapInv1 ? "black" : "gray"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMapPress("mapInv2")}>
              <MapInv2Icon width={40} height={40} fill={mapStates.mapInv2 ? "black" : "gray"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMapPress("mapInv3")}>
              <MapInv3Icon width={40} height={40} fill={mapStates.mapInv3 ? "black" : "gray"} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Casillero 3 - NoteBookIcon para abrir las notas */}
      <TouchableOpacity style={styles.slot} onPress={() => setNotesModalVisible(true)}>
        <NoteBookIcon width={40} height={40} />
      </TouchableOpacity>

      {/* Casillero 4 - Cofre abierto */}
      <TouchableOpacity style={styles.slot} onPress={() => handleItemPress("chestOpen")}>
        <DianaIcon width={40} height={40} />
      </TouchableOpacity>

      {/* Modales de los mapas */}
      <Map1Modal 
        visible={map1ModalVisible} 
        onClose={() => setMap1ModalVisible(false)} 
        navigation={navigation} 
      />
      <Map2Modal 
        visible={map2ModalVisible} 
        onClose={() => setMap2ModalVisible(false)} 
        navigation={navigation}
      />
      
      {/* Modal de la mochila */}
      <BagPackModal 
        visible={bagPackModalVisible} 
        onClose={() => setBagPackModalVisible(false)} 
      />

      {/* Modal de las notas */}
      <NotesModal 
        visible={notesModalVisible} 
        onClose={() => setNotesModalVisible(false)} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inventoryContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 70,
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Fondo oscuro semi-transparente
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  slot: {
    width: 60,
    height: 60,
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "black",
  },
  mapContainer: {
    alignItems: "center",
  },
  mapOptions: {
    position: "absolute",
    top: -50,
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    gap: 15,
  },
});

export default Inventory;
