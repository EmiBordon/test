import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";

// Redux slices
import { incrementGrapes, incrementHealthPotion, incrementBigHealthPotion, incrementPills, setHealingState } from "../redux/healingSlice";
import { setMaiaState } from "../redux/maiaSlice";
import { setWeaponsState } from "../redux/weaponsSlice";
import { saveBackup, restoreBackup } from "../redux/backupSlice";

// Otros imports
import ConversationModal from "../components/modal/conversationmodal";
import { conversations } from "../components/functions/conversations";
import { FountainIcon, PillsIcon, CoinsIcon } from "../components/SvgExporter";
import ResetButton from "../components/functions/resetbutton";
// Importamos nuestro CodeModal
import CodeModal from "../components/modal/codemodal";

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [codeModalVisible, setCodeModalVisible] = useState<boolean>(false);
  const [showResetButton, setShowResetButton] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Obtenemos los estados que queremos guardar/restaurar
  const healing = useSelector((state: any) => state.healing);
  const maia = useSelector((state: any) => state.maia);
  const weapons = useSelector((state: any) => state.weapons);
  const backup = useSelector((state: any) => state.backup);

  const handleLongPressIn = () => {
    timerRef.current = setTimeout(() => {
      setShowResetButton(true);
    }, 3000); // 3 segundos
  };

  const handleLongPressOut = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Maia y La Fuente</Text>
      <FountainIcon height={"25%"} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace("Tutorial")}
        onPressIn={handleLongPressIn}
        onPressOut={handleLongPressOut}
      >
        <Text style={styles.buttonText}>Jugar Demo</Text>
      </TouchableOpacity>

      {showResetButton && <ResetButton />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
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
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default HomeScreen;
