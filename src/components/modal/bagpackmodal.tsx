import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import CurrentWeaponIcon from '../currentweapon';
import QuiverIcon from '../quiver'; // Importamos QuiverIcon
import { CrossBowIcon } from '../SvgExporter';

// Definir el tipo de las props
interface BagPackModalProps {
  visible: boolean;
  onClose: () => void;
}

const BagPackModal: React.FC<BagPackModalProps> = ({ visible, onClose }) => {
  const { width, height } = Dimensions.get('window');

  // Estado para mostrar la info de la ballesta
  const [showCrossbowInfo, setShowCrossbowInfo] = useState(false);

  // Simulación de objetos divididos en categorías
  const sections = {
    ARMAS: [], // Quitamos "Daga", ya que ahora usamos QuiverIcon
    CURACIÓN: ['Poción', 'Hierba', 'Antídoto'],
    OBJETOS: ['Llave', 'Mapa', 'Gema'],
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { width: '90%', height: '60%' }]}>
          <Text style={styles.headerText}>Mochila</Text>

          {/* Renderizado de cada sección */}
          {Object.entries(sections).map(([section, items]) => (
            <View key={section} style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}></Text>
              <View style={styles.itemsContainer}>
                {/* Primer casillero: Icono del arma actual */}
                {section === 'ARMAS' && (
                  <>
                    <View style={styles.itemTouchable}>
                      <CurrentWeaponIcon />
                    </View>

                    {/* Segundo casillero: CrossBowIcon */}
                    <TouchableOpacity
                      style={styles.itemTouchable}
                      onPress={() => setShowCrossbowInfo(!showCrossbowInfo)}
                    >
                      <CrossBowIcon width={'70%'} height={'70%'} />
                    </TouchableOpacity>

                    {/* Mostrar info flotante de la ballesta */}
                    {showCrossbowInfo && (
                      <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>Ballesta</Text>
                      </View>
                    )}

                    {/* Tercer casillero: QuiverIcon */}
                    <View style={styles.itemTouchable}>
                      <QuiverIcon />
                    </View>
                  </>
                )}

                {/* Renderizamos el resto de los objetos normalmente */}
                {items.map((item, index) => (
                  <TouchableOpacity key={index} style={styles.itemTouchable}>
                    <Text style={styles.itemText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'gray',
    borderRadius: 15,
    padding: '5%',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: '3%',
    alignSelf: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sectionContainer: {
    marginBottom: '2%',
  },
  sectionTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: '2%',
    textAlign: 'center',
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemTouchable: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  infoContainer: {
    position: 'absolute',
    top: '-35%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: '2%',
    borderRadius: 5,
    alignItems: 'center',
    left: '40%',
  },
  infoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  itemText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 10,
  },
  closeButton: {
    backgroundColor: '#fff',
    paddingVertical: '3%',
    paddingHorizontal: '5%',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: '1%',
  },
  closeButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
