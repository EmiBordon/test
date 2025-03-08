import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { incrementArrows, decrementArrows, incrementWeapon, decrementWeapon } from "../redux/weaponsSlice";
import { incrementGrapes, decrementGrapes, incrementHealthPotion, decrementHealthPotion, 
  incrementBigHealthPotion, decrementBigHealthPotion, resetHealing } from "../redux/healingSlice";
import ConversationModal from "../components/modal/conversationmodal"; 
import { conversations } from "../components/functions/conversations"; 
import { FountainIcon } from "../components/SvgExporter";
import ResetButton from "../components/functions/resetbutton";
import { playSound } from "../sounds/soundexporter"; // Importamos el sonido

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Maia y La Fuente</Text>
      <FountainIcon height={"25%"} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          playSound("click");
          navigation.navigate("Tutorial");
        }}
      >
        <Text style={styles.buttonText}>Nueva Partida</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          playSound("click");
          navigation.navigate("BattleScreen");
        }}
      >
        <Text style={styles.buttonText}>Pruebas</Text>
      </TouchableOpacity>

  

      {/* Botón para aumentar las flechas */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          playSound("click");
          dispatch(incrementArrows(1));
        }}
      >
        <Text style={styles.buttonText}>Aumentar Flechas</Text>
      </TouchableOpacity>

      {/* Botón para disminuir las flechas */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          playSound("click");
          dispatch(decrementArrows(1));
        }}
      >
        <Text style={styles.buttonText}>Disminuir Flechas</Text>
      </TouchableOpacity>

      {/* Botón para resetear estados */}
      <ResetButton />

      {/* Modal para mostrar la conversación "historia1" */}
      <ConversationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        conversation={conversations.mattconv1}
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
  weaponText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginTop: 15,
  },
});

export default HomeScreen;
