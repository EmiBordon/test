import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { CoinsIcon, CrossIcon, DoubleArrowIcon } from '../SvgExporter';
import { useObjects, GameObject } from '../objects';
import { decrementObject } from '../../redux/objectsSlice';
import { incrementCoins } from '../../redux/coinsSlice';
import { font } from '../functions/fontsize';
import { decrementArrows, decrementBomb } from '../../redux/weaponsSlice';
import { decrementHealthPotion, decrementBigHealthPotion } from '../../redux/healingSlice';
import IconButton from '../functions/iconbutton';

interface CoinsState { coins: number; }
interface RootState { coins: CoinsState; }

interface PawnShopModalProps {
  visible: boolean;
  onClose: () => void;
}

const PawnShopModal: React.FC<PawnShopModalProps> = ({ visible, onClose }) => {
  const coins = useSelector((state: RootState) => state.coins.coins);
  const dispatch = useDispatch();
  const { treasures, inventory } = useObjects();

  const availableTreasures = treasures.filter(item => item.state > 0);
  const availableInventory = inventory.filter(item => item.state > 0 && item.price);
  const combinedItems = [...availableTreasures, ...availableInventory];
  const isEmpty = combinedItems.length === 0;

  const [selectedInfo, setSelectedInfo] = useState<{ item: GameObject; index: number } | null>(null);
  const [page, setPage] = useState(0);
  const itemsPerPage = 4;

  const hasPrev = page > 0;
  const hasNext = (page + 1) * itemsPerPage < combinedItems.length;

  const handleSell = (item: GameObject, index: number) => {
    if (item.state <= 0) return;
    setSelectedInfo(null);
    let sellPrice = item.price || 0;
    if (item.id === 'arrows') {
      dispatch(decrementArrows(1));
    } else if (item.id === 'bomb') {
      dispatch(decrementBomb(1));
      sellPrice = 70;
    } else if (item.id === 'healthpotion') {
      dispatch(decrementHealthPotion(1));
    } else if (item.id === 'bighealthpotion') {
      dispatch(decrementBigHealthPotion(1));
    } else {
      dispatch(decrementObject({ key: item.id as any, amount: 1 }));
    }
    dispatch(incrementCoins(sellPrice));
  };

  const handleNextPage = () => {
    if (hasNext) { setPage(p => p + 1); setSelectedInfo(null); }
  };
  const handlePrevPage = () => {
    if (hasPrev) { setPage(p => p - 1); setSelectedInfo(null); }
  };

  const paginatedItems = combinedItems.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage);

  const renderItem = ({ item, index }: { item: GameObject; index: number }) => (
    <View style={styles.itemContainer}>
      <item.icon width={font(32)} height={font(32)} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemText}>{item.name}</Text>
        <Text style={styles.itemStateText}>Cantidad: {item.state}</Text>
        <View style={styles.priceWrapper}>
          <CoinsIcon width={font(12)} height={font(12)} />
          <Text style={styles.itemPriceText}>{item.price}</Text>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, item.state <= 0 && styles.disabledButton]}
          onPress={() => handleSell(item, index)}
          disabled={item.state <= 0}
        >
          <Text style={styles.actionButtonText}>Vender</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.infoBtn]}
          onPress={() => setSelectedInfo({ item, index })}
        >
          <Text style={styles.actionButtonText}>Info</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
            <Text style={styles.title}>JOYERÍA</Text>
          </View>

          <View style={styles.divider} />

          {isEmpty ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.errorText}>No tienes objetos para vender</Text>
            </View>
          ) : (
            <>
              <FlatList
                data={paginatedItems}
                keyExtractor={(item) => item.name}
                renderItem={renderItem}
                style={{ flex: 1 }}
              />

              {combinedItems.length > itemsPerPage && (
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
            </>
          )}

          {selectedInfo && (
            <View style={styles.infoPanel}>
              <selectedInfo.item.icon width={font(46)} height={font(46)} />
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
    gap: font(8),
  },
  itemInfo: {
    flex: 1,
    gap: font(2),
  },
  itemText: {
    color: '#E8D5A3',
    fontSize: font(14),
    fontWeight: '600',
  },
  itemStateText: {
    color: '#c9b48a',
    fontSize: font(12),
  },
  priceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: font(3),
  },
  itemPriceText: {
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
  disabledButton: {
    backgroundColor: 'rgba(107,45,10,0.3)',
    borderColor: 'rgba(200,168,75,0.3)',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: '#c9b48a',
    fontSize: font(16),
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

export default PawnShopModal;
