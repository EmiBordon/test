import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {CodeChestIcon, Safe2Icon } from '../SvgExporter';
import { Pressable, StyleSheet } from 'react-native';
import ConversationChoiceModal from '../modal/conversationchoicemodal';
import CodeModal from '../modal/codemodal';
import { conversations } from './conversations';
import { setBoxFalse } from '../../redux/boxesSlice';
import { boxesActions } from './boxesActions';
import { font } from './fontsize';

interface CodeBoxProps {
  boxKey: 'barbox' | 'cavebox1' | 'cavebox2' | 'cavebox3' | 'cavebox4' | 'prisionbox' | 'mansionbox1' | 'mansionbox2';
  positionStyle: any;
  code: string;
}

const CodeBox: React.FC<CodeBoxProps> = ({ boxKey, positionStyle, code }) => {
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

    if (boxesActions[boxKey]) {
      boxesActions[boxKey](dispatch);
    }
  };

  if (!boxState) return null;

  return (
    <>
      <Pressable style={[styles.iconButton, positionStyle]} onPress={handlePress}>
        <Safe2Icon height={font(70)} width={font(70)} />
      </Pressable>

      <CodeModal 
        visible={modalVisible} 
        code={code} 
        onClose={(success) => {
          if (success) {
            handleAccept();
          } else {
            setModalVisible(false);
          }
        }} 
      />
    </>
  );
};

export default CodeBox;

const styles = StyleSheet.create({
  iconButton: {
    position: 'absolute',
  },
});
