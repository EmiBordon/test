import React, { useState, useEffect } from "react";
import { Modal, View, TouchableOpacity, Text, StyleSheet, Dimensions, Alert, Image } from "react-native";
import {
  HouseIcon, PrisionIcon, StoreIcon, RestaurantIcon, BigHouseIcon, CaveIcon,
  CrossIcon, PawnShopIcon, MapArrowIcon, MapDoorIcon, TempleofAgonyIcon
} from "../SvgExporter";
import { font } from "../functions/fontsize";
import IconButton from "../functions/iconbutton";

type MapId = 1 | 2 | 3 | 4;

// Iconos de ubicación — cada uno indica en qué mapa aparece con mapId
const LOCATION_ICONS = [
  { key: "house",      Component: HouseIcon,      size: font(55),  text: "Casa",    top: "85%", left: "9%",  tx: -30, ty: -30, route: "Tutorial", mapId: 1 as MapId },
  { key: "prison",     Component: PrisionIcon,    size: font(60),  text: "Prisión", top: "58%", left: "85%", tx: -30, ty: -30, route: "Prision",  mapId: 1 as MapId },
  { key: "store",      Component: StoreIcon,      size: font(50),  text: "Tienda",  top: "67%", left: "45%", tx: -30, ty: -30, route: "Shop",     mapId: 1 as MapId },
  { key: "restaurant", Component: RestaurantIcon, size: font(55),  text: "Bar",     top: "40%", left: "33%", tx: -30, ty: -30, route: "Bar",      mapId: 1 as MapId },
  { key: "cave",       Component: CaveIcon,       size: font(60),  text: "Cueva",   top: "30%", left: "12%", tx: -30, ty: -30, route: "Cave",     mapId: 1 as MapId },
  { key: "pawnShop",   Component: PawnShopIcon,   size: font(55),  text: "Joyeria", top: "14%", left: "65%", tx: -30, ty: -30, route: "PawnShop", mapId: 1 as MapId },
  { key: "bigHouse",   Component: BigHouseIcon,   size: font(105), text: "Mansión", top: "47%", left: "82%", tx: -50, ty: -50, route: null,       mapId: 4 as MapId },
  { key: "templeofAgony",   Component: TempleofAgonyIcon,   size: font(70), text: "Templo de la Agonia", top: "95%", left: "13%", tx: -50, ty: -50, route: "TempleOfAgony", mapId: 3 as MapId },
];

// Iconos de navegación entre mapas por página
const MAP_NAV: Record<MapId, { key: string; Component: React.ComponentType<any>; size: number; top: string; left: string; tx: number; ty: number; rotate?: string; scaleX?: number; scaleY?: number; targetMap: MapId }[]> = {
  1: [
    { key: "to_2", Component: MapArrowIcon, size: font(65), top: "92%", left: "82%", tx: -20, ty: -20,scaleY: -1, rotate: "340deg", targetMap: 2 },
  ],
  2: [
    { key: "to_1", Component: MapArrowIcon, size: font(60), top: "84%", left: "8%",  tx: -20, ty: -20, rotate: "180deg", targetMap: 1 },
    { key: "to_3", Component: MapArrowIcon, size: font(60), top: "45%", left: "86%", tx: -20, ty: -20, targetMap: 3 },
    { key: "to_4", Component: MapDoorIcon,  size: font(50), top: "56%", left: "44%", tx: -25, ty: -25, targetMap: 4 },
  ],
  3: [
    { key: "to_2", Component: MapArrowIcon, size: font(60), top: "42%", left: "10%",  tx: -20, ty: -20, rotate: "180deg", targetMap: 2 },
  ],
  4: [
    { key: "to_2", Component: MapDoorIcon,  size: font(50), top: "88%", left: "48%", tx: -25, ty: -25, targetMap: 2 },
  ],
};

const MAP_IMAGES: Record<MapId, any> = {
  1: require('../../images/map1.jpg'),
  2: require('../../images/map2.jpg'),
  3: require('../../images/map3.jpg'),
  4: require('../../images/map4.jpg'),
};

const Map1Modal = ({ visible, onClose, navigation }) => {
  const { height } = Dimensions.get("window");
  const modalHeight = height * 0.7;

  const [currentMap, setCurrentMap] = useState<MapId>(1);
  const [selected, setSelected] = useState<string | null>(null);
  const selectedItem = LOCATION_ICONS.find(i => i.key === selected);

  useEffect(() => {
    if (visible) {
      setCurrentMap(1);
      setSelected(null);
    }
  }, [visible]);

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

  const switchMap = (target: MapId) => {
    setCurrentMap(target);
    setSelected(null);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { height: modalHeight }]}>

          <Image
            source={MAP_IMAGES[currentMap]}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />

          {/* Prompt de viaje — visible en cualquier mapa cuando hay selección */}
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

          {/* Iconos de ubicación — filtrados por mapa actual */}
          {LOCATION_ICONS.filter(i => i.mapId === currentMap).map(({ key, Component, size, text, top, left, tx, ty }) => (
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

          {/* Iconos de navegación entre mapas */}
          {MAP_NAV[currentMap].map(({ key, Component, size, top, left, tx, ty, rotate, scaleX, scaleY, targetMap }) => (
            <IconButton
              key={key}
              Icon={Component}
              width={size}
              height={size}
              style={{
                top, left, zIndex: 20,
                transform: [
                  { translateX: tx },
                  { translateY: ty },
                  ...(rotate  ? [{ rotate }]         : []),
                  ...(scaleX !== undefined ? [{ scaleX }] : []),
                  ...(scaleY !== undefined ? [{ scaleY }] : []),
                ],
              }}
              onPress={() => switchMap(targetMap)}
            />
          ))}

          {/* Botón cerrar */}
          <IconButton
            Icon={CrossIcon}
            width={30}
            height={30}
            style={{ top: 10, right: 10, zIndex: 30 }}
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
    backgroundColor: "black",
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
