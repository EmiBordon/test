import TrackPlayer from 'react-native-track-player';

export const homeSong = {
  id: '1',
  url: require('../sounds/music/home-song.mp3'), // Asegúrate de que el archivo exista en esta ruta 
  duration: 260 , // Duración en segundos (ajústala según el archivo)
};

export async function setupPlayer() {
  await TrackPlayer.setupPlayer();
  await TrackPlayer.add([homeSong]);
}

export async function playMusic() {
  await TrackPlayer.play();
}

export async function pauseMusic() {
  await TrackPlayer.pause();
}

export async function stopMusic() {
  await TrackPlayer.stop();
}
