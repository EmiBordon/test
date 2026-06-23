import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
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
import GridModal from "../components/modal/gridmodal";
import PlanillaGrid from "../components/planillagrid";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { font } from "./functions/fontsize";
import Objectives from "./objetivesbutton";
import GridTouchable from "./gridtouchable";
import HealthBar from "./healthbar";
import ManaBar from "./manabar";
import MenuButton from "./functions/menubutton";

interface CoinsState {
  coins: number;
}
interface RootState {
  coins: CoinsState;
}

interface InventoryProps {
  highlightedSquares: number[];
  whiteSquare: number;
  sSquares: number;
  minisSquares: number;
  tSquares: number;
  mSquares: number;
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
  const maiaManaLevel = useSelector((state: any) => state.maia.maiaManaLevel);
  const coins = useSelector((state: RootState) => state.coins.coins);

  const HAND_ICONS = [HandIcon, HandOneRingIcon, HandTwoRingsIcon, HandThreeRingsIcon];
  const HandLevelIcon = HAND_ICONS[Math.min(maiaManaLevel ?? 1, 3)];

  const navigation = useNavigation<NavigationProp<any>>();

  const [map1ModalVisible, setMap1ModalVisible] = useState<boolean>(false);
  const [bagPackModalVisible, setBagPackModalVisible] = useState<boolean>(false);
  const [notesModalVisible, setNotesModalVisible] = useState<boolean>(false);
  const [gridModalVisible, setGridModalVisible] = useState<boolean>(false);
  const [planillaVisible, setPlanillaVisible] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const handleGoHome = () => {
    setShowMenu(false);
    navigation.replace('Home');
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


      {/* Barra superior */}
      <View style={styles.topBar}>
        <MenuButton
          onPress={() => setShowMenu(!showMenu)}
          style={styles.menuButtonInBar}
        />
        <View style={styles.topBarStats}>
          <HealthBar />
          <View style={styles.topBarDivider} />
          <ManaBar />
          <View style={styles.topBarDivider} />
          <View style={styles.coinsWrapper}>
            <CoinsIcon height={font(18)} width={font(18)} overflow='hidden' />
            <Text style={styles.coinsText}>{coins}</Text>
          </View>
        </View>
      </View>

      {/* Dropdown del menú */}
      {showMenu && (
        <View style={styles.menuDropdown}>
          <Text style={styles.menuDropdownTitle}>Ir al Menu</Text>
          <View style={styles.menuDropdownButtons}>
            <TouchableOpacity style={styles.menuDropdownButton} onPress={handleGoHome}>
              <Text style={styles.menuDropdownButtonText}>Aceptar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuDropdownButton} onPress={() => setShowMenu(false)}>
              <Text style={styles.menuDropdownButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Barra de slots inferior */}
      <View style={styles.inventoryContainer}>
        <TouchableOpacity style={styles.slot} onPress={() => setBagPackModalVisible(true)}>
          <BagPackIcon width={font(40)} height={font(40)} overflow='hidden' />
        </TouchableOpacity>

        <TouchableOpacity style={styles.slot} onPress={() => setMap1ModalVisible(true)}>
          <MapIcon width={font(40)} height={font(40)} overflow='hidden' />
        </TouchableOpacity>

        <TouchableOpacity style={styles.slot} onPress={() => setNotesModalVisible(true)}>
          <NoteBookIcon width={font(38)} height={font(38)} overflow='hidden' />
        </TouchableOpacity>

        <TouchableOpacity style={styles.slot} onPress={() => setPlanillaVisible(true)}>
          <HandLevelIcon width={font(50)} height={font(50)} overflow='hidden' />
        </TouchableOpacity>

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
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(18, 7, 2, 0.97)",
    borderBottomWidth: 2,
    borderBottomColor: "#C8A84B",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: font(10),
    paddingVertical: font(4),
    elevation: 5,
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    zIndex: 5,
  },
  menuButtonInBar: {
    position: "relative",
    top: 0,
    left: 0,
    zIndex: 0,
    marginRight: font(8),
  },
  topBarStats: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  topBarDivider: {
    width: 1,
    height: font(35),
    backgroundColor: "#C8A84B",
    opacity: 0.6,
  },
  coinsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: font(4),
  },
  coinsText: {
    color: "#C8A84B",
    fontSize: font(16),
    fontWeight: "bold",
  },
  menuDropdown: {
    position: "absolute",
    top: "9%",
    left: "2%",
    backgroundColor: "rgba(18, 7, 2, 0.97)",
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#C8A84B",
    elevation: 10,
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    zIndex: 10,
  },
  menuDropdownTitle: {
    fontSize: font(14),
    marginBottom: 10,
    fontWeight: "bold",
    color: "#C8A84B",
  },
  menuDropdownButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  menuDropdownButton: {
    backgroundColor: "#6B2D0A",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#C8A84B",
    shadowColor: "#C8A84B",
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  menuDropdownButtonText: {
    color: "#C8A84B",
    fontSize: font(13),
    fontWeight: "bold",
  },
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
  objectivesContainer: {
    position: "absolute",
    top: "9%",
    alignItems: "center",
    left: "3%",
  },
});

export default Inventory;
