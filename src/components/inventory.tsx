import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  MapIcon,
  BagPackIcon,
  NoteBookIcon,
  CoinsIcon,
  HandIcon,
  HandOneRingIcon,
  HandTwoRingsIcon,
  HandThreeRingsIcon,
} from "../components/SvgExporter";
import Map1Modal from "../components/modal/map1modal";
import BagPackModal from "../components/modal/bagpackmodal";
import NotesModal from "../components/modal/notesmodal";
import GridModal from "../components/modal/gridmodal"; // Modal que muestra el minimapa
import PlanillaGrid from "../components/planillagrid";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { font } from "./functions/fontsize";
import Objectives from "./objetivesbutton";
import GridTouchable from "./gridtouchable";
import HealthBar from "./healthbar";
import ManaBar from "./manabar";
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
  text: string;
}

const windowWidth = Dimensions.get("window").width;

const Inventory: React.FC<InventoryProps> = ({
  highlightedSquares,
  whiteSquare,
  tSquares,
  sSquares,
  minisSquares,
  mSquares,
  text,
}) => {
  const dispatch = useDispatch();
  const maiaHealth = useSelector((state: RootState) => state.maia.maiahealth);
  const maiaCurrentHealth = useSelector((state: RootState) => state.maia.maiacurrenthealth);
  const maiaManaLevel = useSelector((state: any) => state.maia.maiaManaLevel);
  const coins = useSelector((state: RootState) => state.coins.coins);

  const HAND_ICONS = [HandIcon, HandOneRingIcon, HandTwoRingsIcon, HandThreeRingsIcon];
  const HandLevelIcon = HAND_ICONS[Math.min(maiaManaLevel ?? 1, 3)];

  const navigation = useNavigation<NavigationProp<any>>();

  // Estados locales para modales
  const [map1ModalVisible, setMap1ModalVisible] = useState<boolean>(false);
  const [bagPackModalVisible, setBagPackModalVisible] = useState<boolean>(false);
  const [notesModalVisible, setNotesModalVisible] = useState<boolean>(false);
  const [gridModalVisible, setGridModalVisible] = useState<boolean>(false);
  const [planillaVisible, setPlanillaVisible] = useState<boolean>(false);

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
        {/* Barra de mana */}
        <View style={styles.manaBar}>
          <ManaBar />
        </View>

        {/* Barra de monedas */}
        <View style={styles.coinsBar}>
          <View style={styles.healthContainer}>
            <Text style={styles.healthBarText}>{coins}</Text>
            <CoinsIcon
              height={font(18)}
              width={font(18)}
              style={styles.hearthIcon}
              overflow='hidden'
            />
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
          <BagPackIcon width={font(40)} height={font(40)} overflow='hidden'/>
        </TouchableOpacity>

        {/* Casillero 2 - Mapa */}
        <TouchableOpacity style={styles.slot} onPress={() => setMap1ModalVisible(true)}>
          <MapIcon width={font(40)} height={font(40)} overflow='hidden' />
        </TouchableOpacity>

        {/* Casillero 3 - Notas */}
        <TouchableOpacity
          style={styles.slot}
          onPress={() => setNotesModalVisible(true)}
        >
          <NoteBookIcon width={font(38)} height={font(38)} overflow='hidden' />
        </TouchableOpacity>

       
        {/* Casillero 4 - Planilla */}
        <TouchableOpacity
          style={styles.slot}
          onPress={() => setPlanillaVisible(true)}
          
        >
          <HandLevelIcon width={font(50)} height={font(50)} overflow='hidden' />
        </TouchableOpacity>

        {/* Modales */}
        <Map1Modal
          visible={map1ModalVisible}
          onClose={() => setMap1ModalVisible(false)}
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
          text={text}
        />
        <PlanillaGrid
          visible={planillaVisible}
          onClose={() => setPlanillaVisible(false)}
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
    backgroundColor: "rgba(18, 7, 2, 0.97)",                               
    borderTopWidth: 2,
    borderTopColor: "#C8A84B", 
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  slot: {
    width: font(58),
    height: font(58),
    backgroundColor: "#6B2D0A",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#C8A84B",
    shadowColor: "#D4AF37",
    shadowOpacity: 0.6,
    shadowRadius: 4,

  },
  healthBar: {
    position: "absolute",
    top: "-40%",
    right: "0%",
    padding: "-3%",
  },
  manaBar: {
    position: "absolute",
    top: font(-45),
    left: "0%",
    padding: "-3%",
  },
  healthContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  hearthIcon: {
    marginLeft: font(3),
  },
  healthBarText: {
    color: "black",
    fontSize: font(19),
    fontWeight: "bold",
  },
  coinsBar: {
    position: "absolute",
    top: "-70%",
    right: "1%",
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
