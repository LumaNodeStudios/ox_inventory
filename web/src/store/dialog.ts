import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SlotWithItem } from '../typings';

interface DialogState {
  isOpen: boolean;
  item?: SlotWithItem;
}

const initialState: DialogState = {
  isOpen: false,
};

export const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    openSplitDialog: (state, action: PayloadAction<SlotWithItem>) => {
      state.isOpen = true;
      state.item = action.payload;
    },
    closeSplitDialog: (state) => {
      state.isOpen = false;
      state.item = undefined;
    },
  },
});

export const { openSplitDialog, closeSplitDialog } = dialogSlice.actions;
export default dialogSlice.reducer;
