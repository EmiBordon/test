import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import HealingIcon from '../healingicon';
import { decrementBigHealthPotion, decrementGrapes, decrementHealthPotion } from '../../redux/healingSlice';
import { useDispatch, useSelector } from "react-redux";
import { incrementMaiaCurrentHealth } from '../../redux/maiaSlice';
import { decrementBomb } from '../../redux/weaponsSlice';
import { BombIcon, GrapesIcon, HealthPotionIcon, BigHealthPotionIcon } from '../SvgExporter';
import { font } from '../functions/fontsize';

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
  weapons: {
    bomb: number;
  };
}

interface HealingModalProps {
  visible: boolean;
  onClose: () => void;
  onHealingUsed: (used: boolean, bombUsed?: boolean) => void;
}

interface HealingItem {
  id: string;
  name: string;
  quantity: number;
  icon: React.ComponentType<any>;
  type: 'G' | 'H' | 'B' | 'BOMB';
}

const HealingModal: React.FC<HealingModalProps> = ({ visible, onClose, onHealingUsed }) => {
  const dispatch = useDispatch();
  
  // Obtener el estado de curación, la salud de Maia y las bombas desde Redux
  const healingState = useSelector((state: RootState) => state.healing);
  const maiaHealth = useSelector((state: RootState) => state.maia.maiahealth);
  const bomb = useSelector((state: RootState) => state.weapons.bomb);

  // Estados para paginación y selección
  const [page, setPage] = useState(0);
  const [selectedItem, setSelectedItem] = useState<HealingItem | null>(null);

  // Crear lista de items disponibles (solo los que tienen cantidad > 0)
  const createAvailableItems = (): HealingItem[] => {
    const items: HealingItem[] = [];
    
    if (healingState.grapes > 0) {
      items.push({
        id: 'grapes',
        name: 'Uvas',
        quantity: healingState.grapes,
        icon: () => <GrapesIcon width={font(40)} height={font(40)} />,
        type: 'G'
      });
    }
    
    if (healingState.healthpotion > 0) {
      items.push({
        id: 'healthpotion',
        name: 'Frasco de Salud',
        quantity: healingState.healthpotion,
        icon: () => <HealthPotionIcon width={font(40)} height={font(40)} />,
        type: 'H'
      });
    }
    
    if (healingState.bighealthpotion > 0) {
      items.push({
        id: 'bighealthpotion',
        name: 'Gran Frasco de Salud',
        quantity: healingState.bighealthpotion,
        icon: () => <BigHealthPotionIcon width={font(40)} height={font(40)} />,
        type: 'B'
      });
    }
    
    if (bomb > 0) {
      items.push({
        id: 'bomb',
        name: 'Bomba',
        quantity: bomb,
        icon: () => <BombIcon width={font(40)} height={font(40)} />,
        type: 'BOMB'
      });
    }
    
    return items;
  };

  const availableItems = createAvailableItems();
  const itemsPerPage = 3;
  const totalPages = Math.ceil(availableItems.length / itemsPerPage);
  const paginatedItems = availableItems.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  // Manejar selección de item
  const handleItemSelect = (item: HealingItem) => {
    setSelectedItem(selectedItem?.id === item.id ? null : item);
  };

  // Manejar uso del item seleccionado
  const handleUseItem = () => {
    if (!selectedItem) return;

    switch (selectedItem.type) {
      case 'G':
        dispatch(decrementGrapes(1));
        dispatch(incrementMaiaCurrentHealth(Math.floor(maiaHealth / 5)));
        break;
      case 'H':
        dispatch(decrementHealthPotion(1));
        dispatch(incrementMaiaCurrentHealth(Math.floor(maiaHealth / 2)));
        break;
      case 'B':
        dispatch(decrementBigHealthPotion(1));
        dispatch(incrementMaiaCurrentHealth(maiaHealth));
        break;
      case 'BOMB':
        dispatch(decrementBomb(1));
        // Solo descontar bomba, activar modo especial
        setSelectedItem(null);
        onHealingUsed(true, true); // true para used, true para bombUsed
        onClose();
        return; // Salir temprano para bomba
    }
    
    setSelectedItem(null);
    onHealingUsed(true);
    onClose();
  };

  // Funciones de navegación
  const handleNextPage = () => {
    if (page + 1 < totalPages) {
      setPage(page + 1);
      setSelectedItem(null);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
      setSelectedItem(null);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { width: '90%', height: '50%' }]}>
          
          {availableItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tienes objetos disponibles</Text>
            </View>
          ) : (
            <>
              <View style={styles.itemsContainer}>
                {paginatedItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.itemTouchable,
                      selectedItem?.id === item.id && styles.selectedItem
                    ]}
                    onPress={() => handleItemSelect(item)}
                  >
                    <item.icon />
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    {selectedItem?.id === item.id && (
                      <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>{item.name}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Paginación */}
              {totalPages > 1 && (
                <View style={styles.paginationContainer}>
                  <TouchableOpacity
                    style={styles.paginationButton}
                    onPress={handlePrevPage}
                    disabled={page === 0}
                  >
                    <Text style={[styles.paginationText, { color: page === 0 ? 'gray' : 'white' }]}>
                      {"<<"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.paginationButton}
                    onPress={handleNextPage}
                    disabled={page === totalPages - 1}
                  >
                    <Text style={[styles.paginationText, { color: page === totalPages - 1 ? 'gray' : 'white' }]}>
                      {">>"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Botón Usar */}
              {selectedItem && (
                <TouchableOpacity style={styles.useButton} onPress={handleUseItem}>
                  <Text style={styles.useButtonText}>Usar</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {/* Botón Cerrar */}
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => { 
              setSelectedItem(null); 
              setPage(0);
              onClose(); 
            }}
          >
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: font(18),
    color: '#fff',
    textAlign: 'center',
  },
  itemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: '3%',
    marginTop: '5%',
    paddingHorizontal: '2%',
  },
  itemTouchable: {
    width: '28%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: font(1.5),
    borderColor: 'black',
    marginVertical: '2%',
    position: 'relative',
  },
  selectedItem: {
    backgroundColor: '#f0f0f0',
    borderWidth: font(2),
    borderColor: 'black',
  },
  quantityText: {
    position: 'absolute',
    bottom: font(2),
    right: font(4),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    fontSize: font(12),
    fontWeight: 'bold',
    paddingHorizontal: font(4),
    paddingVertical: font(1),
    borderRadius: font(8),
    minWidth: font(16),
    textAlign: 'center',
  },
  infoContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: '3%',
    borderRadius: 5,
    alignItems: 'center',
    bottom: '103%',
    left: '5%',
    right: '5%',
  },
  infoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: font(14),
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '15%',
    marginBottom: '3%',
  },
  paginationButton: {
    padding: '3%',
  },
  paginationText: {
    fontSize: font(20),
    fontWeight: 'bold',
  },
  useButton: {
    backgroundColor: '#fff',
    paddingVertical: '3%',
    paddingHorizontal: '6%',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: '2%',
  },
  useButtonText: {
    color: '#000',
    fontSize: font(16),
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    bottom: font(10),
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingVertical: '3%',
    paddingHorizontal: '5%',
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#000',
    fontSize: font(16),
    fontWeight: 'bold',
  },
});
