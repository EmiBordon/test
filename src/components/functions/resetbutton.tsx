// src/components/ResetButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { resetMattState } from '../../redux/mattSlice';
import { resetMaiaHealth } from '../../redux/maiaSlice';
import { resetHealing } from '../../redux/healingSlice';
import { resetState } from '../../redux/weaponsSlice'; // Ajusta la ruta según tu estructura
import { resetNotas } from '../../redux/agendaSlice';
import { resetCoins } from '../../redux/coinsSlice';
import { resetCharacters } from '../../redux/charactersSlice';
import { resetBoxes } from '../../redux/boxesSlice';
import { resetLocations } from '../../redux/locationsSlice';
import { resetObjects } from '../../redux/objectsSlice';
import { resetProcessedRewards } from '../../redux/rewardSlice';
import { resetObjectives } from '../../redux/objectivesSlice';

const ResetButton = () => {
  const dispatch = useDispatch();

  const handleReset = () => {
    dispatch(resetMattState());
    dispatch(resetMaiaHealth());
    dispatch(resetHealing());
    dispatch(resetState());
    dispatch(resetNotas());
    dispatch(resetCoins());
    dispatch(resetCharacters());
    dispatch(resetBoxes());
    dispatch(resetLocations());
    dispatch(resetObjects());
    dispatch(resetProcessedRewards());
    dispatch(resetObjectives());
    };

  return (
    <TouchableOpacity style={styles.button} onPress={handleReset}>
      <Text style={styles.buttonText}>Resetear Estados</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ResetButton;
