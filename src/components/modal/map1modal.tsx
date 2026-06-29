import React, { useState, useEffect } from "react";
import { Modal, View, TouchableOpacity, Text, StyleSheet, Dimensions, Alert, Image } from "react-native";
import {
  HouseIcon, PrisionIcon, StoreIcon, RestaurantIcon, BigHouseIcon, CaveIcon,
  CrossIcon, PawnShopIcon, MapArrowIcon, MapDoorIcon, TempleofAgonyIcon,PointIcon
} from "../SvgExporter";
import { font } from "../functions/fontsize";
import IconButton from "../functions/iconbutton";

type MapId = 2 | 3 | 4;

// Iconos de ubicación — cada uno indica en qué mapa aparece con mapId
const LOCATION_ICONS = [
  { key: "house",      Component: PointIcon,  size: font(25),  text: "Casa",    top: "80%", left: "68%",  tx: -30, ty: -30, route: "Tutorial", mapId: 2 as MapId },
  { key: "store",      Component: PointIcon,   size: font(20),  text: "Tienda",  top: "67%", left: "55%", tx: -30, ty: -30, route: "Shop",     mapId: 2 as MapId },
  { key: "restaurant", Component: PointIcon,  size: font(20),  text: "Bar",     top: "93%", left: "45%", tx: -30, ty: -30, route: "Bar",      mapId: 3 as MapId },
  { key: "cave",       Component: PointIcon, size: font(20),  text: "Cueva",   top: "48%", left: "32%", tx: -30, ty: -30, route: "Cave",     mapId: 3 as MapId },
  { key: "pawnShop",   Component: PointIcon,   size: font(20),  text: "Joyeria", top: "14%", left: "65%", tx: -30, ty: -30, route: "PawnShop", mapId: 2 as MapId },
  { key: "templeofAgony", Component: PointIcon, size: font(25),  text: "Templo de la Agonia", top: "21%", left: "28%", tx: -50, ty: -50, route: "TempleOfAgony", mapId: 3 as MapId },
];

// Iconos de navegación entre mapas por página
const MAP_NAV: Record<MapId, { key: string; Component: React.ComponentType<any>; size: number; top: string; left: string; tx: number; ty: number; rotate?: string; scaleX?: number; scaleY?: number; targetMap: MapId }[]> = {
  2: [
    { key: "to_3", Component: MapArrowIcon, size: font(65), top: "80%", left: "86%", tx: -20, ty: -20, targetMap: 3, scaleY: -1, rotate: "340deg" },
    { key: "to_4", Component: MapArrowIcon, size: font(65), top: "6%",  left: "34%", tx: -25, ty: -25, targetMap: 4, rotate: "270deg" },
  ],
  3: [
    { key: "to_2", Component: MapArrowIcon, size: font(65), top: "55%", left: "10%", tx: -20, ty: -20, rotate: "180deg", targetMap: 2 },
  ],
  4: [
    { key: "to_2", Component: MapArrowIcon, size: font(65), top: "90%", left: "48%", tx: -25, ty: -25, targetMap: 2, rotate: "90deg" },
  ],
};

const MAP_IMAGES: Record<MapId, any> = {
  2: require('../../images/map2.jpg'),
  3: require('../../images/map3.jpg'),
  4: require('../../images/map4.jpg'),
};

const Map1Modal = ({ visible, onClose, navigation }) => {
  const { height } = Dimensions.get("window");
  const modalHeight = height * 0.6;

  const [currentMap, setCurrentMap] = useState<MapId>(2);
  const [selected, setSelected] = useState<string | null>(null);
  const selectedItem = LOCATION_ICONS.find(i => i.key === selected);

  useEffect(() => {
    if (visible) {
      setCurrentMap(2);
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

        {/* Nombre por encima del recuadro */}
        <View style={styles.nameAbove}>
          {selectedItem ? (
            <Text style={styles.nameAboveText}>{selectedItem.text}</Text>
          ) : (
            <Text style={styles.nameAbovePlaceholder}> </Text>
          )}
        </View>

        <View style={[styles.modalContainer, { height: modalHeight }]}>

          <Image
            source={MAP_IMAGES[currentMap]}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />

          {/* Iconos de ubicación — filtrados por mapa actual */}
          {LOCATION_ICONS.filter(i => i.mapId === currentMap).map(({ key, Component, size, fill, top, left, tx, ty }) => (
            <IconButton
              key={key}
              Icon={Component}
              width={size}
              height={size}
              style={{ top, left, transform: [{ translateX: tx }, { translateY: ty }], zIndex: 20 }}
              iconProps={{ fill }}
              onPress={() => setSelected(key)}
            />
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

        {/* Botón VIAJAR por debajo del recuadro */}
        <View style={styles.travelRow}>
          {selectedItem ? (
            <TouchableOpacity style={styles.travelButton} onPress={handleGo}>
              <Text style={styles.travelButtonText}>VIAJAR</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.travelButtonPlaceholder} />
          )}
        </View>

      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.67)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "95%",
    backgroundColor: "black",
    borderRadius: font(15),
    overflow: "hidden",
    alignItems: "center",
    borderWidth: font(4),
    borderColor: "black",
    justifyContent: "center",
  },
  nameAbove: {
    width: "95%",
    alignItems: "center",
    marginBottom: font(6),
    height: font(18) + font(14),
    justifyContent: "center",
  },
  nameAboveText: {
    color: "#C8A84B",
    fontSize: font(18),
    fontWeight: "bold",
    backgroundColor: "rgba(18, 7, 2, 0.97)",
    paddingHorizontal: font(14),
    paddingVertical: font(5),
    borderRadius: font(6),
    borderWidth: font(1),
    borderColor: "#C8A84B",
    letterSpacing: font(1),
  },
  travelRow: {
    width: "95%",
    alignItems: "center",
    marginTop: font(6),
    height: font(55) ,
    justifyContent: "center",
  },
  travelButton: {
    backgroundColor: "#6B2D0A",
    paddingHorizontal: font(40),
    paddingVertical: font(10),
    borderRadius: font(8),
    borderWidth: font(2),
    borderColor: "#C8A84B",
  },
  travelButtonText: {
    color: "#C8A84B",
    fontSize: font(20),
    fontWeight: "bold",
    letterSpacing: font(3),
  },
});

export default Map1Modal;
