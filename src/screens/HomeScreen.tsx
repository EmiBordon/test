import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";


import { FountainIcon, PillsIcon, CoinsIcon } from "../components/SvgExporter";
import ResetButton from "../components/functions/resetbutton";
import ManaBar from "../components/manabar";
import {
  incrementMaiaMana,
  decrementMaiaMana,
  incrementMaiaManaLevel,
  decrementMaiaManaLevel,
} from "../redux/maiaSlice";
// Importamos nuestro CodeModal y DiceModal
import CodeModal from "../components/modal/codemodal";
import DiceModal from "../components/modal/dicemodal";
import PlanillaGrid from "../components/planillagrid";

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [codeModalVisible, setCodeModalVisible] = useState<boolean>(false);
  const [diceModalVisible, setDiceModalVisible] = useState<boolean>(false);
  const [planillaVisible, setPlanillaVisible] = useState<boolean>(false);
  const [showResetButton, setShowResetButton] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Obtenemos los estados que queremos guardar/restaurar
  const maiaMana = useSelector((state: any) => state.maia.maiaMana);
  const maiaManaLevel = useSelector((state: any) => state.maia.maiaManaLevel);

  const healing = useSelector((state: any) => state.healing);
  const maia = useSelector((state: any) => state.maia);
  const weapons = useSelector((state: any) => state.weapons);
  const backup = useSelector((state: any) => state.backup);

  const handleLongPressIn = () => {
    timerRef.current = setTimeout(() => {
      setShowResetButton(true);
    }, 800); // 3 segundos
  };

  const handleLongPressOut = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Maia y La Fuente</Text>
      <FountainIcon height={"25%"} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {navigation.replace("Tutorial");}}
        onPressIn={handleLongPressIn}
        onPressOut={handleLongPressOut}
      >
        <Text style={styles.buttonText}>Jugar Demo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.diceButton]}
        onPress={() => setDiceModalVisible(true)}
      >
        <Text style={styles.buttonText}>Probar Dado</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.planillaButton]}
        onPress={() => setPlanillaVisible(true)}
      >
        <Text style={styles.buttonText}>Probar Planilla</Text>
      </TouchableOpacity>

      {/* --- TEST: Mana --- */}
      <View style={styles.testSection}>
        <Text style={styles.testLabel}>Mana ({maiaMana})</Text>
        <View style={styles.testRow}>
          <TouchableOpacity style={styles.testBtn} onPress={() => dispatch(decrementMaiaMana(1))}>
            <Text style={styles.testBtnText}>-</Text>
          </TouchableOpacity>
          <ManaBar />
          <TouchableOpacity style={styles.testBtn} onPress={() => dispatch(incrementMaiaMana(1))}>
            <Text style={styles.testBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.testLabel}>Mana Level ({maiaManaLevel})</Text>
        <View style={styles.testRow}>
          <TouchableOpacity style={styles.testBtn} onPress={() => dispatch(decrementMaiaManaLevel(1))}>
            <Text style={styles.testBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.testValue}>{maiaManaLevel}</Text>
          <TouchableOpacity style={styles.testBtn} onPress={() => dispatch(incrementMaiaManaLevel(1))}>
            <Text style={styles.testBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showResetButton && <ResetButton />}

      <DiceModal
        visible={diceModalVisible}
        onClose={() => setDiceModalVisible(false)}
      />

      <PlanillaGrid
        visible={planillaVisible}
        onClose={() => setPlanillaVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
    marginBottom: "10%",
    marginTop: "20%",
    fontFamily: "serif",
  },
  button: {
    marginTop: "5%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 3,
    borderColor: "#000",
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  diceButton: {
    marginTop: "3%",
    borderColor: "#4CAF50",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
  },
  planillaButton: {
    marginTop: "3%",
    borderColor: "#4A90D9",
    backgroundColor: "rgba(74, 144, 217, 0.1)",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 20,
  },
  testSection: {
    marginTop: "5%",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "rgba(100, 100, 255, 0.05)",
  },
  testLabel: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
  testRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  testBtn: {
    width: 36,
    height: 36,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  testBtnText: {
    fontSize: 22,
    fontWeight: "bold",
    lineHeight: 26,
  },
  testValue: {
    fontSize: 22,
    fontWeight: "bold",
    minWidth: 30,
    textAlign: "center",
  },
});

export default HomeScreen;
