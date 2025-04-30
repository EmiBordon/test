import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Text,
  Dimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
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
  CoinsIcon,
  RadarIcon,
} from "../components/SvgExporter";
import Map1Modal from "../components/modal/map1modal";
import Map2Modal from "../components/modal/map2modal";
import BagPackModal from "../components/modal/bagpackmodal";
import NotesModal from "../components/modal/notesmodal";
import GridModal from "../components/modal/gridmodal"; // Modal que muestra el minimapa
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { font } from "./functions/fontsize";
import Objectives from "./objetivesbutton";
import { incrementObjective } from "../redux/objectivesSlice";
import GridTouchable from "./gridtouchable";
import HealthBar from "./healthbar";
// Tipado para el estado de Redux
interface MaiaState {
  maiahealth: number;
  maiacurrenthealth: number;
}
interface CoinsState {
  coins: number;
}
interface LocationsState {
  map1: boolean;
  map2: boolean;
  map3: boolean;
}
interface RootState {
  maia: MaiaState;
  coins: CoinsState;
  locations: LocationsState;
}

// Props para Inventory: se requieren highlightedSquares y whiteSquare
interface InventoryProps {
  highlightedSquares: number[];
  whiteSquare: number;
  sSquares:number;
  minisSquares:number;
  tSquares:number;
  mSquares:number; 
}

const windowWidth = Dimensions.get("window").width;

const Inventory: React.FC<InventoryProps> = ({
  highlightedSquares,
  whiteSquare,
  tSquares,
  sSquares,
  minisSquares,
  mSquares,
}) => {
  const dispatch = useDispatch();
  const maiaHealth = useSelector((state: RootState) => state.maia.maiahealth);
  const maiaCurrentHealth = useSelector((state: RootState) => state.maia.maiacurrenthealth);
  const coins = useSelector((state: RootState) => state.coins.coins);

  // Estados de mapas desde Redux
  const map1 = useSelector((state: RootState) => state.locations.map1);
  const map2 = useSelector((state: RootState) => state.locations.map2);
  const map3 = useSelector((state: RootState) => state.locations.map3);

  const [showMapOptions, setShowMapOptions] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp<any>>();

  // Estados locales para modales
  const [map1ModalVisible, setMap1ModalVisible] = useState<boolean>(false);
  const [map2ModalVisible, setMap2ModalVisible] = useState<boolean>(false);
  const [bagPackModalVisible, setBagPackModalVisible] = useState<boolean>(false);
  const [notesModalVisible, setNotesModalVisible] = useState<boolean>(false);
  const [gridModalVisible, setGridModalVisible] = useState<boolean>(false);

  const toggleMapOptions = (): void => {
    setShowMapOptions(!showMapOptions);
  };

  const handleMapPress = (mapKey: "map1" | "map2" | "map3"): void => {
    const mapStates = { map1, map2, map3 };
    if (mapStates[mapKey]) {
      if (mapKey === "map1") {
        setMap1ModalVisible(true);
        setShowMapOptions(!showMapOptions);
      } else if (mapKey === "map2") {
        setMap2ModalVisible(true);
        setShowMapOptions(!showMapOptions);
      } else {
        Alert.alert("Inventario", `Usaste el ${mapKey} 🗺️`);
      }
    } else {
      // Mapa bloqueado
    }
  };

  return (
    <>
    <GridTouchable
    onPress={() => setGridModalVisible(true)}
    highlightedSquares={highlightedSquares}
    whiteSquare={whiteSquare}
    sSquares={minisSquares}
    mSquares={mSquares}
    tSquares={tSquares}
    />
      <View style={styles.objectivesContainer}>
        <Objectives />
      </View>
      <View style={styles.inventoryContainer}>
        {/* Barra de monedas */}
        <View style={styles.coinsBar}>
          <View style={styles.healthContainer}>
            <CoinsIcon
              height={font(18)}
              width={font(18)}
              style={styles.hearthIcon}
            />
            <Text style={styles.healthBarText}>{coins}</Text>
          </View>
        </View>

        {/* Barra de vida */}
        <View style={styles.healthBar}>
          <HealthBar/>
        </View>

        {/* Casillero 1 - Mochila */}
        <TouchableOpacity
          style={styles.slot}
          onPress={() => setBagPackModalVisible(true)}
        >
          <BagPackIcon width={font(40)} height={font(40)} />
        </TouchableOpacity>

        {/* Casillero 2 - Mapas */}
        <View style={styles.mapContainer}>
          <TouchableOpacity style={styles.slot} onPress={toggleMapOptions}>
            <MapIcon width={font(40)} height={font(40)} />
          </TouchableOpacity>
          {showMapOptions && (
            <View style={styles.mapOptions}>
              <TouchableOpacity onPress={() => handleMapPress("map1")}>
                <MapInv1Icon
                  width={font(38)}
                  height={font(38)}
                  fill={map1 ? "black" : "gray"}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleMapPress("map2")}>
                <MapInv2Icon
                  width={font(38)}
                  height={font(38)}
                  fill={map2 ? "black" : "gray"}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleMapPress("map3")}>
                <MapInv3Icon
                  width={font(38)}
                  height={font(38)}
                  fill={map3 ? "black" : "gray"}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Casillero 3 - Notas */}
        <TouchableOpacity
          style={styles.slot}
          onPress={() => setNotesModalVisible(true)}
        >
          <NoteBookIcon width={font(38)} height={font(38)} />
        </TouchableOpacity>

       
        {/* Otro casillero adicional */}
        <TouchableOpacity style={styles.slot}>
          {/* Contenido o funcionalidad a futuro */}
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
        <GridModal
          visible={gridModalVisible}
          onClose={() => setGridModalVisible(false)}
          highlightedSquares={highlightedSquares}
          whiteSquare={whiteSquare}
          sSquares={sSquares}
          mSquares={mSquares}
          tSquares={tSquares}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  inventoryContainer: {
    position: "absolute",
    bottom: 0,
    width: windowWidth,
    height: "9%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  slot: {
    width: font(58),
    height: font(58),
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
    top: "-80%",
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    gap: font(15),
  },
  healthBar: {
    position: "absolute",
    top: "-40%",
    right: "0%",
    padding: "-3%",
  },
  healthContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  hearthIcon: {
    marginRight: "5%",
  },
  healthBarText: {
    color: "black",
    fontSize: font(19),
    fontWeight: "bold",
  },
  coinsBar: {
    position: "absolute",
    top: "-70%",
    right: "5%",
    padding: "-3%",
  },
  objectivesContainer: {
    position: "absolute",
    top: "9%",
    alignItems: "center",
    left: "3%",
  },
});

export default Inventory;
