import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EmptyBoxModal from '../modal/emptyboxmodal';
import { BoxesState } from '../../redux/boxesSlice'; 
import { RewardsState, markEmptyBoxAsShown } from '../../redux/rewardSlice';

interface RootState {
  boxes: BoxesState;
  rewards: RewardsState;
}

const EmptyBoxManager = () => {
  const dispatch = useDispatch();
  const emptyBoxes = useSelector((state: RootState) => state.rewards.emptyBoxes);
  const emptyBoxesShown = useSelector((state: RootState) => state.rewards.emptyBoxesShown);

  const [modalVisible, setModalVisible] = useState(false);
  const [emptyBoxQueue, setEmptyBoxQueue] = useState<string[]>([]);
  const [currentEmptyBox, setCurrentEmptyBox] = useState<string | null>(null);

  useEffect(() => {
    Object.keys(emptyBoxes).forEach((key) => {
      const boxKey = key as keyof typeof emptyBoxes;

      // Solo mostrar modal si está marcada como vacía, NO ha sido mostrada antes, y no está ya en la cola
      if (emptyBoxes[boxKey] && !emptyBoxesShown[boxKey] && !emptyBoxQueue.includes(boxKey)) {
        setEmptyBoxQueue(prev => [...prev, boxKey]);
        dispatch(markEmptyBoxAsShown(boxKey));
      }
    });
  }, [emptyBoxes, emptyBoxesShown, dispatch]);

  useEffect(() => {
    if (emptyBoxQueue.length > 0 && !modalVisible) {
      const nextEmptyBox = emptyBoxQueue[0];
      setCurrentEmptyBox(nextEmptyBox);

      const timeout = setTimeout(() => {
        setModalVisible(true);
      }, 300); // Mismo delay que RewardManager

      return () => clearTimeout(timeout);
    }
  }, [emptyBoxQueue, modalVisible]);

  const handleClose = () => {
    setModalVisible(false);
    setEmptyBoxQueue(prev => prev.slice(1));
    setCurrentEmptyBox(null);
  };

  if (!currentEmptyBox) return null;

  return (
    <EmptyBoxModal
      visible={modalVisible}
      onClose={handleClose}
    />
  );
};

export default EmptyBoxManager;
