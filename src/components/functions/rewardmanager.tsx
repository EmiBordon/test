import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import NewItemModal from '../modal/newitemmodal';
import { CoinsIcon, RubiIcon, DiamondIcon,QuiverArrowIcon, HealthPotionIcon, PocketWatchIcon } from '../SvgExporter';
import { markRewardAsProcessed } from '../../redux/rewardSlice';
import { BoxesState } from '../../redux/boxesSlice'; 
import { RewardsState } from '../../redux/rewardSlice';

interface RootState {
  boxes: BoxesState;
  rewards: RewardsState;
}

const rewardsConfig: Record<string, any> = {
  barbox: {
    items: [
      { icon: <CoinsIcon height="50" width="50" />, name: '20 Monedas', description: '' },
    ]
  },
  cavebox1: {
    items: [
      { icon: <CoinsIcon height="50" width="50" />, name: '15 Monedas', description: '' },
      { icon: <RubiIcon height="50" width="50" />, name: 'Rubi', description: 'Alguien podria querer comprarlo.' },
    ]
  },
  cavebox2: {
    items: [
      { icon: <QuiverArrowIcon height="50" width="50" />, name: '3 Flechas', description: 'Ideales para contrataques.' },
      { icon: <DiamondIcon height="50" width="50" />, name: 'Diamante', description: 'Alguien podria querer comprarlo.' },
    ]
  },
  cavebox3: {
    items: [
      { icon: <HealthPotionIcon height="50" width="50" />, name: 'Frasco de salud', description: 'Aumenta el 50% de la salud.' },
      { icon: <RubiIcon height="50" width="50" />, name: 'Rubi', description: 'Alguien podria querer comprarlo.' },
    ]
  },
  cavebox4: {
    items: [
      { icon: <CoinsIcon height="50" width="50" />, name: '25 Monedas', description: '' },
      { icon: <DiamondIcon height="50" width="50" />, name: '2 Diamantes', description: 'Alguien podria querer comprarlos.' },
      { icon: <QuiverArrowIcon height="50" width="50" />, name: '5 Flechas', description: 'Ideales para contrataques.' },
      { icon: <PocketWatchIcon height="50" width="50" />, name: 'Reloj de bolsillo', description: 'Podria tener un gran valor de venta.' },
    ]
  },
};

const RewardManager = () => {
  const dispatch = useDispatch();
  const boxes = useSelector((state: RootState) => state.boxes);
  const processed = useSelector((state: RootState) => state.rewards.processed);

  const [modalVisible, setModalVisible] = useState(false);
  const [rewardQueue, setRewardQueue] = useState<string[]>([]);
  const [currentReward, setCurrentReward] = useState<string | null>(null);

  useEffect(() => {
    Object.keys(boxes).forEach((key) => {
      const boxKey = key as keyof typeof boxes;

      if (!boxes[boxKey] && !processed[boxKey] && !rewardQueue.includes(boxKey)) {
        setRewardQueue(prev => [...prev, boxKey]);
        dispatch(markRewardAsProcessed(boxKey));
      }
    });
  }, [boxes, processed]);

  useEffect(() => {
    if (rewardQueue.length > 0 && !modalVisible) {
      const nextReward = rewardQueue[0];
      setCurrentReward(nextReward);

      const timeout = setTimeout(() => {
        setModalVisible(true);
      }, 300); // ⏰ aquí el modal se mostrará después de 1 segundo

      return () => clearTimeout(timeout);
    }
  }, [rewardQueue, modalVisible]);

  const handleClose = () => {
    setModalVisible(false);
    setRewardQueue(prev => prev.slice(1));
    setCurrentReward(null);
  };

  if (!currentReward) return null;

  const { items } = rewardsConfig[currentReward];

  return (
    <NewItemModal
      visible={modalVisible}
      onClose={handleClose}
      item1={items[0]}
      item2={items[1]}
      item3={items[2]}
      item4={items[3]}
    />
  );
};

export default RewardManager;
