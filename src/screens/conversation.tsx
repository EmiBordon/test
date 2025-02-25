import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MaiaIcon, MattIcon, TextBubbleLeftIcon, TextBubbleRightIcon } from '../components/SvgExporter';

const conversation = [
  { speaker: 'maia', text: '¡Hola Matt! ¿Cómo estás?' },
  { speaker: 'matt', text: '¡Hola Maia! Estoy bien, ¿y tú?' },
  { speaker: 'maia', text: 'Todo bien, ¿qué hiciste hoy?' },
  { speaker: 'matt', text: 'Fui al parque, ¿y tú?' },
  { speaker: 'maia', text: 'Estuve leyendo un libro interesante.' },
  { speaker: 'matt', text: '¡Qué bien! ¿De qué trata?' },
  { speaker: 'maia', text: 'De un reino'},
];

const SvgScreen = () => {
  const [dialogIndex, setDialogIndex] = useState(0);

  const nextDialog = () => {
    if (dialogIndex < conversation.length - 1) {
      setDialogIndex(dialogIndex + 1);
    }
  };

  const resetDialog = () => {
    setDialogIndex(0);
  };

  const currentDialog = conversation[dialogIndex];

  return (
    <View style={styles.container}>
      {/* Burbuja sobre Maia */}
      {currentDialog.speaker === 'maia' && (
        <View style={styles.bubbleContainerLeft}>
          <TextBubbleLeftIcon height={250} />
          <View style={styles.textOverlay}>
            <Text style={styles.bubbleText}>{currentDialog.text}</Text>
          </View>
        </View>
      )}

      {/* Burbuja sobre Matt */}
      {currentDialog.speaker === 'matt' && (
        <View style={styles.bubbleContainerRight}>
          <TextBubbleRightIcon height={250} />
          <View style={styles.textOverlay}>
            <Text style={styles.bubbleText}>{currentDialog.text}</Text>
          </View>
        </View>
      )}

      {/* SVGs de Maia y Matt */}
      <View style={styles.svgContainer}>
        <MaiaIcon height={200} />
        <MattIcon height={200} />
      </View>

      {/* Botón para avanzar en la conversación y reiniciar al mantener presionado */}
      <TouchableOpacity
        style={styles.button}
        onPress={nextDialog}
        onLongPress={resetDialog} // Reinicia la conversación si se mantiene presionado
      >
        <Text style={styles.buttonText}>
          {dialogIndex < conversation.length - 1 ? 'Siguiente' : 'Fin'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20, // Espacio entre los SVGs
  },
  bubbleContainerLeft: {
    position: 'absolute',
    top: 20, // Posición arriba de Maia
    left: 0, // Ajuste para la burbuja izquierda
    alignItems: 'center',
  },
  bubbleContainerRight: {
    position: 'absolute',
    top: 20, // Posición arriba de Matt
    right: 0, // Ajuste para la burbuja derecha
    alignItems: 'center',
  },
  textOverlay: {
    position: 'absolute',
    top: '30%', // Ajusta la posición del texto dentro de la burbuja
    left: '23%',
    right: '23%',
    alignItems: 'center',
  },
  bubbleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SvgScreen;
