import React, { useState } from 'react';
import useNuiEvent from '../../hooks/useNuiEvent';
import InventoryHotbar from './InventoryHotbar';
import { useAppDispatch } from '../../store';
import { refreshSlots, setAdditionalMetadata, setupInventory, setInventoryVisible } from '../../store/inventory';
import { useExitListener } from '../../hooks/useExitListener';
import type { Inventory as InventoryProps } from '../../typings';
import RightInventory from './RightInventory';
import LeftInventory from './LeftInventory';
import Tooltip from '../utils/Tooltip';
import { closeTooltip } from '../../store/tooltip';
import InventoryContext from './InventoryContext';
import { closeContextMenu } from '../../store/contextMenu';
import Fade from '../utils/transitions/Fade';
import { LeftHeaderCards, RightHeaderCards } from './HeaderCards';
import { setPlayerData } from '../../store/player';
import SplitDialog from './SplitDialog';

const Inventory: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const dispatch = useAppDispatch();

  useNuiEvent<boolean>('setInventoryVisible', (val) => {
    setVisible(val);
    dispatch(setInventoryVisible(val));
  });
  useNuiEvent<false>('closeInventory', () => {
    setVisible(false);
    dispatch(setInventoryVisible(false));
    dispatch(closeContextMenu());
    dispatch(closeTooltip());
  });
  useExitListener((val) => {
    setVisible(val);
    dispatch(setInventoryVisible(val));
  });

  useNuiEvent<{
    leftInventory?: InventoryProps;
    rightInventory?: InventoryProps;
  }>('setupInventory', (data) => {
    dispatch(setupInventory(data));
    if (!visible) {
      setVisible(true);
      dispatch(setInventoryVisible(true));
    }
  });

  useNuiEvent('refreshSlots', (data) => dispatch(refreshSlots(data)));

  useNuiEvent('displayMetadata', (data: Array<{ metadata: string; value: string }>) => {
    dispatch(setAdditionalMetadata(data));
  });

  useNuiEvent('setPlayerData', (data) => {
    dispatch(setPlayerData(data));
  });

  return (
    <>
      <Fade in={visible}>
        <div className="inventory-wrapper">
          <div className="inventory-column">
            <LeftHeaderCards />
            <LeftInventory />
          </div>
          <div className="inventory-column">
            <RightHeaderCards />
            <RightInventory />
          </div>
        </div>
        <Tooltip />
        <InventoryContext />
        <SplitDialog />
      </Fade>
      <InventoryHotbar />
    </>
  );
};

export default Inventory;
