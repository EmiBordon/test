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
  DaggersIcon,
  DoubleDiceIcon,
  Dice666Icon,
  BombIcon,
  CrossIcon,
  DoubleArrowIcon,
} from '../SvgExporter';
import { useSelector, useDispatch } from 'react-redux';
import { incrementGrapes, incrementHealthPotion, incrementBigHealthPotion } from '../../redux/healingSlice';
import { incrementArrows, incrementBomb } from '../../redux/weaponsSlice';
import { decrementCoins } from '../../redux/coinsSlice';
import { incrementMaiaHealth } from '../../redux/maiaSlice';
import { setCurrentWeapon } from '../../redux/weaponsSlice';
import { incrementObject } from '../../redux/objectsSlice';
import { font } from '../functions/fontsize';
import IconButton from '../functions/iconbutton';

interface CoinsState { coins: number; }
interface WeaponsState { currentWeapon: number; }
interface RootState { coins: CoinsState; weapons: WeaponsState; }

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
  { id: '6', name: 'Bomba', price: 100, description: 'Explosivo potente para combate' },
  { id: '7', name: 'Dagas', price: 70, description: 'Poderosas Dagas de combate, aumenta tu Daño a 3' },
  { id: '8', name: 'Dado Doble', price: 50, description: 'Dado Doble, se puede revender a magos' },
  { id: '9', name: 'Dado Seis', price: 50, description: 'Dado Seis, se puede revender a magos' },
];

type IconComponentType = React.ComponentType<{ width?: number; height?: number; style?: any }>;

const getIconComponent = (itemId: string): IconComponentType | null => {
  switch (itemId) {
    case '1': return GrapesIcon;
    case '2': return HealthPotionIcon;
    case '3': return BigHealthPotionIcon;
    case '4': return PillsIcon;
    case '5': return QuiverArrowIcon;
    case '6': return BombIcon;
    case '7': return DaggersIcon;
    case '8': return DoubleDiceIcon;
    case '9': return Dice666Icon;
    default:  return null;
  }
};

