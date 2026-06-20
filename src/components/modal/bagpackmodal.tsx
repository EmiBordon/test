import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { GrapesIcon, HealthPotionIcon, BigHealthPotionIcon, QuiverArrowIcon, BowIcon, DaggersIcon, SwordIcon, BombIcon, CrossIcon, MaiaIcon } from '../SvgExporter';
import { decrementBigHealthPotion, decrementGrapes, decrementHealthPotion } from '../../redux/healingSlice';
import { useDispatch, useSelector } from "react-redux";
import { incrementMaiaCurrentHealth, incrementMaiaMana } from '../../redux/maiaSlice';
import { useObjects, GameObject } from '../objects';
import { font } from '../functions/fontsize';
import HealthBar from '../healthbar';

interface RootState {
  healing: {
    grapes: number;
    healthpotion: number;
    bighealthpotion: number;
  };
  maia: {
    maiahealth: number;
    maiaMana: number;
  };
  weapons: {
    currentWeapon: number;
  };
}

interface ExtendedGameObject extends GameObject {
  type: 'healing' | 'weapon' | 'treasure' | 'key' | 'other';
  healingType?: 'grapes' | 'healthpotion' | 'bighealthpotion';
}

interface BagPackModalProps {
  visible: boolean;
  onClose: () => void;
}

const SLOT_SIZE = font(62);
const SLOT_GAP = font(6);
const PANEL_PADDING = font(12);

// Altura del contenido de la columna de armas: 3 slots apilados + 2 gaps
const EQUIP_CONTENT_H = 3 * SLOT_SIZE + 2 * SLOT_GAP;
// Espacio para el mini healthbar encima del retrato
const MINI_HB_H = font(24);
const MINI_HB_GAP = font(4);
// Altura total del panel de equipo
const EQUIP_PANEL_H = EQUIP_CONTENT_H + MINI_HB_H + MINI_HB_GAP + 2 * PANEL_PADDING;

// Altura del panel de inventario: grid 4×4 + espacio reservado para descripción + botón usar
const GRID_H = 4 * SLOT_SIZE + 3 * SLOT_GAP + font(10);
const INV_PANEL_H = GRID_H + font(60) + font(50) + 2 * PANEL_PADDING;

