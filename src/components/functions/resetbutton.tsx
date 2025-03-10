// src/components/ResetButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { resetMattState } from '../../redux/mattSlice';
import { resetMaiaHealth } from '../../redux/maiaSlice';
import { resetHealing } from '../../redux/healingSlice';
import { resetState } from '../../redux/weaponsSlice'; // Ajusta la ruta según tu estructura
import { resetNotas } from '../../redux/agendaSlice';

const ResetButton = () => {
  const dispatch = useDispatch();

  const handleReset = () => {
    dispatch(resetMattState());
    dispatch(resetMaiaHealth());
    dispatch(resetHealing());
    dispatch(resetState());
    dispatch(resetNotas());
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
