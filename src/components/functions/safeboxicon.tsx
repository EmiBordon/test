import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Safe1Icon } from '../SvgExporter';
import IconButton from './iconbutton';
import SafeModal from '../modal/safemodal';
import { setBoxFalse } from '../../redux/boxesSlice';
import { boxesActions } from './boxesActions';
import { font } from './fontsize';

interface SafeBoxProps {
  boxKey: 'barbox' | 'cavebox1' | 'cavebox2' | 'cavebox3' | 'cavebox4' | 'prisionbox' | 'mansionbox1' | 'mansionbox2';
  positionStyle: any;
  code: string;
}

const SafeBox: React.FC<SafeBoxProps> = ({ boxKey, positionStyle, code }) => {
  const dispatch = useDispatch();
  const boxState = useSelector((state: any) => state.boxes[boxKey]);
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    if (boxState) setModalVisible(true);
  };

  const handleAccept = () => {
    setModalVisible(false);
    dispatch(setBoxFalse(boxKey));
    if (boxesActions[boxKey]) boxesActions[boxKey](dispatch);
  };

  if (!boxState) return null;

  return (
    <>
      <IconButton Icon={Safe1Icon} width={font(70)} height={font(70)} style={positionStyle} onPress={handlePress} />

      <SafeModal
        visible={modalVisible}
        correctCode={code}
        onClose={() => setModalVisible(false)}
        onSuccess={() => handleAccept()}
      />
    </>
  );
};

export default SafeBox;
