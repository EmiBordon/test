import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import CurrentWeaponIcon from '../currentweapon';
import QuiverIcon from '../quiver';
import { CrossBowIcon } from '../SvgExporter';

interface BagPackModalProps {
  visible: boolean;
  onClose: () => void;
}

const BagPackModal: React.FC<BagPackModalProps> = ({ visible, onClose }) => {
  const [showCrossbowInfo, setShowCrossbowInfo] = useState(false);

  // Objetos divididos en categorías (misma lógica)
  const sections = {
    ARMAS: [], // Daga removida; ahora se muestran iconos de CurrentWeapon, Ballesta y Quiver
    SALUD: ['Poción', 'Hierba', 'Antídoto'],
    OBJETOS: ['Llave', 'Mapa', 'Gema'],
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Cabecera tipo pixel-art */}
          <Text style={styles.headerText}>ITEMS</Text>

          {/* Renderizado de cada sección */}
          {Object.entries(sections).map(([section, items]) => (
            <View key={section} style={styles.sectionContainer}>
              {/* En este caso no mostramos el nombre de la sección, 
                  pero podrías ponerlo en estilo pixelado si lo deseas */}
              {/* <Text style={styles.sectionTitle}>{section}</Text> */}

              <View style={styles.itemsContainer}>
                {section === 'ARMAS' && (
                  <>
                    {/* Primer casillero: Arma actual */}
                    <View style={styles.itemTouchable}>
                      <CurrentWeaponIcon />
                    </View>

                    {/* Segundo casillero: Ballesta */}
                    <TouchableOpacity
                      style={styles.itemTouchable}
                      onPress={() => setShowCrossbowInfo(!showCrossbowInfo)}
                    >
                      <CrossBowIcon width={'70%'} height={'70%'} />
                    </TouchableOpacity>

                    {/* Info flotante de la ballesta */}
                    {showCrossbowInfo && (
                      <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>Ballesta</Text>
                      </View>
                    )}

                    {/* Tercer casillero: Carcaj (Quiver) */}
                    <View style={styles.itemTouchable}>
                      <QuiverIcon />
                    </View>
                  </>
                )}

                {/* Resto de ítems en cada sección */}
                {items.map((item, index) => (
                  <TouchableOpacity key={index} style={styles.itemTouchable}>
                    <Text style={styles.itemText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Botón de cierre */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BagPackModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    // Fondo semitransparente oscuro
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    // Para simular un fondo tipo “ventana” pixel-art
    backgroundColor: 'gray', // Un tono verde-azulado oscuro
    borderWidth: 2,
    borderColor: 'black', // Un tono más claro para el borde
    // Sin bordes redondeados para lucir más "retro"
    borderRadius: 0,
    width: '90%',
    // Ajusta la altura según te convenga
    height: '60%',
    padding: 10,
  },
  headerText: {
    fontSize: 24,
    // Si tienes una fuente pixelada, úsala aquí. De lo contrario,
    // utiliza un fallback con letra monoespaciada o parecida
    // fontFamily: 'PressStart2P',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
    // Para simular un estilo “pixel”
    letterSpacing: 2,
  },
  sectionContainer: {
    marginVertical: 5,
  },
  sectionTitle: {
    fontSize: 14,
    // fontFamily: 'PressStart2P',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
    letterSpacing: 1,
  },
  itemsContainer: {
    // Distribución en cuadrícula
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  itemTouchable: {
    // Para un grid de 4 columnas, cada item ocupa ~25%
    width: '25%',
    aspectRatio: 1,
    backgroundColor: 'gray', // Color de fondo para los ítems
    borderWidth: 2,
    borderColor: 'white',
    // Quitar bordes redondeados para pixel-art
    borderRadius: 0,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    color: 'white',
    // fontFamily: 'PressStart2P',
    fontSize: 10,
    textAlign: 'center',
  },
  infoContainer: {
    position: 'absolute',
    bottom: '110%',
    // Ajusta la posición horizontal según necesites
    left: '10%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 5,
    borderWidth: 1,
    borderColor: 'white',
    // Sin bordes redondeados
    borderRadius: 0,
    zIndex: 999,
  },
  infoText: {
    color: '#F2D5BD',
    // fontFamily: 'PressStart2P',
    fontSize: 10,
  },
  closeButton: {
    backgroundColor: 'black',
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 0,
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignSelf: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    // fontFamily: 'PressStart2P',
    fontSize: 14,
    textAlign: 'center',
  },
});
