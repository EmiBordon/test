import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import HealingIcon from '../healingicon';
import { decrementBigHealthPotion, decrementGrapes, decrementHealthPotion } from '../../redux/healingSlice';
import { useDispatch, useSelector } from "react-redux";
import { incrementMaiaCurrentHealth } from '../../redux/maiaSlice';

// Definir el tipo del estado de Redux para la curación y la salud de Maia
interface RootState {
  healing: {
    grapes: number;
    healthpotion: number;
    bighealthpotion: number;
  };
  maia: {
    maiahealth: number;
  };
}

interface HealingModalProps {
  visible: boolean;
  onClose: () => void;
  onHealingUsed: (used: boolean) => void;
}

const HealingModal: React.FC<HealingModalProps> = ({ visible, onClose, onHealingUsed }) => {
  const { width, height } = Dimensions.get('window');
  const dispatch = useDispatch();
  
  // Obtener el estado de curación y la salud de Maia desde Redux
  const healingState = useSelector((state: RootState) => state.healing);
  const maiaHealth = useSelector((state: RootState) => state.maia.maiahealth);

  // Estado para saber qué HealingIcon fue presionado ('G', 'H', 'B' o null si ninguno)
  const [selectedHealing, setSelectedHealing] = useState<'G' | 'H' | 'B' | null>(null);

  // Alterna la selección del HealingIcon
  const handleHealingIconSelect = (type: 'G' | 'H' | 'B') => {
    setSelectedHealing(prev => (prev === type ? null : type));
  };

  // Despacha la acción de curación según el HealingIcon seleccionado, cierra el modal y devuelve true
  const handleUseHealing = () => {
    if (selectedHealing === 'G') {
      dispatch(decrementGrapes(1));
      dispatch(incrementMaiaCurrentHealth(Math.floor(maiaHealth / 5)));
    } else if (selectedHealing === 'H') {
      dispatch(decrementHealthPotion(1));
      dispatch(incrementMaiaCurrentHealth(Math.floor(maiaHealth / 2)));
    } else if (selectedHealing === 'B') {
      dispatch(decrementBigHealthPotion(1));
      dispatch(incrementMaiaCurrentHealth(maiaHealth));
    }
    setSelectedHealing(null);
    onHealingUsed(true);
    onClose();
  };

  // Determina si se puede usar el objeto (valor > 0)
  const canUseHealing =
    (selectedHealing === 'G' && healingState.grapes > 0) ||
    (selectedHealing === 'H' && healingState.healthpotion > 0) ||
    (selectedHealing === 'B' && healingState.bighealthpotion > 0);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { width: '90%', height: '40%' }]}>
         
          <View style={styles.itemsContainer}>
            <View style={styles.itemTouchable}>
              <HealingIcon 
                iconType="G" 
                value={healingState.grapes}
                onSelect={handleHealingIconSelect}
              />
              {selectedHealing === 'G' && (
                <View style={styles.infoContainer}>
                  <Text style={styles.infoText}>Uvas ({healingState.grapes})</Text>
                </View>
              )}
            </View>

            <View style={styles.itemTouchable}>
              <HealingIcon 
                iconType="H" 
                value={healingState.healthpotion}
                onSelect={handleHealingIconSelect}
              />
              {selectedHealing === 'H' && (
                <View style={styles.infoContainer}>
                  <Text style={styles.infoText}>Frasco de Salud ({healingState.healthpotion})</Text>
                </View>
              )}
            </View>

            <View style={styles.itemTouchable}>
              <HealingIcon 
                iconType="B" 
                value={healingState.bighealthpotion}
                onSelect={handleHealingIconSelect}
              />
              {selectedHealing === 'B' && (
                <View style={styles.infoContainer}>
                  <Text style={styles.infoText}>Gran Frasco de Salud ({healingState.bighealthpotion})</Text>
                </View>
              )}
            </View>
          </View>

          {selectedHealing && canUseHealing && (
            <TouchableOpacity style={styles.useButton} onPress={handleUseHealing}>
              <Text style={styles.useButtonText}>Usar</Text>
            </TouchableOpacity>
          )}

          {/* Botón "Cerrar" fijo en la parte inferior */}
          <TouchableOpacity style={styles.closeButton} onPress={() => { setSelectedHealing(null); onClose(); }}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default HealingModal;

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
    marginBottom: '2%',
    alignSelf: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  itemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: '5%',
    marginTop:'8%',
  },
  itemTouchable: {
    width: '28%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginVertical: '2%',
  },
  infoContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: '2%',
    borderRadius: 5,
    alignItems: 'center',
    bottom: '103%',
    left: '5%',
  },
  infoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  useButton: {
    backgroundColor: '#fff',
    padding: '3%',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: '2%',
  },
  useButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingVertical: '3%',
    paddingHorizontal: '5%',
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
