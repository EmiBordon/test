import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BoxIcon, BrokenBoxIcon } from '../SvgExporter';
import IconButton from './iconbutton';
import { setBoxFalse } from '../../redux/boxesSlice';
import { markBoxAsOpening } from '../../redux/rewardSlice';
import { boxesActions } from './boxesActions';
import { font } from './fontsize';

interface BoxProps {
  boxKey: 'barbox' | 'cavebox1' | 'cavebox2' | 'cavebox3' | 'cavebox4' | 'prisionbox' | 'mansionbox1' | 'mansionbox2';
  positionStyle: any;
}

const Box: React.FC<BoxProps> = ({ boxKey, positionStyle }) => {
  const dispatch = useDispatch();
  const boxState = useSelector((state: any) => state.boxes[boxKey]);
  const opening = useSelector((state: any) => state.rewards.openingBoxes[boxKey]);

  const handlePress = () => {
    if (!boxState) return;
    dispatch(markBoxAsOpening(boxKey));
    dispatch(setBoxFalse(boxKey));
    if (boxesActions[boxKey]) boxesActions[boxKey](dispatch);
  };

  if (!boxState && !opening) return null;

  return (
    <IconButton
      Icon={opening ? BrokenBoxIcon : BoxIcon}
      width={font(70)}
      height={font(70)}
      style={positionStyle}
      onPress={handlePress}
    />
  );
};

export default Box;
