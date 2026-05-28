import { Inventory } from './inventory';
import { Slot } from './slot';

export type State = {
  leftInventory: Inventory;
  rightInventory: Inventory;
  itemAmount: number;
  shiftPressed: boolean;
  isBusy: boolean;
  additionalMetadata: Array<{ metadata: string; value: string }>;
  nineHotbar?: boolean;
  inventoryVisible?: boolean;
  history?: {
    leftInventory: Inventory;
    rightInventory: Inventory;
  };
};
