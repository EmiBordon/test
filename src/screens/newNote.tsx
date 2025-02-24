import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function NewNote() {
  const [note, setNote] = useState('');
  const navigation = useNavigation();

  const handleSaveNote = async () => {
    if (note.trim() === '') {
      Alert.alert('Error', 'La nota no puede estar vacía.');
      return;
    }

    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      const notes = storedNotes ? JSON.parse(storedNotes) : [];

      const newNotes = [...notes, { id: Date.now(), content: note }];
      await AsyncStorage.setItem('notes', JSON.stringify(newNotes));

      Alert.alert('Éxito', 'Nota guardada correctamente.');
      setNote('');
      navigation.goBack(); // Vuelve a la pantalla anterior
    } catch (error) {
      console.error('Error al guardar la nota:', error);
      Alert.alert('Error', 'Hubo un problema al guardar la nota.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Escribe tu nota aquí..."
        value={note}
        onChangeText={setNote}
        multiline
      />
      <TouchableOpacity
        onPress={handleSaveNote}
        style={styles.buttonContainer}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Guardar Nota</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  buttonContainer: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
