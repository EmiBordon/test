import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'rewardsProcessedState';

export const loadRewardsState = createAsyncThunk(
  'rewards/loadState',
  async () => {
    const savedState = await AsyncStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : null;
  }
);

export interface RewardsState {
  processed: {
    barbox: boolean;
    cavebox1: boolean;
    cavebox2: boolean;
    prisionbox: boolean;
    mansionbox1: boolean;
    mansionbox2: boolean;
  };
}

const initialState: RewardsState = {
  processed: {
    barbox: false,
    cavebox1: false,
    cavebox2: false,
    prisionbox: false,
    mansionbox1: false,
    mansionbox2: false,
  },
};

const rewardSlice = createSlice({
  name: 'rewards',
  initialState,
  reducers: {
    markRewardAsProcessed: (state, action: PayloadAction<keyof RewardsState['processed']>) => {
      state.processed[action.payload] = true;
      saveState(state);
    },
    resetProcessedRewards: (state) => {
      state.processed = { ...initialState.processed };
      saveState(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadRewardsState.fulfilled, (state, action) => {
      if (action.payload) {
        Object.assign(state.processed, action.payload.processed);
      }
    });
  },
});

const saveState = async (state: RewardsState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error al guardar el estado de rewards:', error);
  }
};

export const { markRewardAsProcessed, resetProcessedRewards } = rewardSlice.actions;
export default rewardSlice.reducer;
