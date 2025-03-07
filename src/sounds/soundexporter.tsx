import Sound from 'react-native-sound';

// Habilitar la carga de sonido en modo silencioso en iOS
Sound.setCategory('Playback');

// Importación de los archivos de sonido
const soundFiles = {
  click: new Sound(require('../sounds/effects/click-sound.wav'), Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.error('Error al cargar el sonido de clic:', error);
    }
  }),
};

// Función para reproducir un sonido específico
export const playSound = (soundKey: keyof typeof soundFiles) => {
  const sound = soundFiles[soundKey];
  if (sound) {
    sound.stop(() => {
      sound.play((success) => {
        if (!success) {
          console.error(`Error al reproducir el sonido: ${soundKey}`);
        }
      });
    });
  } else {
    console.error(`El sonido "${soundKey}" no está definido.`);
  }
};

// Función para detener un sonido
export const stopSound = (soundKey: keyof typeof soundFiles) => {
  const sound = soundFiles[soundKey];
  if (sound) {
    sound.stop();
  } else {
    console.error(`El sonido "${soundKey}" no está definido.`);
  }
};

export default soundFiles;
