import React, { useState } from "react";
import { Modal, View, TouchableOpacity, Text, StyleSheet, Dimensions, Alert, Image } from "react-native";
import {
  HouseIcon, PrisionIcon, StoreIcon, RestaurantIcon, BigHouseIcon, CaveIcon, CrossIcon, PawnShopIcon
} from "../SvgExporter";
import { font } from "../functions/fontsize";
import IconButton from "../functions/iconbutton";

const ICONS = [
  { key: "house",      Component: HouseIcon,      size: font(55), text: "Casa",    top: "35%", left: "9%",  tx: -30, ty: -30, route: "Tutorial" },
  { key: "prison",     Component: PrisionIcon,    size: font(60), text: "Prisión", top: "68%", left: "77%", tx: -30, ty: -30, route: "Prision"  },
  { key: "store",      Component: StoreIcon,      size: font(50), text: "Tienda",  top: "58%", left: "55%", tx: -30, ty: -30, route: "Shop"     },
  { key: "restaurant", Component: RestaurantIcon, size: font(55), text: "Bar",     top: "40%", left: "33%", tx: -30, ty: -30, route: "Bar"      },
  { key: "bigHouse",   Component: BigHouseIcon,   size: font(65), text: "Mansión", top: "35%", left: "88%", tx: -40, ty: -40, route: null       },
  { key: "cave",       Component: CaveIcon,       size: font(40), text: "Cueva",   top: "70%", left: "42%", tx: -30, ty: -30, route: "Cave"     },
  { key: "pawnShop",   Component: PawnShopIcon,   size: font(55), text: "Joyeria", top: "84%", left: "74%", tx: -30, ty: -30, route: "PawnShop" },
];

const Map1Modal = ({ visible, onClose, navigation }) => {
  const { height } = Dimensions.get("window");
  const modalHeight = height * 0.7;

  const [selected, setSelected] = useState<string | null>(null);
  const selectedItem = ICONS.find(i => i.key === selected);

  const handleGo = () => {
    if (!selectedItem) return;
    if (selectedItem.route === null) {
      Alert.alert("Mansion no disponible en la demo");
    } else {
      onClose();
      navigation.replace(selectedItem.route);
    }
    setSelected(null);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { height: modalHeight }]}>

          <Image
            source={require('../../images/map1.jpg')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />

          {selectedItem && (
            <View style={styles.promptBar}>
              <Text style={styles.promptText}>¿Deseas viajar a {selectedItem.text}?</Text>
              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.actionButton} onPress={handleGo}>
                  <Text style={styles.actionButtonText}>Ir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => setSelected(null)}>
                  <Text style={styles.actionButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {ICONS.map(({ key, Component, size, text, top, left, tx, ty }) => (
            <IconButton
              key={key}
              Icon={Component}
              width={size}
              height={size}
              style={{ top, left, transform: [{ translateX: tx }, { translateY: ty }], zIndex: 20 }}
              onPress={() => setSelected(key)}
            >
              {selected === key && (
                <View style={styles.nameTag}>
                  <Text style={styles.nameText}>{text}</Text>
                </View>
              )}
            </IconButton>
          ))}

          <IconButton
            Icon={CrossIcon}
            width={30}
            height={30}
            style={{ top: 10, right: 10, zIndex: 10 }}
            onPress={() => { onClose(); setSelected(null); }}
          />

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "95%",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "black",
    justifyContent: "center",
  },
  promptBar: {
    position: "absolute",
    top: "5%",
    alignSelf: "center",
    alignItems: "center",
    zIndex: 30,
  },
  promptText: {
    color: "white",
    fontSize: font(18),
    fontWeight: "bold",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  btnRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  actionButton: {
    backgroundColor: "black",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  actionButtonText: {
    color: "white",
    fontSize: font(15),
    fontWeight: "bold",
  },
  nameTag: {
    position: "absolute",
    bottom: "100%",
    left: "55%",
    transform: [{ translateX: -30 }],
    backgroundColor: "black",
    paddingHorizontal: font(2),
    paddingVertical: font(3),
    borderRadius: 5,
  },
  nameText: {
    color: "white",
    fontSize: font(13),
    fontWeight: "bold",
  },
});

export default Map1Modal;
