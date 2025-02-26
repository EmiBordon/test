import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FountainIcon } from "../components/SvgExporter";


const HomeScreen = ({ navigation }) => {
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Maia y La Fuente</Text>
      <FountainIcon height={"25%"} />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Tutorial")}>
        <Text style={styles.buttonText}>Nueva Partida</Text>
      </TouchableOpacity>

      {/* Botón para abrir el modal */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("HandGame")}>
        <Text style={styles.buttonText}>Pruebas</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 30, fontWeight: "bold", color: "#000", marginBottom: "10%", marginTop: "20%", fontFamily: "serif" },
  button: { marginTop: "15%", paddingVertical: 10, paddingHorizontal: 20, borderWidth: 3, borderColor: "#000", borderRadius: 10, backgroundColor: "transparent" },
  buttonText: { color: "#000", fontWeight: "bold", fontSize: 25 },
});

export default HomeScreen;
