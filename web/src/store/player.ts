import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '.';

export interface PlayerState {
  name: string;
  bank: string;
  day: string;
  month: string;
  time: string;
  job: string;
  jobName?: string;
  gang: string;
  gangName?: string;
}

const initialState: PlayerState = {
  name: 'Jordan Kahaku',
  bank: '$4,214,775',
  day: 'Tuesday',
  month: 'June',
  time: '13:34',
  job: 'Unemployed',
  jobName: 'unemployed',
  gang: 'Unemployed',
  gangName: 'unemployed',
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayerData: (state, action: PayloadAction<Partial<PlayerState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setPlayerData } = playerSlice.actions;

export const selectPlayer = (state: RootState) => state.player;

export default playerSlice.reducer;
