import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Text,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import {
  MapIcon,
  ChestOpenIcon,
  MapInv1Icon,
  MapInv2Icon,
  MapInv3Icon,
  BagPackIcon,
  NoteBookIcon,
  DianaIcon,
  HearthIcon,
} from "../components/SvgExporter";
import Map1Modal from "../components/modal/map1modal";
import Map2Modal from "../components/modal/map2modal";
import BagPackModal from "../components/modal/bagpackmodal";
import NotesModal from "../components/modal/notesmodal";
import { NavigationProp, useNavigation } from "@react-navigation/native";

// Tipado para el estado de Redux
interface MaiaState {
  maiahealth: number;
  maiacurrenthealth: number;
}

interface RootState {
  maia: MaiaState;
}

// Tipado para las acciones del inventario
type InventoryItem = "key2" | "chestClosed" | "chestOpen";
type MapKey = "mapInv1" | "mapInv2" | "mapInv3";

// Tipado para el estado de los mapas
interface MapStates {
  mapInv1: boolean;
  mapInv2: boolean;
  mapInv3: boolean;
}

const windowWidth = Dimensions.get("window").width;

const Inventory: React.FC = () => {
  // Obtenemos la salud actual y la salud máxima desde Redux
  const maiaHealth = useSelector((state: RootState) => state.maia.maiahealth);
  const maiaCurrentHealth = useSelector(
    (state: RootState) => state.maia.maiacurrenthealth
  );

  // Estado para mostrar/ocultar las opciones del mapa
  const [showMapOptions, setShowMapOptions] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp<any>>();
  
  // Estado para manejar el estado de los mapas
  const [mapStates, setMapStates] = useState<MapStates>({
    mapInv1: true,
    mapInv2: false,
    mapInv3: false,
  });

  // Estados para manejar la visibilidad de los modales
  const [map1ModalVisible, setMap1ModalVisible] = useState<boolean>(false);
  const [map2ModalVisible, setMap2ModalVisible] = useState<boolean>(false);
  const [bagPackModalVisible, setBagPackModalVisible] = useState<boolean>(false);
  const [notesModalVisible, setNotesModalVisible] = useState<boolean>(false);

  // Alterna la visibilidad de las opciones del mapa
  const toggleMapOptions = (): void => {
    setShowMapOptions(!showMapOptions);
  };

  // Maneja la acción de cada ítem del inventario
  const handleItemPress = (item: InventoryItem): void => {
    const messages: Record<InventoryItem, string> = {
      key2: "Usaste la llave 2 🔑",
      chestClosed: "El cofre está cerrado 🔒",
      chestOpen: "Abriste el cofre 🎁",
    };
    Alert.alert("Inventario", messages[item]);
  };

  // Maneja la interacción con los mapas
  const handleMapPress = (mapKey: MapKey): void => {
    if (mapStates[mapKey]) {
      if (mapKey === "mapInv1") {
        setMap1ModalVisible(true);
      } else if (mapKey === "mapInv2") {
        setMap2ModalVisible(true);
      } else {
        Alert.alert("Inventario", `Usaste el ${mapKey} 🗺️`);
      }
    } else {
      // Lógica para mapas bloqueados, si corresponde
    }
  };

  return (
    <View style={styles.inventoryContainer}>
      {/* Barra de vida en la parte superior derecha */}
      <View style={styles.healthBar}>
        <View style={styles.healthContainer}>
          <HearthIcon height={18} width={18} style={styles.hearthIcon} />
          <Text style={styles.healthBarText}>
            {maiaCurrentHealth}/{maiaHealth}
          </Text>
        </View>
      </View>

      {/* Casillero 1 - Abrir la mochila */}
      <TouchableOpacity
        style={styles.slot}
        onPress={() => setBagPackModalVisible(true)}
      >
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
              <MapInv1Icon
                width={40}
                height={40}
                fill={mapStates.mapInv1 ? "black" : "gray"}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMapPress("mapInv2")}>
              <MapInv2Icon
                width={40}
                height={40}
                fill={mapStates.mapInv2 ? "black" : "gray"}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMapPress("mapInv3")}>
              <MapInv3Icon
                width={40}
                height={40}
                fill={mapStates.mapInv3 ? "black" : "gray"}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Casillero 3 - Abrir las notas */}
      <TouchableOpacity
        style={styles.slot}
        onPress={() => setNotesModalVisible(true)}
      >
        <NoteBookIcon width={40} height={40} />
      </TouchableOpacity>

      {/* Casillero 4 - Cofre abierto */}
      <TouchableOpacity
        style={styles.slot}
        onPress={() => handleItemPress("chestOpen")}
      >
        <DianaIcon width={40} height={40} />
      </TouchableOpacity>

      {/* Modales */}
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
      <BagPackModal
        visible={bagPackModalVisible}
        onClose={() => setBagPackModalVisible(false)}
      />
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
    width: windowWidth,
    height: '9%',
    backgroundColor: "rgba(0, 0, 0, 0.8)",
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
    top: '-80%',
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    gap: 15,
  },
  healthBar: {
    position: "absolute",
    top: '-40%',
    right: '5%',
    padding: '-3%',
    
  
  },
  healthContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  hearthIcon: {
    marginRight: '5%',
  },
  healthBarText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Inventory;
