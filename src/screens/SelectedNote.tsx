import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function SelectedNote() {
  const route = useRoute();
  const navigation = useNavigation();
  const { note } = route.params;

  const handleEdit = () => {
    navigation.navigate('EditNote', { note });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nota seleccionada</Text>
      <Text style={styles.content}>{note.content}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Editar Nota" onPress={handleEdit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 20,
  },
});
