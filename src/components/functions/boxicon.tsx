import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BoxIcon } from '../SvgExporter';
import { Pressable, StyleSheet } from 'react-native';
import ConversationChoiceModal from '../modal/conversationchoicemodal';
import DiceModal from '../modal/dicemodal';
import { conversations } from './conversations';
import { setBoxFalse, setBoxEmpty } from '../../redux/boxesSlice';
import { markBoxAsEmpty } from '../../redux/rewardSlice';
import { boxesActions } from './boxesActions';
import { font } from './fontsize';

interface BoxProps {
  boxKey: 'barbox' | 'cavebox1' | 'cavebox2' | 'cavebox3' | 'cavebox4' | 'prisionbox' | 'mansionbox1' | 'mansionbox2';
  positionStyle: any;
}

const Box: React.FC<BoxProps> = ({ boxKey, positionStyle }) => {
  const dispatch = useDispatch();
  const boxState = useSelector((state: any) => state.boxes[boxKey]);
  const [modalVisible, setModalVisible] = useState(false);
  const [diceModalVisible, setDiceModalVisible] = useState(false);

  const handlePress = () => {
    if (boxState) {
      setModalVisible(true);
    }
  };

  const handleAccept = () => {
    setModalVisible(false);
    setDiceModalVisible(true);
  };

  const handleDiceModalClose = (playerWon: boolean = false) => {
    setDiceModalVisible(false);
    
    if (playerWon) {
      // ✅ Victoria: Caja con recompensas
      dispatch(setBoxFalse(boxKey)); // Esto activará el RewardManager
      
      // 🔥 Acción centralizada en boxesActions.tsx
      if (boxesActions[boxKey]) {
        boxesActions[boxKey](dispatch);
      }
    } else {
      // ❌ Derrota: Caja vacía
      dispatch(setBoxEmpty(boxKey)); // Marca como vacía sin recompensas
      dispatch(markBoxAsEmpty(boxKey)); // Esto activará el EmptyBoxManager
    }
  };

  if (!boxState) return null;

  return (
    <>
      <Pressable style={[styles.iconButton, positionStyle]} onPress={handlePress}>
        <BoxIcon height={font(70)} width={font(70)} />
      </Pressable>

      <ConversationChoiceModal
        visible={modalVisible}
        conversation={conversations.openbox}
        onClose={() => setModalVisible(false)}
        onAccept={handleAccept}
      />

      <DiceModal
        visible={diceModalVisible}
        onClose={handleDiceModalClose}
      />
    </>
  );
};

export default Box;

const styles = StyleSheet.create({
  iconButton: {
    position: 'absolute',
  },
});