const BagPackModal: React.FC<BagPackModalProps> = ({ visible, onClose }) => {
  const [selectedItem, setSelectedItem] = useState<ExtendedGameObject | null>(null);
  const [page, setPage] = useState(0);
  const dispatch = useDispatch();

  const healingState = useSelector((state: RootState) => state.healing);
  const maiaHealth = useSelector((state: RootState) => state.maia.maiahealth);
  const maiaCurrentHealth = useSelector((state: any) => state.maia.maiacurrenthealth);
  const maiaMana = useSelector((state: RootState) => state.maia.maiaMana);
  const currentWeapon = useSelector((state: RootState) => state.weapons.currentWeapon);

  const { treasures, keys, inventory } = useObjects();

  const arrowItem = inventory.find(item => item.id === 'arrows');
  const arrowCount = (arrowItem && typeof arrowItem.state === 'number') ? arrowItem.state : 0;
  const WeaponIcon = currentWeapon === 1 ? DaggersIcon : SwordIcon;

  const createInventoryItemList = (): ExtendedGameObject[] => {
    const allItems: ExtendedGameObject[] = [];

    const bombItem = inventory.find(item => item.id === 'bomb');
    if (bombItem && typeof bombItem.state === 'number' && bombItem.state > 0) {
      allItems.push({ ...bombItem, type: 'weapon' } as ExtendedGameObject);
    }

    if (healingState.grapes > 0) {
      allItems.push({
        id: 'grapes',
        name: 'Uvas',
        description: 'Aumentan un poco de Salud',
        icon: GrapesIcon,
        state: healingState.grapes,
        type: 'healing',
        healingType: 'grapes'
      });
    }

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

    treasures.forEach(treasure => {
      if (typeof treasure.state === 'number' && treasure.state > 0) {
        allItems.push({ ...treasure, type: 'treasure' } as ExtendedGameObject);
      }
    });

    keys.forEach(key => {
      if (typeof key.state === 'boolean' && key.state) {
        allItems.push({ ...key, state: 1, type: 'key' } as ExtendedGameObject);
      }
    });

    return allItems;
  };

  const allItems = createInventoryItemList();

  const COLS = 4;
  const ROWS = 4;
  const itemsPerPage = COLS * ROWS;
  const totalPages = Math.ceil(allItems.length / itemsPerPage);
  const paginatedItems = allItems.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const handleItemSelect = (item: ExtendedGameObject) => {
    setSelectedItem(prev => prev?.id === item.id ? null : item);
  };

  const handleUseHealing = () => {
    if (!selectedItem || selectedItem.type !== 'healing') return;
    switch (selectedItem.healingType) {
      case 'grapes':
        if (maiaCurrentHealth >= maiaHealth) return;
        dispatch(decrementGrapes(1));
        dispatch(incrementMaiaCurrentHealth(Math.floor(maiaHealth / 5)));
        break;
      case 'healthpotion':
        if (maiaMana >= 3) return;
        dispatch(decrementHealthPotion(1));
        dispatch(incrementMaiaMana(1));
        break;
      case 'bighealthpotion':
        if (maiaMana >= 3) return;
        dispatch(decrementBigHealthPotion(1));
        dispatch(incrementMaiaMana(3 - maiaMana));
        break;
    }
    setSelectedItem(null);
  };

  const isManaPotion = selectedItem?.healingType === 'healthpotion' || selectedItem?.healingType === 'bighealthpotion';
  const isGrapes = selectedItem?.healingType === 'grapes';
  const canUseSelected =
    selectedItem?.type === 'healing' &&
    typeof selectedItem.state === 'number' &&
    selectedItem.state > 0 &&
    !(isManaPotion && maiaMana >= 3) &&
    !(isGrapes && maiaCurrentHealth >= maiaHealth);

  const handleNextPage = () => {
    if ((page + 1) * itemsPerPage < allItems.length) { setPage(page + 1); setSelectedItem(null); }
  };
  const handlePrevPage = () => {
    if (page > 0) { setPage(page - 1); setSelectedItem(null); }
  };

  const renderSlot = (item: ExtendedGameObject | null, index: number) => {
    if (!item) return <View key={`empty-${index}`} style={styles.slot} />;

    const isSelected = selectedItem?.id === item.id;
    const shouldShowQuantity = !(
      item.id === 'bow' || item.id === 'sword' || item.id === 'daggers' || item.type === 'key'
    );

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.slot, isSelected && styles.slotSelected]}
        onPress={() => handleItemSelect(item)}
      >
        <item.icon width={font(34)} height={font(34)} />
        {shouldShowQuantity && <Text style={styles.slotQuantity}>{item.state}</Text>}
      </TouchableOpacity>
    );
  };

  const slots = Array.from({ length: itemsPerPage }, (_, i) => paginatedItems[i] ?? null);

  const handleClose = () => { setSelectedItem(null); setPage(0); onClose(); };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.mainWrapper}>

          {/* Panel superior: personaje y equipo */}
          <View style={styles.equipmentPanel}>

            
          {/* Columna izquierda: mini healthbar + retrato */}
          <View style={styles.maiaFrame}>
            <View style={styles.maiaColumn}>
              <View style={styles.miniHealthBarWrapper}>
                <View style={styles.miniHealthBarScale}>
                  <HealthBar />
                </View>
              </View>
            
                <MaiaIcon width={font(100)} height={font(100)} />
              </View>
            </View>

            {/* Columna central: arma actual, arco, flechas */}
            <View style={styles.weaponColumn}>
              <View style={styles.slot}>
                <WeaponIcon width={font(34)} height={font(34)} />
              </View>
              <View style={styles.slot}>
                <BowIcon width={font(34)} height={font(34)} />
              </View>
              <View style={styles.slot}>
                <QuiverArrowIcon width={font(34)} height={font(34)} />
                {arrowCount > 0 && <Text style={styles.slotQuantity}>{arrowCount}</Text>}
              </View>
            </View>

            {/* Columna derecha: estadísticas */}
            <View style={styles.statsColumn}>
              <Text style={styles.statLabel}>Daño</Text>
              <Text style={styles.statValue}>1</Text>
              <Text style={styles.statLabel}>Nivel Mágico</Text>
              <Text style={styles.statValue}>1</Text>
              <Text style={styles.statLabel}>Hechizos</Text>
              <Text style={styles.statValue}>1</Text>
              <Text style={styles.statLabel}>Objetos</Text>
              <Text style={styles.statValue}>5</Text>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <CrossIcon width={font(26)} height={font(26)} />
            </TouchableOpacity>
          </View>

          {/* Panel inferior: inventario */}
          <View style={styles.inventoryPanel}>
            <View style={styles.grid}>
              {slots.map((item, i) => renderSlot(item, i))}
            </View>

            {totalPages > 1 && (
              <View style={styles.paginationContainer}>
                <TouchableOpacity style={styles.paginationButton} onPress={handlePrevPage} disabled={page === 0}>
                  <Text style={[styles.paginationButtonText, { color: page === 0 ? '#5a3a1a' : '#C8A84B' }]}>{"<<"}</Text>
                </TouchableOpacity>
                <Text style={styles.pageIndicator}>{page + 1} / {totalPages}</Text>
                <TouchableOpacity style={styles.paginationButton} onPress={handleNextPage} disabled={page === totalPages - 1}>
                  <Text style={[styles.paginationButtonText, { color: page === totalPages - 1 ? '#5a3a1a' : '#C8A84B' }]}>{">>"}</Text>
                </TouchableOpacity>
              </View>
            )}

            {selectedItem && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>
                  {selectedItem.description || 'Sin descripción disponible'}
                </Text>
              </View>
            )}

            {canUseSelected && (
              <TouchableOpacity style={styles.useButton} onPress={handleUseHealing}>
                <Text style={styles.useButtonText}>Usar</Text>
              </TouchableOpacity>
            )}
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default BagPackModal;

