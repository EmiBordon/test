import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import CurrentWeaponIcon from '../currentweapon';
import QuiverIcon from '../quiver';
import { CrossBowIcon, BowIcon } from '../SvgExporter';
import HealingIcon from '../healingicon';
import { decrementBigHealthPotion, decrementGrapes, decrementHealthPotion } from '../../redux/healingSlice';
import { useDispatch, useSelector } from "react-redux";
import { incrementMaiaCurrentHealth } from '../../redux/maiaSlice';

// Definir el tipo del estado de Redux para la curación
interface RootState {
  healing: {
    grapes: number;
    healthpotion: number;
    bighealthpotion: number;
  };
}

interface BagPackModalProps {
  visible: boolean;
  onClose: () => void;
}

const BagPackModal: React.FC<BagPackModalProps> = ({ visible, onClose }) => {
  const { width, height } = Dimensions.get('window');
  const [showCrossbowInfo, setShowCrossbowInfo] = useState(false);
  // Estado para saber qué HealingIcon fue presionado ('G', 'H', 'B' o null si ninguno)
  const [selectedHealing, setSelectedHealing] = useState<'G' | 'H' | 'B' | null>(null);
  // Estado para controlar si se muestra la siguiente página de slots
  const [showExtraSlots, setShowExtraSlots] = useState(false);
  const dispatch = useDispatch();

  // Obtener el estado de curación desde Redux
  const healingState = useSelector((state: RootState) => state.healing);

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

  // Lógica para determinar si se puede usar el objeto (valor > 0)
  const canUseHealing =
    (selectedHealing === 'G' && healingState.grapes > 0) ||
    (selectedHealing === 'H' && healingState.healthpotion > 0) ||
    (selectedHealing === 'B' && healingState.bighealthpotion > 0);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { width: '90%', height: '60%' }]}>
          <Text style={styles.headerText}>Mochila</Text>

          {/* Si showExtraSlots es false, mostramos la página original; de lo contrario, los nuevos slots */}
          {!showExtraSlots ? (
            <>
              {/* Renderizado de las secciones ARMAS y CURACIÓN */}
              <View style={styles.sectionContainer}>
                <View style={styles.itemsContainer}>
                  {/* Sección ARMAS */}
                  <View style={styles.itemTouchable}>
                    <CurrentWeaponIcon />
                  </View>
                  <TouchableOpacity
                    style={styles.itemTouchable}
                    onPress={() => setShowCrossbowInfo(!showCrossbowInfo)}
                  >
                    <BowIcon width={'70%'} height={'70%'} />
                  </TouchableOpacity>
                  {showCrossbowInfo && (
                    <View style={styles.infoContainer2}>
                      <Text style={styles.infoText}>Arco</Text>
                    </View>
                  )}
                  <View style={styles.itemTouchable}>
                    <QuiverIcon />
                  </View>
                </View>
                <View style={styles.itemsContainer2}>
                  {/* Sección CURACIÓN */}
                  <View style={styles.healingIconContainer}>
                    <View style={styles.itemTouchable}>
                      <HealingIcon 
                        iconType="G" 
                        value={healingState.grapes}
                        onSelect={handleHealingIconSelect}
                      />
                    </View>
                    {selectedHealing === 'G' && (
                      <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>Uvas ({healingState.grapes})</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.healingIconContainer}>
                    <View style={styles.itemTouchable}>
                      <HealingIcon 
                        iconType="H" 
                        value={healingState.healthpotion}
                        onSelect={handleHealingIconSelect}
                      />
                    </View>
                    {selectedHealing === 'H' && (
                      <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>Frasco de Salud ({healingState.healthpotion})</Text>
                      </View>
                    )}
                </View>

                  <View style={styles.healingIconContainer}>
                    <View style={styles.itemTouchable}>
                      <HealingIcon 
                        iconType="B" 
                        value={healingState.bighealthpotion}
                        onSelect={handleHealingIconSelect}
                      />
                    </View>
                    {selectedHealing === 'B' && (
                      <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>Gran Frasco de Salud ({healingState.bighealthpotion})</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {/* Botón "Usar" solo se muestra en la página original */}
              {selectedHealing && canUseHealing && (
                <TouchableOpacity style={styles.useButton} onPress={handleUseHealing}>
                  <Text style={styles.useButtonText}>Usar</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            // Página de 6 nuevos slots vacíos
            <View style={styles.extraSlotsContainer}>
              {Array.from({ length: 6 }).map((_, index) => (
                <View key={index} style={styles.extraSlot} />
              ))}
            </View>
          )}

          {/* Botón "Cerrar" siempre visible */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>

          {/* Botón para cambiar de página en la esquina inferior derecha */}
          <TouchableOpacity
            style={styles.extraSlotsToggle}
            onPress={() => setShowExtraSlots(!showExtraSlots)}
          >
            <Text style={styles.extraSlotsToggleText}>
              {showExtraSlots ? '<<' : '>>'}
            </Text>
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
    position: 'relative',
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: '-2%',
    alignSelf: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sectionContainer: {
    marginBottom: '14%',
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '8%',
  },
  itemsContainer2: {
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
  healingIconContainer: {
    position: 'relative',
  },
  infoContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    left: '55%',
    transform: [{ translateX: -50 }],
    bottom: '85%',
  },
  infoContainer2: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    left: '59%',
    transform: [{ translateX: -50 }],
    bottom: '70%',
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
  extraSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '10%',
    paddingVertical: '6%',
  },
  extraSlot: {
    width: 90,
    height: 90,
    borderWidth: 1,
    borderColor: '#000',
    margin: '2%',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  extraSlotsToggle: {
    position: 'absolute',
    bottom: '5%',
    right: '5%',
    backgroundColor: '#fff',
    padding: '3%',
    borderRadius: 10,
  },
  extraSlotsToggleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
