import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import CurrentWeaponIcon from '../currentweapon';
import QuiverIcon from '../quiver'; // Importamos QuiverIcon
import { CrossBowIcon } from '../SvgExporter';
import HealingIcon from '../healingicon'; // Importamos HealingIcon
import { decrementBigHealthPotion, decrementGrapes, decrementHealthPotion } from '../../redux/healingSlice';
import { useDispatch } from "react-redux";
import { incrementMaiaCurrentHealth } from '../../redux/maiaSlice';

// Definir el tipo de las props
interface BagPackModalProps {
  visible: boolean;
  onClose: () => void;
}

const BagPackModal: React.FC<BagPackModalProps> = ({ visible, onClose }) => {
  const { width, height } = Dimensions.get('window');
  const [showCrossbowInfo, setShowCrossbowInfo] = useState(false);
  // Estado para saber qué HealingIcon fue presionado ('G', 'H', 'B' o null si ninguno)
  const [selectedHealing, setSelectedHealing] = useState<'G' | 'H' | 'B' | null>(null);
  const dispatch = useDispatch();

  // Callback que alterna la selección: si se presiona el mismo, se deselecciona.
  const handleHealingIconSelect = (type: 'G' | 'H' | 'B') => {
    if (selectedHealing === type) {
      setSelectedHealing(null);
    } else {
      setSelectedHealing(type);
    }
  };

  // Despacha la acción correspondiente según el HealingIcon seleccionado
  const handleUseHealing = () => {
    if (selectedHealing === 'G') {
      dispatch(decrementGrapes(1));
      dispatch(incrementMaiaCurrentHealth(2));
    } else if (selectedHealing === 'H') {
      dispatch(decrementHealthPotion(1));
      dispatch(incrementMaiaCurrentHealth(5));
    } else if (selectedHealing === 'B') {
      dispatch(decrementBigHealthPotion(1));
      dispatch(incrementMaiaCurrentHealth(1000));
    }
    setSelectedHealing(null);
  };

  // Solo tenemos dos categorías: ARMAS y CURACIÓN
  const sections = {
    ARMAS: [],
    CURACIÓN: [],
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { width: '90%', height: '60%' }]}>
          <Text style={styles.headerText}>Mochila</Text>

          {/* Renderizado de cada sección */}
          {Object.entries(sections).map(([section]) => (
            <View key={section} style={styles.sectionContainer}>
              <View style={styles.itemsContainer}>
                {/* Sección ARMAS */}
                {section === 'ARMAS' && (
                  <>
                    <View style={styles.itemTouchable}>
                      <CurrentWeaponIcon />
                    </View>
                    <TouchableOpacity
                      style={styles.itemTouchable}
                      onPress={() => setShowCrossbowInfo(!showCrossbowInfo)}
                    >
                      <CrossBowIcon width={'70%'} height={'70%'} />
                    </TouchableOpacity>
                    {showCrossbowInfo && (
                      <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>Ballesta</Text>
                      </View>
                    )}
                    <View style={styles.itemTouchable}>
                      <QuiverIcon />
                    </View>
                  </>
                )}

                {/* Sección CURACIÓN */}
                {section === 'CURACIÓN' && (
                  <>
                    <View style={styles.itemTouchable}>
                      <HealingIcon 
                        iconType="G" 
                        onSelect={handleHealingIconSelect}
                      />
                    </View>
                    <View style={styles.itemTouchable}>
                      <HealingIcon 
                        iconType="H" 
                        onSelect={handleHealingIconSelect}
                      />
                    </View>
                    <View style={styles.itemTouchable}>
                      <HealingIcon 
                        iconType="B" 
                        onSelect={handleHealingIconSelect}
                      />
                    </View>
                  </>
                )}
              </View>
            </View>
          ))}

          {/* Botón "Usar" que se muestra si hay un HealingIcon seleccionado */}
          {selectedHealing && (
            <TouchableOpacity style={styles.useButton} onPress={handleUseHealing}>
              <Text style={styles.useButtonText}>Usar {selectedHealing}</Text>
            </TouchableOpacity>
          )}

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
    marginBottom: 10,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  itemTouchable: {
    width: 90,
    height: 90,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    margin: '2%',
    marginTop: '15%',
  },
  infoContainer: {
    position: 'absolute',
    top: -30,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    left: '55%',
    transform: [{ translateX: -50 }],
    marginTop: '13%',
  },
  infoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  useButton: {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    backgroundColor: '#fff',
    padding: '3%',
    borderRadius: 10,
  },
  useButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#fff',
    paddingVertical: '3%',
    paddingHorizontal: '5%',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: '22%',
  },
  closeButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
