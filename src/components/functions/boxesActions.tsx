import { incrementCoins } from '../../redux/coinsSlice';
import { incrementObject } from '../../redux/objectsSlice';
import { incrementArrows } from '../../redux/weaponsSlice';
import { incrementHealthPotion } from '../../redux/healingSlice';

export const boxesActions: Record<string, (dispatch: any) => void> = {
    barbox: (dispatch) => {
      dispatch(incrementCoins(20));
    },
    cavebox1: (dispatch) => {
      dispatch(incrementCoins(15));
      dispatch(incrementObject({ key: 'rubi', amount: 1 }));
    },
    cavebox2: (dispatch) => {
      dispatch(incrementObject({ key: 'diamond', amount: 1 }));
      dispatch(incrementArrows(3));
    },
    cavebox3: (dispatch) => {
      dispatch(incrementObject({ key: 'rubi', amount: 1 }));
      dispatch(incrementHealthPotion(1));
    },
    cavebox4: (dispatch) => {
      dispatch(incrementCoins(25));
      dispatch(incrementObject({ key: 'diamond', amount: 2 }));
      dispatch(incrementObject({ key: 'pocketwatch', amount: 1 }));
      dispatch(incrementArrows(5));
    },
  };
  