const ShopModal: React.FC<ShopModalProps> = ({ visible, onClose }) => {
  const coins = useSelector((state: RootState) => state.coins.coins);
  const weapon = useSelector((state: RootState) => state.weapons.currentWeapon);
  const dispatch = useDispatch();

  const [selectedInfo, setSelectedInfo] = useState<{ item: Item } | null>(null);
  const [insufficientCoins, setInsufficientCoins] = useState(false);
  const [page, setPage] = useState(0);

  const filteredShopItems = shopItems.filter(item => !(weapon > 0 && item.name === 'Dagas'));
  const itemsPerPage = 5;
  const paginatedItems = filteredShopItems.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage);
  const hasPrev = page > 0;
  const hasNext = (page + 1) * itemsPerPage < filteredShopItems.length;

  const handlePurchase = (item: Item) => {
    if (item.name === 'Dagas' && weapon > 0) return;
    if (coins >= item.price) {
      setInsufficientCoins(false);
      setSelectedInfo(null);
      switch (item.name) {
        case 'Uvas':               dispatch(incrementGrapes(1)); break;
        case 'Frasco de Salud':    dispatch(incrementHealthPotion(1)); break;
        case 'Gran Frasco de Salud': dispatch(incrementBigHealthPotion(1)); break;
        case 'Pildoras':           dispatch(incrementMaiaHealth(3)); break;
        case 'Flechas':            dispatch(incrementArrows(3)); break;
        case 'Bomba':              dispatch(incrementBomb(1)); break;
        case 'Dagas':              dispatch(setCurrentWeapon(1)); break;
        case 'Dado Doble':         dispatch(incrementObject({ key: 'doubledice', amount: 1 })); break;
        case 'Dado Seis':          dispatch(incrementObject({ key: 'sixdice', amount: 1 })); break;
      }
      dispatch(decrementCoins(item.price));
    } else {
      setInsufficientCoins(true);
      setSelectedInfo(null);
    }
  };

  const handleNextPage = () => {
    if (hasNext) { setPage(p => p + 1); setSelectedInfo(null); setInsufficientCoins(false); }
  };
  const handlePrevPage = () => {
    if (hasPrev) { setPage(p => p - 1); setSelectedInfo(null); setInsufficientCoins(false); }
  };

  const renderItem = ({ item }: { item: Item }) => {
    const IconComponent = getIconComponent(item.id);
    return (
      <View style={styles.itemContainer}>
        {IconComponent && <IconComponent width={font(28)} height={font(28)} />}
        <Text style={styles.itemText}>{item.name}{item.amount ? ` ${item.amount}` : ''}</Text>
        <View style={styles.priceWrapper}>
          <CoinsIcon width={font(13)} height={font(13)} />
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => handlePurchase(item)}>
            <Text style={styles.actionButtonText}>Comprar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.infoBtn]}
            onPress={() => { setInsufficientCoins(false); setSelectedInfo({ item }); }}
          >
            <Text style={styles.actionButtonText}>Info</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>

          {/* CrossIcon absoluto arriba a la derecha */}
          <IconButton
            Icon={CrossIcon}
            width={font(26)}
            height={font(26)}
            style={styles.closeIcon}
            onPress={onClose}
          />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.coinsContainer}>
              <CoinsIcon height={font(16)} width={font(16)} />
              <Text style={styles.coinsText}>{coins}</Text>
            </View>
            <Text style={styles.title}>TIENDA</Text>
          </View>

          <View style={styles.divider} />

          <FlatList
            data={paginatedItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            style={{ flex: 1 }}
          />

          {/* Paginación */}
          {filteredShopItems.length > itemsPerPage && (
            <View style={styles.paginationContainer}>
              <TouchableOpacity onPress={handlePrevPage} disabled={!hasPrev} style={styles.pageBtn}>
                <DoubleArrowIcon
                  width={font(24)} height={font(24)}
                  style={{ opacity: hasPrev ? 1 : 0.3, transform: [{ scaleX: -1 }] }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNextPage} disabled={!hasNext} style={styles.pageBtn}>
                <DoubleArrowIcon
                  width={font(24)} height={font(24)}
                  style={{ opacity: hasNext ? 1 : 0.3 }}
                />
              </TouchableOpacity>
            </View>
          )}

          {insufficientCoins && (
            <Text style={styles.errorText}>No tienes monedas suficientes</Text>
          )}

          {selectedInfo && (
            <View style={styles.infoPanel}>
              {(() => {
                const SelectedIcon = getIconComponent(selectedInfo.item.id);
                return SelectedIcon ? <SelectedIcon width={font(46)} height={font(46)} /> : null;
              })()}
              <Text style={styles.infoText}>{selectedInfo.item.description}</Text>
            </View>
          )}

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    height: '80%',
    backgroundColor: 'rgb(92, 50, 30)',
    borderRadius: font(12),
    borderWidth: 3,
    borderColor: '#C8A84B',
    padding: font(16),
    shadowColor: '#C8A84B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 12,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: font(8),
    paddingTop: font(4),
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: font(4),
  },
  coinsText: {
    color: '#C8A84B',
    fontSize: font(16),
    fontWeight: 'bold',
  },
  title: {
    fontSize: font(22),
    fontWeight: 'bold',
    color: '#C8A84B',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  closeIcon: {
    position: 'absolute',
    top: font(10),
    right: font(10),
    zIndex: 10,
  },
  divider: {
    height: 1.5,
    backgroundColor: '#C8A84B',
    opacity: 0.5,
    marginBottom: font(8),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: font(8),
    borderBottomWidth: 1,
    borderColor: 'rgba(200,168,75,0.3)',
    gap: font(6),
  },
  itemText: {
    flex: 1,
    color: '#E8D5A3',
    fontSize: font(14),
  },
  priceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: font(3),
    marginRight: font(6),
  },
  priceText: {
    color: '#C8A84B',
    fontSize: font(13),
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: font(4),
  },
  actionButton: {
    backgroundColor: '#6B2D0A',
    paddingHorizontal: font(8),
    paddingVertical: font(4),
    borderRadius: font(5),
    borderWidth: 1,
    borderColor: '#C8A84B',
  },
  infoBtn: {
    backgroundColor: 'rgba(18,7,2,0.8)',
  },
  actionButtonText: {
    color: '#E8D5A3',
    fontSize: font(12),
    fontWeight: '600',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: font(32),
    marginVertical: font(6),
  },
  pageBtn: {
    padding: font(6),
  },
  errorText: {
    textAlign: 'center',
    color: '#e57373',
    fontSize: font(14),
    marginTop: font(6),
  },
  infoPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: font(10),
    marginTop: font(6),
    borderWidth: 1.5,
    borderColor: '#C8A84B',
    borderRadius: font(8),
    backgroundColor: 'rgba(18,7,2,0.5)',
    gap: font(10),
  },
  infoText: {
    flex: 1,
    color: '#c9b48a',
    fontSize: font(13),
    lineHeight: font(18),
  },
});

export default ShopModal;
