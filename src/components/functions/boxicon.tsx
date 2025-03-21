import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BoxIcon } from '../SvgExporter';
import { Pressable, StyleSheet } from 'react-native';
import ConversationChoiceModal from '../modal/conversationchoicemodal';
import { conversations } from './conversations';
import { setBoxFalse } from '../../redux/boxesSlice';
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

  const handlePress = () => {
    if (boxState) {
      setModalVisible(true);
    }
  };

  const handleAccept = () => {
    setModalVisible(false);
    dispatch(setBoxFalse(boxKey));

    // 🔥 Acción centralizada en boxesActions.tsx
    if (boxesActions[boxKey]) {
      boxesActions[boxKey](dispatch);
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
        conversation={conversations.openbox} // Se podría hacer dinámico por caja
        onClose={() => setModalVisible(false)}
        onAccept={handleAccept}
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
