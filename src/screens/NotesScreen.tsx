import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainButton from '../components/mainbutton';
import DeleteIcon from '../assets/delete.svg'; // Importar el SVG para el icono de eliminación
import { useNavigation } from '@react-navigation/native';

export default function NotesScreen() {
  const [notes, setNotes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem('notes');
        if (storedNotes) {
          const parsedNotes = JSON.parse(storedNotes);
          if (Array.isArray(parsedNotes)) {
            setNotes(parsedNotes);
          } else {
            console.warn('El formato de las notas no es válido.');
            setNotes([]);
          }
        }
      } catch (error) {
        console.error('Error al cargar las notas:', error);
      }
    };
    loadNotes();
  }, []);

  const handleDeleteNote = async (id) => {
    try {
      const filteredNotes = notes.filter((note) => note.id !== id);
      await AsyncStorage.setItem('notes', JSON.stringify(filteredNotes));
      setNotes(filteredNotes);

      Alert.alert('Éxito', 'Nota eliminada correctamente.');
    } catch (error) {
      console.error('Error al eliminar la nota:', error);
      Alert.alert('Error', 'Hubo un problema al eliminar la nota.');
    }
  };

  const handleSelectNote = (note) => {
    navigation.navigate('SelectedNote', { note });
  };

  const renderNote = ({ item }) => (
    <View style={styles.noteContainer}>
      <TouchableOpacity
        style={styles.noteContent}
        onPress={() => handleSelectNote(item)}
      >
        <Text style={styles.noteText}>{item.content}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteNote(item.id)}
      >
        <DeleteIcon width={24} height={24} fill="#FF0000" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNote}
        contentContainerStyle={styles.list}
        numColumns={2}
        key={(notes.length > 0).toString()} // Forzar renderizado al cambiar columnas
      />
      <MainButton
        onPress={() => navigation.navigate('NewNote')}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>+</Text>
      </MainButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  list: {
    marginTop: 20,
  },
  noteContainer: {
    width: '48%', // Ocupa el 48% del ancho para dejar espacio entre columnas
    aspectRatio: 1.5, // Define una forma rectangular
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    margin: '1%',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noteContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  deleteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  addButton: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
