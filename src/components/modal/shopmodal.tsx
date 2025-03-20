import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  GrapesIcon,
  HealthPotionIcon,
  BigHealthPotionIcon,
  PillsIcon,
  CoinsIcon,
  QuiverArrowIcon,
  DaggersIcon
} from '../SvgExporter';
import { useSelector, useDispatch } from 'react-redux';
import { incrementGrapes, incrementHealthPotion, incrementBigHealthPotion } from '../../redux/healingSlice';
import { incrementArrows } from '../../redux/weaponsSlice';
import { decrementCoins } from '../../redux/coinsSlice';
import { incrementMaiaHealth } from '../../redux/maiaSlice';
import { setCurrentWeapon } from '../../redux/weaponsSlice';
import { font } from '../functions/fontsize';

interface CoinsState {
  coins: number;
}
interface WeaponsState {
  currentWeapon: number;
}

interface RootState {
  coins: CoinsState;
  weapons: WeaponsState;
}

interface Item {
  id: string;
  name: string;
  price: number;
  amount?: string;
  description: string;
}

interface ShopModalProps {
  visible: boolean;
  onClose: () => void;
}

const shopItems: Item[] = [
  { id: '1', name: 'Uvas', price: 5, description: 'Aumentan el 20% de la Salud' },
  { id: '2', name: 'Frasco de Salud', price: 20, description: 'Aumenta el 50% de la Salud' },
  { id: '3', name: 'Gran Frasco de Salud', price: 45, description: 'Aumenta el 100% de la Salud' },
  { id: '4', name: 'Pildoras', price: 50, description: 'Aumenta 5 puntos de Salud Total' },
  { id: '5', name: 'Flechas', amount: 'X3', price: 10, description: 'Flechas para contrarrestar ataques enemigos' },
  { id: '6', name: 'Dagas', price: 70, description: 'Poderosas Dagas' },
];

// Definimos un tipo para los componentes de ícono que reciben width y height.
type IconComponentType = React.ComponentType<{ width?: number; height?: number; style?: any }>;

// Función para obtener el componente de ícono según el índice.
const getIconComponent = (index: number): IconComponentType | null => {
  switch (index) {
    case 0:
      return GrapesIcon;
    case 1:
      return HealthPotionIcon;
    case 2:
      return BigHealthPotionIcon;
    case 3:
      return PillsIcon;
    case 4:
      return QuiverArrowIcon;
    case 5:
      return DaggersIcon;  
    default:
      return null;
  }
};

const ShopModal: React.FC<ShopModalProps> = ({ visible, onClose }) => {
  const coins = useSelector((state: RootState) => state.coins.coins);
  const weapon = useSelector((state: RootState) => state.weapons.currentWeapon);
  const dispatch = useDispatch();
  
  // Estado para almacenar el objeto seleccionado para mostrar la info.
  const [selectedInfo, setSelectedInfo] = useState<{ item: Item; index: number } | null>(null);
  // Estado para mostrar mensaje de monedas insuficientes.
  const [insufficientCoins, setInsufficientCoins] = useState(false);

  // Filtrar los ítems para que si weapon > 0 no se muestre "Dagas"
  const filteredShopItems = shopItems.filter(item => !(weapon > 0 && item.name === 'Dagas'));

  // Función para manejar la compra del ítem
  const handlePurchase = (item: Item, index: number) => {
    // Evitamos la compra de Dagas si weapon > 0, por seguridad.
    if (item.name === 'Dagas' && weapon > 0) {
      return;
    }
    if (coins >= item.price) {
      setInsufficientCoins(false);
      setSelectedInfo(null);
      switch (item.name) {
        case 'Uvas':
          dispatch(incrementGrapes(1));
          break;
        case 'Frasco de Salud':
          dispatch(incrementHealthPotion(1));
          break;
        case 'Gran Frasco de Salud':
          dispatch(incrementBigHealthPotion(1));
          break;
        case 'Pildoras':
          dispatch(incrementMaiaHealth(5));
          break;
        case 'Flechas':
          dispatch(incrementArrows(3)); // Aumenta 3 flechas
          break;
        case 'Dagas':
          dispatch(setCurrentWeapon(1));
          break;
        default:
          break;
      }
      // Reducimos los coins de acuerdo al precio del ítem.
      dispatch(decrementCoins(item.price));
    } else {
      setInsufficientCoins(true);
      setSelectedInfo(null);
    }
  };

  const renderItem = ({ item, index }: { item: Item; index: number }) => {
    const IconComponent = getIconComponent(index);
    return (
      <View style={styles.itemContainer}>
        {IconComponent && <IconComponent width={font(29)} height={font(29)} />}
        <Text style={styles.itemText}>{item.name} {item.amount}</Text>
        <Text style={styles.priceText}>${item.price}</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.buyButton} onPress={() => handlePurchase(item, index)}>
            <Text style={styles.buyButtonText}>Comprar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => { setInsufficientCoins(false); setSelectedInfo({ item, index }); }}
          >
            <Text style={styles.infoButtonText}>Info</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.coinsBar}>
            <View style={styles.coinsContainer}>
              <CoinsIcon height={font(18)} width={font(18)} style={styles.coinsIcon} />
              <Text style={styles.coinsBarText}>{coins}</Text>
            </View>
          </View>
          <Text style={styles.title}>TIENDA</Text>
          <FlatList
            data={filteredShopItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            style={{ flex: 1 }}
          />
          {insufficientCoins && (
            <Text style={styles.errorText}>No tienes Monedas suficientes</Text>
          )}
          {/* Panel de información */}
          {selectedInfo && (
            <View style={styles.infoPanel}>
              {(() => {
                const SelectedIcon = getIconComponent(selectedInfo.index);
                return SelectedIcon ? <SelectedIcon width={font(50)} height={font(50)} /> : null;
              })()}
              <Text style={styles.infoText}>
                {selectedInfo.item.description}.
              </Text>
            </View>
          )}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: '5%',
  },
  title: {
    fontSize: font(24),
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
    marginBottom: '5%',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '3%',
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  itemText: {
    flex: 1,
    color: 'black',
    fontSize: font(15),
    textAlign: 'left',
    marginLeft: '2%',
  },
  priceText: {
    color: 'black',
    fontSize: font(15),
    marginRight: '3%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: 'black',
    paddingHorizontal: '4%',
    paddingVertical: '2%',
    borderRadius: 5,
    marginRight: '5%',
  },
  buyButtonText: {
    color: 'white',
    fontSize: font(14),
  },
  infoButton: {
    backgroundColor: 'black',
    paddingHorizontal: '4%',
    paddingVertical: '2%',
    borderRadius: 5,
  },
  infoButtonText: {
    color: 'white',
    fontSize: font(14),
  },
  closeButton: {
    marginTop: '5%',
    alignSelf: 'center',
    backgroundColor: 'black',
    paddingHorizontal: '10%',
    paddingVertical: '3%',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: font(15),
  },
  coinsBar: {
    position: 'absolute',
    bottom: '98%',
    left: '8%',
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinsIcon: {
    marginRight: '5%',
  },
  coinsBarText: {
    color: 'black',
    fontSize: font(19),
    fontWeight: 'bold',
  },
  infoPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '4%',
    marginVertical: '1%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  infoText: {
    flex: 1,
    marginLeft: '7%',
    color: 'black',
    fontSize: font(15),
  },
  errorText: {
    textAlign: 'center',
    color: 'black',
    fontSize: font(16),
    marginTop: '8%',
  },
});

export default ShopModal;
