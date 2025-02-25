import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FountainIcon } from '../components/SvgExporter';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Maia y La Fuente</Text>
      
      <FountainIcon height={'25%'} />
      
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Tutorial')}>
        <Text style={styles.buttonText}>Comenzar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Logros')}>
        <Text style={styles.buttonText}>Logros</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: '10%',
    marginTop: '20%',
    fontFamily: 'serif',
  },
  button: {
    marginTop: '15%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 3,
    borderColor: '#000',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 25,
  },
});

export default HomeScreen;
