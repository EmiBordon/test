import React, { useState, useEffect } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import CurrentWeaponIcon from '../currentweapon';
import QuiverIcon from '../quiver';
import { CrossBowIcon, BowIcon } from '../SvgExporter';
import HealingIcon from '../healingicon';
import { decrementBigHealthPotion, decrementGrapes, decrementHealthPotion } from '../../redux/healingSlice';
import { useDispatch, useSelector } from "react-redux";
import { incrementMaiaCurrentHealth, incrementMaiaHealth } from '../../redux/maiaSlice';
import { useObjects } from '../objects'; // Ajustá la ruta según tu proyecto
import { font } from '../functions/fontsize';

// Definir el tipo del estado de Redux para la curación
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

interface BagPackModalProps {
  visible: boolean;
  onClose: () => void;
}

const BagPackModal: React.FC<BagPackModalProps> = ({ visible, onClose }) => {
  const { width, height } = Dimensions.get('window');
  const [showCrossbowInfo, setShowCrossbowInfo] = useState(false);
  // Estado para saber qué HealingIcon fue presionado ('G', 'H', 'B' o null si ninguno)
  const [selectedHealing, setSelectedHealing] = useState<'G' | 'H' | 'B' | null>(null);
  // Estado para controlar si se muestra la página de objetos
  const [showExtraSlots, setShowExtraSlots] = useState(false);
  // Estado para la paginación de objetos (7 items por página)
  const [currentObjectPage, setCurrentObjectPage] = useState(0);
  const dispatch = useDispatch();

  // Reiniciar la página de objetos al cambiar a la vista de objetos
  useEffect(() => {
    if (showExtraSlots) {
      setCurrentObjectPage(0);
    }
  }, [showExtraSlots]);

  // Obtener el estado de curación desde Redux
  const healingState = useSelector((state: RootState) => state.healing);
  const maiaHealth = useSelector((state: RootState) => state.maia.maiahealth);

  // Obtener keys y treasures desde el hook
  const { treasures, keys } = useObjects();
  // Filtrar aquellos objetos con estado > 0
  const availableKeys = keys.filter(obj => obj.state > 0);
  const availableTreasures = treasures.filter(obj => obj.state > 0);
  // Combinar priorizando keys
  const availableObjects = [...availableKeys, ...availableTreasures];

  // Configuración de paginación: 7 items por página
  const pageSize = 6;
  const totalPages = Math.ceil(availableObjects.length / pageSize);
  const displayedObjects = availableObjects.slice(currentObjectPage * pageSize, (currentObjectPage + 1) * pageSize);

  // Callback para alternar la selección (seleccionar/deseleccionar)
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
      dispatch(incrementMaiaCurrentHealth(Math.floor(maiaHealth / 5)));
    } else if (selectedHealing === 'H') {
      dispatch(decrementHealthPotion(1));
      dispatch(incrementMaiaCurrentHealth(Math.floor(maiaHealth / 2)));
    } else if (selectedHealing === 'B') {
      dispatch(decrementBigHealthPotion(1));
      dispatch(incrementMaiaCurrentHealth(maiaHealth));
    }
    setSelectedHealing(null);
  };

  // Verifica si se puede usar el objeto de curación
  const canUseHealing =
    (selectedHealing === 'G' && healingState.grapes > 0) ||
    (selectedHealing === 'H' && healingState.healthpotion > 0) ||
    (selectedHealing === 'B' && healingState.bighealthpotion > 0);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { width: '90%', height: '60%' }]}>
        {!showExtraSlots ? (
          <Text style={styles.headerText}>Mochila</Text>
        ) : (
          <Text style={styles.headerText}>Objetos</Text>
        ) }
          {/* Si showExtraSlots es false, mostramos la página original; de lo contrario, la lista de objetos */}
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
                  <View style={styles.itemTouchable2}>
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

                  <View style={styles.itemTouchable2}>
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

                  <View style={styles.itemTouchable2}>
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
              </View>

              {/* Botón "Usar" solo se muestra en la página original */}
              {selectedHealing && canUseHealing && (
                <TouchableOpacity style={styles.useButton} onPress={handleUseHealing}>
                  <Text style={styles.useButtonText}>Usar</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            // Segunda página: renderizamos la lista de objetos con paginación
            <>
              <View style={styles.objectListContainer}>
                {displayedObjects.map((obj, index) => (
                  <View key={index} style={styles.objectListItem}>
                    <obj.icon style={styles.objectIcon} width={font(30)} height={font(30)} />
                    <Text style={styles.objectListText}>
                      {obj.name} ({obj.state})
                    </Text>
                  </View>
                ))}
                   {totalPages > 1 && (
               <View style={styles.paginationContainer}>
               <TouchableOpacity
                 onPress={() => setCurrentObjectPage(Math.max(currentObjectPage - 1, 0))}
                 disabled={currentObjectPage === 0}
                 style={styles.paginationButton}
               >
                 <Text style={[
                   styles.paginationButtonText, 
                   { color: currentObjectPage === 0 ? 'gray' : 'white' } // Aquí decides el color
                 ]}>
                   {"<<"}
                 </Text>
               </TouchableOpacity>
               <TouchableOpacity
                 onPress={() => setCurrentObjectPage(Math.min(currentObjectPage + 1, totalPages - 1))}
                 disabled={currentObjectPage === totalPages - 1}
                 style={styles.paginationButton}
               >
                 <Text style={[
                   styles.paginationButtonText, 
                   { color: currentObjectPage === totalPages - 1 ? 'gray' : 'white' }
                 ]}>
                   {">>"}
                 </Text>
               </TouchableOpacity>
             </View>
              )}
              </View>
              
              
            </>
          )}

          {/* Botón "Cerrar" siempre visible */}
          <TouchableOpacity style={styles.closeButton} onPress={() => { setSelectedHealing(null); onClose();setShowExtraSlots(false); }}>
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
    width: '90%',
    height: '60%',
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
    fontSize: font(24),
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: '2%',
    alignSelf: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sectionContainer: {
    height:'80%',
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: '5%',
  },
  itemsContainer2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  itemTouchable: {
    width: '28%',
    height: '1%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'black',
    marginVertical: '2%',
    marginBottom: '10%',
    marginTop: '10%',
  },
  itemTouchable2: {
    width: '28%',
    height: '1%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'black',
    marginVertical: '2%',
    marginBottom: '25%',
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
  infoContainer2: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: '2%',
    borderRadius: 5,
    alignItems: 'center',
    bottom: '80%',
    left: '58%',
    transform: [{ translateX: -50 }],
  },
  infoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: font(13),
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
    fontSize: font(17),
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#fff',
    paddingVertical: '3%',
    paddingHorizontal: '5%',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: '5%',
  },
  closeButtonText: {
    color: '#000',
    fontSize: font(17),
    fontWeight: 'bold',
  },
  extraSlotsToggle: {
    position: 'absolute',
    bottom: '2%',
    right: '5%',
    backgroundColor: '#fff',
    padding: '3%',
    borderRadius: 10,
  },
  extraSlotsToggleText: {
    fontSize: font(17),
    fontWeight: 'bold',
    color: '#000',
  },
  // Estilos para la lista de objetos en la segunda página
  objectListContainer: {
    flexDirection: 'column',
    paddingVertical: '3%',
    height:'80%',
  },
  objectListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: '1%',
    backgroundColor:'white',
    borderWidth: font(1.5),
    borderRadius: 10,
  },
  objectListText: {
    fontSize: font(15),
    marginLeft: '3%',
    color: 'black',
    fontWeight: 'bold',
  },
  objectIcon: {
    marginLeft: '3%',
    marginVertical: '1%',
  },
  // Estilos para los controles de paginación
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '2%',
    paddingHorizontal: '3%',
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },
  paginationButton: {
    padding: '4%',
  },
  paginationButtonText: {
    fontSize: font(19),
    fontWeight: 'bold',
    
  },
});
