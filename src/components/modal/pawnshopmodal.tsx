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
import { CoinsIcon } from '../SvgExporter';
import { useObjects, GameObject } from '../objects';
import { decrementObject } from '../../redux/objectsSlice';
import { incrementCoins } from '../../redux/coinsSlice';
import { font } from '../functions/fontsize';
import { decrementArrows } from '../../redux/weaponsSlice';
import { decrementHealthPotion } from '../../redux/healingSlice';
import { decrementBigHealthPotion } from '../../redux/healingSlice';

interface CoinsState {
  coins: number;
}

interface RootState {
  coins: CoinsState;
}

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
  const insufficientQuantity = combinedItems.length === 0;

  const [selectedInfo, setSelectedInfo] = useState<{ item: GameObject; index: number } | null>(null);
  const [page, setPage] = useState(0);
  const itemsPerPage = 4;

  const handleSell = (item: GameObject, index: number) => {
    if (item.state > 0) {
      setSelectedInfo(null);
      if (item.id === 'arrows') {
        dispatch(decrementArrows(1));
      } else if (item.id === 'healthpotion') {
        dispatch(decrementHealthPotion(1));
      } else if (item.id === 'bighealthpotion') {
        dispatch(decrementBigHealthPotion(1));
      } else {
        dispatch(decrementObject({ key: item.id as any, amount: 1 }));
      }
      dispatch(incrementCoins(item.price));
    }
  };

  const handleNextPage = () => {
    if ((page + 1) * itemsPerPage < combinedItems.length) {
      setPage(page + 1);
      setSelectedInfo(null);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
      setSelectedInfo(null);
    }
  };

  const paginatedItems = combinedItems.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  const renderItem = ({ item, index }: { item: GameObject; index: number }) => {
    return (
      <View style={styles.itemContainer}>
        <item.icon width={font(35)} height={font(35)} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemText}>{item.name}</Text>
          <Text style={styles.itemStateText}>Cantidad: {item.state}</Text>
          <Text style={styles.itemPriceText}>Precio: ${item.price}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.sellButton, item.state <= 0 && styles.disabledButton]}
            onPress={() => handleSell(item, index)}
            disabled={item.state <= 0}
          >
            <Text style={styles.sellButtonText}>Vender</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => setSelectedInfo({ item, index })}
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
          <Text style={styles.title}>JOYERIA</Text>
          
          {insufficientQuantity ? (
            <Text style={styles.errorText}>No tienes objetos para vender</Text>
          ) : (
            <>
            
              <FlatList
                data={paginatedItems}
                keyExtractor={(item) => item.name}
                renderItem={renderItem}
                style={{ flex: 1 }}
              />
              <View style={styles.paginationContainer}>
                <TouchableOpacity
                  style={styles.pageButton}
                  onPress={handlePrevPage}
                  disabled={page === 0}
                >
                  <Text style={[styles.pageButtonText, { color: page === 0 ? 'white' : 'black' }]}>{"<<"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.pageButton}
                  onPress={handleNextPage}
                  disabled={(page + 1) * itemsPerPage >= combinedItems.length}
                >
                  <Text
                    style={[
                      styles.pageButtonText,
                      {
                        color:
                          (page + 1) * itemsPerPage >= combinedItems.length
                            ? 'white'
                            : 'black',
                      },
                    ]}
                  >
                    {">>"}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {selectedInfo && (
            <View style={styles.infoPanel}>
              <selectedInfo.item.icon width={font(50)} height={font(50)} />
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
    fontSize: font(20),
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '3%',
    borderBottomWidth: font(1.3),
    borderColor: 'black',
  },
  itemInfo: {
    flex: 1,
    marginLeft: '2%',
  },
  itemText: {
    color: 'black',
    fontSize: font(14),
  },
  itemStateText: {
    color: 'black',
    fontSize: font(13),
  },
  itemPriceText: {
    color: 'black',
    fontSize: font(14),
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellButton: {
    backgroundColor: 'black',
    paddingHorizontal: '4%',
    paddingVertical: '2%',
    borderRadius: 5,
    marginRight: '5%',
  },
  sellButtonText: {
    color: 'white',
    fontSize: font(15),
  },
  infoButton: {
    backgroundColor: 'black',
    paddingHorizontal: '4%',
    paddingVertical: '2%',
    borderRadius: 5,
  },
  infoButtonText: {
    color: 'white',
    fontSize: font(15),
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
    fontSize: font(16),
  },
  infoPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '4%',
    marginVertical: '10%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: '1%',
  },
  infoText: {
    flex: 1,
    marginLeft: '7%',
    color: 'black',
    fontSize: font(16),
  },
  errorText: {
    textAlign: 'center',
    color: 'black',
    fontSize: font(17),
    marginTop: '150%',
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    width:'100%',
    bottom:'33%',
    
  },
  pageButton: {
    paddingHorizontal: '20%',
    paddingVertical: '3%',
    borderRadius: 5,
    marginHorizontal: '20%',
  },
  pageButtonText: {
    fontWeight: 'bold',
    fontSize: font(20),
  },
});

export default PawnShopModal;
