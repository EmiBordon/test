// src/components/ResetButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { resetMattState } from '../../redux/mattSlice';
import { resetMaiaHealth } from '../../redux/maiaSlice'; // Ajusta la ruta según tu estructura

const ResetButton = () => {
  const dispatch = useDispatch();

  const handleReset = () => {
    dispatch(resetMattState());
    dispatch(resetMaiaHealth());
    // Aquí puedes agregar otros dispatch para resetear otros slices en el futuro
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
