import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { incrementArrows, decrementArrows, incrementWeapon, decrementWeapon } from "../redux/weaponsSlice";
import { incrementGrapes, decrementGrapes, incrementHealthPotion, decrementHealthPotion, 
  incrementBigHealthPotion, decrementBigHealthPotion, resetHealing } from "../redux/healingSlice";
import ConversationModal from "../components/modal/conversationmodal"; 
import { conversations } from "../components/functions/conversations"; 
import { FountainIcon, PillsIcon } from "../components/SvgExporter";
import ResetButton from "../components/functions/resetbutton";
import { playSound } from "../sounds/soundexporter"; // Importamos el sonido
import NewItemModal from "../components/modal/newitemmodal";
import { setNotaTrue } from "../redux/agendaSlice";
import { incrementCoins, decrementCoins } from "../redux/coinsSlice";

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(false);
  const [newItemModalVisible, setNewItemModalVisible] = useState(false);

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

      {/* Botón "Pruebas" que muestra el NewItemModal */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          playSound("click");
          setNewItemModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>Pruebas</Text>
      </TouchableOpacity>

      {/* Otros botones de ejemplo */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          playSound("click");
          dispatch(incrementCoins(3));
        }}
      >
        <Text style={styles.buttonText}>Aumentar Flechas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          playSound("click");
          dispatch(decrementCoins(3));
        }}
      >
        <Text style={styles.buttonText}>Disminuir Flechas</Text>
      </TouchableOpacity>

      <ResetButton />

      {/* Modal de conversación (se mantiene como ejemplo) */}
      <ConversationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        conversation={conversations.mattconv1}
      />

      {/* NewItemModal para mostrar el nuevo item */}
      <NewItemModal
        visible={newItemModalVisible}
        onClose={() => setNewItemModalVisible(false)}
        icon={<PillsIcon height={"50"} width={"50"} />}
        name="Pildoras"
        description="Aumentan 5 puntos de vida"
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
