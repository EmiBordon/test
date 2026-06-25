import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { MaiaTitleIcon } from "../components/SvgExporter";
import { font } from "../components/functions/fontsize";
import ResetButton from "../components/functions/resetbutton";
import ManaBar from "../components/manabar";
import {
  incrementMaiaMana,
  decrementMaiaMana,
  incrementMaiaManaLevel,
  decrementMaiaManaLevel,
} from "../redux/maiaSlice";
import {
  enableLifeSpell,
  disableLifeSpell,
  enableIceSpell,
  disableIceSpell,
  resetSpells,
} from "../redux/spellSlice";

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const [showResetButton, setShowResetButton] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const maiaMana = useSelector((state: any) => state.maia.maiaMana);
  const maiaManaLevel = useSelector((state: any) => state.maia.maiaManaLevel);
  const lifeSpell = useSelector((state: any) => state.spell.lifeSpell);
  const iceSpell = useSelector((state: any) => state.spell.iceSpell);

  const handleLongPressIn = () => {
    timerRef.current = setTimeout(() => {
      setShowResetButton(true);
    }, 800);
  };

  const handleLongPressOut = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MaiaTitleIcon width={"90%"} style={styles.titleIcon} />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => { navigation.replace("Tutorial"); }}
          onPressIn={handleLongPressIn}
          onPressOut={handleLongPressOut}
        >
          <Text style={styles.buttonText}>Jugar Demo</Text>
        </TouchableOpacity>
      </View>

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

      {/* --- TEST: Spells --- */}
      <View style={styles.testSection}>
        <Text style={styles.testLabel}>Hechizos</Text>

        <View style={styles.testRow}>
          <Text style={styles.testLabel}>Life Spell</Text>
          <TouchableOpacity
            style={[styles.spellToggle, lifeSpell && styles.spellToggleActive]}
            onPress={() => dispatch(lifeSpell ? disableLifeSpell() : enableLifeSpell())}
          >
            <Text style={styles.testBtnText}>{lifeSpell ? "ON" : "OFF"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.testRow}>
          <Text style={styles.testLabel}>Ice Spell</Text>
          <TouchableOpacity
            style={[styles.spellToggle, iceSpell && styles.spellToggleActive]}
            onPress={() => dispatch(iceSpell ? disableIceSpell() : enableIceSpell())}
          >
            <Text style={styles.testBtnText}>{iceSpell ? "ON" : "OFF"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.resetSpellsBtn} onPress={() => dispatch(resetSpells())}>
          <Text style={styles.testLabel}>Reset Hechizos</Text>
        </TouchableOpacity>
      </View>

      {showResetButton && <ResetButton />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#554451",
    paddingTop: "5%",
    paddingBottom: font(40),
  },
  titleIcon: {
    marginBottom: font(10),
  },
  buttonsContainer: {
    alignItems: "center",
    gap: font(10),
  },
  button: {
    paddingVertical: font(10),
    paddingHorizontal: font(28),
    borderWidth: font(2),
    borderColor: "#C8A84B",
    borderRadius: font(6),
    backgroundColor: "rgba(92, 50, 30, 0.85)",
  },
  buttonText: {
    color: "#E8D5A3",
    fontWeight: "bold",
    fontSize: font(20),
    fontFamily: "serif",
    letterSpacing: font(1),
  },
  testSection: {
    marginTop: font(16),
    alignItems: "center",
    gap: font(6),
    borderWidth: font(1),
    borderColor: "#C8A84B",
    borderRadius: font(8),
    padding: font(12),
    backgroundColor: "rgba(92, 50, 30, 0.4)",
    width: "85%",
  },
  testLabel: {
    fontWeight: "bold",
    fontSize: font(14),
    color: "#E8D5A3",
    fontFamily: "serif",
  },
  testRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: font(16),
  },
  testBtn: {
    width: font(36),
    height: font(36),
    borderWidth: font(2),
    borderColor: "#C8A84B",
    borderRadius: font(6),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(92, 50, 30, 0.7)",
  },
  testBtnText: {
    fontSize: font(16),
    fontWeight: "bold",
    color: "#E8D5A3",
  },
  testValue: {
    fontSize: font(22),
    fontWeight: "bold",
    minWidth: font(30),
    textAlign: "center",
    color: "#E8D5A3",
  },
  spellToggle: {
    paddingVertical: font(6),
    paddingHorizontal: font(16),
    borderWidth: font(2),
    borderColor: "#C8A84B",
    borderRadius: font(6),
    backgroundColor: "rgba(92, 50, 30, 0.7)",
    minWidth: font(60),
    alignItems: "center",
  },
  spellToggleActive: {
    borderColor: "#A6DBDF",
    backgroundColor: "rgba(40, 90, 95, 0.6)",
  },
  resetSpellsBtn: {
    marginTop: font(4),
    paddingVertical: font(6),
    paddingHorizontal: font(16),
    borderWidth: font(1),
    borderColor: "#C8A84B",
    borderRadius: font(6),
    backgroundColor: "rgba(92, 50, 30, 0.5)",
  },
});

export default HomeScreen;
