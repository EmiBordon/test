import React, { useState, useEffect } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { font } from '../functions/fontsize';
import { DoubleArrowIcon } from '../SvgExporter';

interface ItemProps {
  icon: React.ReactNode;
  name: string;
  description: string;
}

interface NewItemModalProps {
  visible: boolean;
  onClose: () => void;
  item1: ItemProps;
  item2?: ItemProps;
  item3?: ItemProps;
  item4?: ItemProps;
}

const NewItemModal: React.FC<NewItemModalProps> = ({ visible, onClose, item1, item2, item3, item4 }) => {
  const items = [item1, item2, item3, item4].filter(Boolean) as ItemProps[];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (visible) setCurrentIndex(0);
  }, [visible]);

  const isLastItem = currentIndex === items.length - 1;

  const handleNext = () => {
    if (!isLastItem) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const currentItem = items[currentIndex];

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>

          <Text style={styles.headerText}>
            {items.length === 1 ? '¡Haz obtenido un nuevo ítem!' : '¡Haz obtenido nuevos ítems!'}
          </Text>

          <View style={styles.divider} />

          <View style={styles.contentContainer}>
            <View style={styles.iconWrapper}>
              {currentItem.icon}
            </View>
            <Text style={styles.itemName}>{currentItem.name}</Text>
            <Text style={styles.itemDescription}>{currentItem.description}</Text>
          </View>

          {items.length > 1 && (
            <Text style={styles.paginationText}>{currentIndex + 1} / {items.length}</Text>
          )}

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            {isLastItem ? (
              <DoubleArrowIcon width={font(26)} height={font(26)} style={{ transform: [{ rotate: '90deg' }] }} />
            ) : (
              <DoubleArrowIcon width={font(26)} height={font(26)} />
            )}
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default NewItemModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.56)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'rgb(99, 53, 32)',
    borderRadius: font(12),
    borderWidth: 3,
    borderColor: '#C8A84B',
    padding: font(24),
    width: '80%',
    alignItems: 'center',
    shadowColor: '#C8A84B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 12,
  },
  headerText: {
    color: '#C8A84B',
    fontSize: font(18),
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    marginBottom: font(10),
  },
  divider: {
    width: '100%',
    height: 1.5,
    backgroundColor: '#C8A84B',
    opacity: 0.5,
    marginBottom: font(16),
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: font(16),
  },
  iconWrapper: {
    backgroundColor: 'rgb(83, 49, 17)',
    borderRadius: font(10),
    borderWidth: 1.5,
    borderColor: '#c5a74c',
    padding: font(12),
    marginBottom: font(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  itemName: {
    color: '#E8D5A3',
    fontSize: font(18),
    fontWeight: '700',
    marginBottom: font(6),
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  itemDescription: {
    color: '#c7b288',
    fontSize: font(14),
    textAlign: 'center',
    lineHeight: font(20),
  },
  paginationText: {
    color: '#C8A84B',
    fontSize: font(13),
    marginBottom: font(8),
    opacity: 0.8,
  },
  nextButton: {
    marginTop: font(4),
    padding: font(8),
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
});
