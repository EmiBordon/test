import React, { useState } from "react";
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

  // Obtenemos los estados que queremos guardar/restaurar
  const healing = useSelector((state: any) => state.healing);
  const maia = useSelector((state: any) => state.maia);
  const weapons = useSelector((state: any) => state.weapons);
  const backup = useSelector((state: any) => state.backup);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Maia y La Fuente</Text>
      <FountainIcon height={"25%"} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          
          navigation.replace("Tutorial");
        }}
      >
        <Text style={styles.buttonText}>Nueva Partida</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          
          setCodeModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>Pruebas</Text>
      </TouchableOpacity>

      {/* 🔵 GUARDAR ESTADOS */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
         
          dispatch(saveBackup({ healing, maia, weapons }));
        }}
      >
        <Text style={styles.buttonText}>Guardar Estados</Text>
      </TouchableOpacity>

      {/* 🔵 CARGAR ESTADOS */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
         
          if (backup.healing && backup.maia && backup.weapons) {
            dispatch(setHealingState(backup.healing));
            dispatch(setMaiaState(backup.maia));
            dispatch(setWeaponsState(backup.weapons));
          }
          dispatch(restoreBackup());
        }}
      >
        <Text style={styles.buttonText}>Cargar Estados</Text>
      </TouchableOpacity>

      <ResetButton />

      <ConversationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        conversation={conversations.mattconv1}
      />

      <CodeModal
        visible={codeModalVisible}
        codigo="381547260"
        onClose={() => setCodeModalVisible(false)}
      />
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
