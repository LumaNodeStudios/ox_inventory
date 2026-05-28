import React, { useState } from 'react';
import { getItemUrl, isSlotWithItem } from '../../helpers';
import useNuiEvent from '../../hooks/useNuiEvent';
import WeightBar from '../utils/WeightBar';
import { useAppSelector } from '../../store';
import { selectLeftInventory } from '../../store/inventory';
import { SlotWithItem } from '../../typings';
import SlideUp from '../utils/transitions/SlideUp';
import InventorySlot from './InventorySlot';

const InventoryHotbar: React.FC = () => {
  const [hotbarVisible, setHotbarVisible] = useState(false);
  const nineHotbar = useAppSelector((state) => state.inventory.nineHotbar);
  const inventoryVisible = useAppSelector((state) => state.inventory.inventoryVisible);
  const leftInventory = useAppSelector(selectLeftInventory);
  const items = leftInventory.items.slice(0, nineHotbar ? 9 : 5);

  //stupid fix for timeout
  const [handle, setHandle] = useState<ReturnType<typeof setTimeout>>();
  useNuiEvent('toggleHotbar', () => {
    if (hotbarVisible) {
      setHotbarVisible(false);
    } else {
      if (handle) clearTimeout(handle);
      setHotbarVisible(true);
      setHandle(setTimeout(() => setHotbarVisible(false), 3000));
    }
  });

  const isVisible = (nineHotbar && inventoryVisible) || hotbarVisible;

  return (
    <SlideUp in={isVisible}>
      <div className="hotbar-container">
        {items.map((item) => {
          if (nineHotbar) {
            return (
              <InventorySlot
                key={`hotbar-${item.slot}`}
                item={item}
                inventoryId={leftInventory.id}
                inventoryType="player"
                inventoryGroups={leftInventory.groups}
              />
            );
          }

          return (
            <div
              className="hotbar-item-slot"
              style={{
                backgroundImage: `url(${item?.name ? getItemUrl(item as SlotWithItem) : 'none'})`,
              }}
              key={`hotbar-${item.slot}`}
            >
              {isSlotWithItem(item) && (
                <div className="item-slot-wrapper">
                  <div className="hotbar-slot-header-wrapper">
                    <div className="inventory-slot-number">{item.slot}</div>
                    <div className="item-slot-info-wrapper">
                      <p>{item.count ? item.count.toLocaleString('en-us') + `x` : ''}</p>
                    </div>
                  </div>
                  <div>
                    {item?.durability !== undefined && <WeightBar percent={item.durability} durability />}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SlideUp>
  );
};

export default InventoryHotbar;
