import { incrementCoins } from '../../redux/coinsSlice';

 

export const boxesActions: Record<string, (dispatch: any) => void> = {
    barbox: (dispatch) => {
      dispatch(incrementCoins(10));
    },
    cavebox1: (dispatch) => {
      dispatch(incrementCoins(50));
    },
  };
  
