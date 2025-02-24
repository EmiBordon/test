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
import { useNavigation, useRoute } from '@react-navigation/native';

export default function EditNote() {
  const navigation = useNavigation();
  const route = useRoute();
  const { note } = route.params; // Recibe la nota seleccionada como parámetro
  const [content, setContent] = useState(note.content);

  const handleSaveEdit = async () => {
    if (content.trim() === '') {
      Alert.alert('Error', 'La nota no puede estar vacía.');
      return;
    }

    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      const notes = storedNotes ? JSON.parse(storedNotes) : [];

      // Actualizar la nota específica
      const updatedNotes = notes.map((n) =>
        n.id === note.id ? { ...n, content } : n
      );

      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));

      Alert.alert('Éxito', 'Nota actualizada correctamente.');
      navigation.goBack(); // Vuelve a la pantalla anterior
    } catch (error) {
      console.error('Error al actualizar la nota:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar la nota.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Edita tu nota aquí..."
        value={content}
        onChangeText={setContent}
        multiline
      />
      <TouchableOpacity
        onPress={handleSaveEdit}
        style={styles.buttonContainer}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Guardar Cambios</Text>
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
    backgroundColor: '#28A745',
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