const panelStyle = {
  backgroundColor: 'rgba(18, 7, 2, 0.97)',
  borderRadius: 12,
  padding: PANEL_PADDING,
  borderWidth: 3,
  borderColor: '#C8A84B',
  shadowColor: '#C8A84B',
  shadowOpacity: 0.5,
  shadowRadius: 10,
  elevation: 5,
} as const;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainWrapper: {
    width: '90%',
    gap: font(8),
  },
  equipmentPanel: {
    ...panelStyle,
    height: EQUIP_PANEL_H,
    flexDirection: 'row',
    alignItems: 'center',
    gap: font(12),
  },
  maiaColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: MINI_HB_GAP,
  },
  miniHealthBarWrapper: {
    width: font(86),
    height: MINI_HB_H,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniHealthBarScale: {
    transform: [{ scale: 0.55 }],
  },
  maiaFrame: {
    width: font(86),
    height: EQUIP_CONTENT_H,
    backgroundColor: '#6B2D0A',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#C8A84B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D4AF37',
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  weaponColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: SLOT_GAP,
    alignSelf: 'stretch',
  },
  statsColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignSelf: 'stretch',
    paddingRight: font(28),
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(200, 168, 75, 0.3)',
    paddingLeft: font(10),
  },
  statLabel: {
    color: 'rgba(200, 168, 75, 0.6)',
    fontSize: font(9),
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    color: '#C8A84B',
    fontSize: font(13),
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: font(8),
    right: font(8),
    padding: font(4),
  },
  inventoryPanel: {
    ...panelStyle,
    height: INV_PANEL_H,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SLOT_GAP,
    justifyContent: 'center',
    marginBottom: font(10),
  },
  slot: {
    width: SLOT_SIZE,
    height: SLOT_SIZE,
    backgroundColor: '#6B2D0A',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#C8A84B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D4AF37',
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  slotSelected: {
    borderColor: '#FFD700',
    borderWidth: 3,
    backgroundColor: '#8B3A0F',
  },
  slotQuantity: {
    position: 'absolute',
    bottom: font(2),
    right: font(4),
    fontSize: font(11),
    fontWeight: 'bold',
    color: '#C8A84B',
  },
  descriptionContainer: {
    backgroundColor: 'rgba(30, 12, 3, 0.97)',
    padding: font(10),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C8A84B',
    marginBottom: font(8),
  },
  descriptionText: {
    color: '#E8D5A3',
    fontSize: font(13),
    textAlign: 'center',
  },
  useButton: {
    backgroundColor: '#6B2D0A',
    paddingVertical: font(8),
    paddingHorizontal: font(20),
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#C8A84B',
    alignSelf: 'center',
    marginBottom: font(8),
    shadowColor: '#C8A84B',
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  useButtonText: {
    color: '#FFD700',
    fontSize: font(16),
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: font(10),
    marginBottom: font(8),
  },
  paginationButton: {
    padding: font(8),
  },
  paginationButtonText: {
    fontSize: font(20),
    fontWeight: 'bold',
  },
  pageIndicator: {
    color: '#C8A84B',
    fontSize: font(14),
    fontWeight: 'bold',
  },
});
