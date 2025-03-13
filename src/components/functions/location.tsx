// Location.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface LocationProps {
  text: string;
}

const Location: React.FC<LocationProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.locationText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '1%',
    right: '2%',
    backgroundColor: 'black',
    padding: '2%',
    borderRadius: 5,
    elevation: 3, // sombra en Android
    shadowColor: '#000', // sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  locationText: {
    color: 'white', // texto en negro
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default Location;
