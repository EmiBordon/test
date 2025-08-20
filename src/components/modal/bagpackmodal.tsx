import React, { useState, useEffect } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { GrapesIcon, HealthPotionIcon, BigHealthPotionIcon, QuiverArrowIcon, BowIcon, DaggersIcon, SwordIcon, BombIcon } from '../SvgExporter';
import { decrementBigHealthPotion, decrementGrapes, decrementHealthPotion } from '../../redux/healingSlice';
import { useDispatch, useSelector } from "react-redux";
import { incrementMaiaCurrentHealth } from '../../redux/maiaSlice';
import { useObjects, GameObject } from '../objects';
import { font } from '../functions/fontsize';

// Definir el tipo del estado de Redux
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
    currentWeapon: number;
  };
}

// Tipo extendido para incluir objetos curativos y otros
interface ExtendedGameObject extends GameObject {
  type: 'healing' | 'weapon' | 'treasure' | 'key' | 'other';
  healingType?: 'grapes' | 'healthpotion' | 'bighealthpotion';
}

interface BagPackModalProps {
  visible: boolean;
  onClose: () => void;
}

const BagPackModal: React.FC<BagPackModalProps> = ({ visible, onClose }) => {
  const [selectedItem, setSelectedItem] = useState<ExtendedGameObject | null>(null);
  const [page, setPage] = useState(0);
  const dispatch = useDispatch();

  // Obtener estados desde Redux
  const healingState = useSelector((state: RootState) => state.healing);
  const maiaHealth = useSelector((state: RootState) => state.maia.maiahealth);
  const currentWeapon = useSelector((state: RootState) => state.weapons.currentWeapon);

  // Obtener objetos desde el hook
  const { treasures, keys, inventory } = useObjects();

  // Crear lista completa de objetos incluyendo curativos
  const createCompleteItemList = (): ExtendedGameObject[] => {
    const allItems: ExtendedGameObject[] = [];

    // PRIORIDAD 1: Agregar arma actual basada en currentWeapon (espada/dagas primero)
    if (currentWeapon === 1) {
      allItems.push({
        id: 'daggers',
        name: 'Dagas',
        description: 'Poderosas Dagas de combate, aumenta tu Daño a 3',
        icon: DaggersIcon,
        state: 1,
        type: 'weapon'
      } as ExtendedGameObject);
    } else if (currentWeapon === 0) {
      allItems.push({
        id: 'sword',
        name: 'Espada',
        description: 'Espada de combate avanzada',
        icon: SwordIcon,
        state: 1,
        type: 'weapon'
      } as ExtendedGameObject);
    }

    // PRIORIDAD 2: Agregar arco (arma base)
    allItems.push({
      id: 'bow',
      name: 'Arco',
      description: 'Arma de combate a distancia básica',
      icon: BowIcon,
      state: 1,
      type: 'weapon'
    } as ExtendedGameObject);

    // PRIORIDAD 3: Agregar flechas del inventario
    const arrowItem = inventory.find(item => item.id === 'arrows');
    if (arrowItem && typeof arrowItem.state === 'number' && arrowItem.state > 0) {
      allItems.push({
        ...arrowItem,
        type: 'weapon'
      } as ExtendedGameObject);
    }

    // PRIORIDAD 4: Agregar bomba del inventario
    const bombItem = inventory.find(item => item.id === 'bomb');
    if (bombItem && typeof bombItem.state === 'number' && bombItem.state > 0) {
      allItems.push({
        ...bombItem,
        type: 'weapon'
      } as ExtendedGameObject);
    }

    // PRIORIDAD 5: Agregar objetos curativos
    if (healingState.grapes > 0) {
      allItems.push({
        id: 'grapes',
        name: 'Uvas',
        description: 'Aumentan el 20% de la Salud',
        icon: GrapesIcon,
        state: healingState.grapes,
        type: 'healing',
        healingType: 'grapes'
      });
    }

    // Agregar pociones de curación del inventario
    const healingInventory = inventory.filter(item => 
      (item.id === 'healthpotion' || item.id === 'bighealthpotion') && 
      typeof item.state === 'number' && item.state > 0
    );
    
    healingInventory.forEach(item => {
      allItems.push({
        ...item,
        type: 'healing',
        healingType: item.id as 'healthpotion' | 'bighealthpotion'
      } as ExtendedGameObject);
    });

    // PRIORIDAD 6: Agregar tesoros con cantidad > 0
    treasures.forEach(treasure => {
      if (typeof treasure.state === 'number' && treasure.state > 0) {
        allItems.push({
          ...treasure,
          type: 'treasure'
        } as ExtendedGameObject);
      }
    });

    // PRIORIDAD 7: Agregar llaves al final con estado true
    keys.forEach(key => {
      if (typeof key.state === 'boolean' && key.state) {
        allItems.push({
          ...key,
          state: 1, // Convertir boolean a número para visualización
          type: 'key'
        } as ExtendedGameObject);
      }
    });

    return allItems;
  };

  const allItems = createCompleteItemList();
  
  // Configuración de paginación
  const itemsPerPage = 4;
  const totalPages = Math.ceil(allItems.length / itemsPerPage);
  const paginatedItems = allItems.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  // Función para manejar la selección de objetos
  const handleItemSelect = (item: ExtendedGameObject) => {
    if (selectedItem?.id === item.id) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  // Función para usar objetos curativos
  const handleUseHealing = () => {
    if (!selectedItem || selectedItem.type !== 'healing') return;

    switch (selectedItem.healingType) {
      case 'grapes':
        dispatch(decrementGrapes(1));
        dispatch(incrementMaiaCurrentHealth(Math.floor(maiaHealth / 5)));
        break;
      case 'healthpotion':
        dispatch(decrementHealthPotion(1));
        dispatch(incrementMaiaCurrentHealth(Math.floor(maiaHealth / 2)));
        break;
      case 'bighealthpotion':
        dispatch(decrementBigHealthPotion(1));
        dispatch(incrementMaiaCurrentHealth(maiaHealth));
        break;
    }
    setSelectedItem(null);
  };

  // Verificar si el objeto seleccionado es usable
  const canUseSelected = selectedItem?.type === 'healing' && typeof selectedItem.state === 'number' && selectedItem.state > 0;

  // Funciones de navegación
  const handleNextPage = () => {
    if ((page + 1) * itemsPerPage < allItems.length) {
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

  const renderItem = ({ item }: { item: ExtendedGameObject }) => {
    const isSelected = selectedItem?.id === item.id;
    
    // No mostrar cantidad para arco, espada, dagas y llaves
    const shouldShowQuantity = !(
      item.id === 'bow' || 
      item.id === 'sword' || 
      item.id === 'daggers' || 
      item.type === 'key'
    );
    
    return (
      <TouchableOpacity
        style={[styles.itemRow, isSelected && styles.selectedItemRow]}
        onPress={() => handleItemSelect(item)}
      >
        <item.icon width={font(25)} height={font(25)} style={styles.itemIcon} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          {shouldShowQuantity && (
            <Text style={styles.itemQuantity}>{item.state}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.headerText}>Mochila</Text>
          
          {allItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tienes objetos en tu mochila</Text>
            </View>
          ) : (
            <>
              <View style={styles.itemsContainer}>
                {paginatedItems.map((item) => (
                  <View key={item.id}>
                    {renderItem({ item })}
                  </View>
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
                    <Text style={[styles.paginationButtonText, { color: page === 0 ? 'gray' : 'white' }]}>
                      {"<<"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.paginationButton}
                    onPress={handleNextPage}
                    disabled={page === totalPages - 1}
                  >
                    <Text style={[styles.paginationButtonText, { color: page === totalPages - 1 ? 'gray' : 'white' }]}>
                      {">>"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
          
          {/* Descripción del objeto seleccionado */}
          {selectedItem && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>
                {selectedItem.description || 'Sin descripción disponible'}
              </Text>
            </View>
          )}
          
          {/* Botón Usar (solo para objetos curativos) */}
          {canUseSelected && (
            <TouchableOpacity style={styles.useButton} onPress={handleUseHealing}>
              <Text style={styles.useButtonText}>Usar</Text>
            </TouchableOpacity>
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

export default BagPackModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    height: '70%',
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
    fontSize: font(24),
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: '3%',
    alignSelf: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
    flex: 1,
    paddingVertical: '2%',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginVertical: '1%',
    padding: '2%',
    borderRadius: 8,
    borderWidth: font(1.5),
    borderColor: 'black',
    height: font(60),
  },
  selectedItemRow: {
    backgroundColor: '#f0f0f0',
    borderColor: 'black',
    borderWidth: font(2),
  },
  itemIcon: {
    marginRight: '2%',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: font(14),
    fontWeight: 'bold',
    color: 'black',
    marginBottom: '1%',
  },
  itemQuantity: {
    fontSize: font(12),
    color: '#666',
  },

  descriptionContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: '3%',
    borderRadius: 10,
    marginBottom: '3%',
  },
  descriptionText: {
    color: '#fff',
    fontSize: font(14),
    textAlign: 'center',
  },
  useButton: {
    backgroundColor: 'black',
    paddingVertical: '3%',
    paddingHorizontal: '6%',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: '3%',
  },
  useButtonText: {
    color: 'white',
    fontSize: font(16),
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#fff',
    paddingVertical: '3%',
    paddingHorizontal: '5%',
    borderRadius: 10,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#000',
    fontSize: font(17),
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    marginBottom: '3%',
  },
  paginationButton: {
    padding: '3%',
  },
  paginationButtonText: {
    fontSize: font(20),
    fontWeight: 'bold',
  },
});
