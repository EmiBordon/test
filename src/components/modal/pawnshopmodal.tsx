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
  // Obtenemos la cantidad de monedas del estado
  const coins = useSelector((state: RootState) => state.coins.coins);
  const dispatch = useDispatch();

  // Obtenemos la lista de tesoros (treasures). Asegurate de que cada objeto incluya la propiedad "price"
  const { treasures } = useObjects();

  // Filtramos para que solo se muestren los tesoros con state > 0
  const availableTreasures = treasures.filter(item => item.state > 0);

  // Computamos insufficientQuantity en base a la lista filtrada
  const insufficientQuantity = availableTreasures.length === 0;

  // Estado para mostrar información del objeto seleccionado
  const [selectedInfo, setSelectedInfo] = useState<{ item: GameObject; index: number } | null>(null);

  // Función para manejar la venta de un tesoro
  const handleSell = (item: GameObject, index: number) => {
    if (item.state > 0) {
      setSelectedInfo(null);
      // Decrementa 1 unidad del objeto vendido.
      dispatch(decrementObject({ key: item.id as any, amount: 1 }));
      // Incrementa las monedas según el precio del objeto.
      dispatch(incrementCoins(item.price));
    }
  };

  const renderItem = ({ item, index }: { item: GameObject; index: number }) => {
    return (
      <View style={styles.itemContainer}>
        <item.icon width={font(30)} height={font(30)} />
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
            <Text style={styles.errorText}>No tienes tesoros para vender</Text>
          ) : (
            <FlatList
              data={availableTreasures}
              keyExtractor={(item) => item.name}
              renderItem={renderItem}
              style={{ flex: 1 }}
            />
          )}
          {/* Panel de información */}
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
    borderBottomWidth: 1,
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
});

export default PawnShopModal;
