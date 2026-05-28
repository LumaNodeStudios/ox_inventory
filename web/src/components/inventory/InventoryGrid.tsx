import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory } from '../../typings';
import InventorySlot from './InventorySlot';
import { getTotalWeight } from '../../helpers';
import { useAppDispatch, useAppSelector } from '../../store';
import { useIntersection } from '../../hooks/useIntersection';
import { selectItemAmount, setItemAmount } from '../../store/inventory';
import { InventoryType } from '../../typings';

const PAGE_SIZE = 30;

const InventoryGrid: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
  const weight = useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);
  const itemAmount = useAppSelector(selectItemAmount);
  const dispatch = useAppDispatch();
  const nineHotbar = useAppSelector((state) => state.inventory.nineHotbar);

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);

  const displayedItems = useMemo(() => {
    if (nineHotbar && inventory.type === 'player') {
      return inventory.items.filter((item) => item.slot > 9);
    }
    return inventory.items;
  }, [nineHotbar, inventory.items, inventory.type]);

  return (
    <>
      <div className="inventory-grid-wrapper" style={{ pointerEvents: isBusy ? 'none' : 'auto' }}>
        <div className="inventory-grid-header-wrapper">
          <div className="inventory-header-left">
            <p className="inventory-label">
              {inventory.type === 'player' ? 'Player Inventory' : inventory.label}
            </p>
            {inventory.type === InventoryType.SHOP && (
              <div className="header-quantity-selector">
                <button className="header-quantity-btn" onClick={() => dispatch(setItemAmount(Math.max(0, itemAmount - 1)))}>
                  <svg viewBox="0 0 24 24" width="12" height="12">
                    <path fill="currentColor" d="M19,13H5V11H19V13Z" />
                  </svg>
                </button>
                <input
                  type="number"
                  value={itemAmount === 0 ? '' : itemAmount}
                  placeholder="0"
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    dispatch(setItemAmount(isNaN(val) ? 0 : Math.max(0, val)));
                  }}
                  className="header-quantity-input"
                />
                <button className="header-quantity-btn" onClick={() => dispatch(setItemAmount(itemAmount + 1))}>
                  <svg viewBox="0 0 24 24" width="12" height="12">
                    <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          {inventory.maxWeight && (
            <div className="inventory-weight-container">
              <p>
                {weight / 1000} / {inventory.maxWeight / 1000}KG
              </p>
              <i className="fa-solid fa-weight-hanging weight-icon"></i>
            </div>
          )}
        </div>
        <div className="inventory-grid-container" ref={containerRef}>
          <>
            {displayedItems.slice(0, (page + 1) * PAGE_SIZE).map((item, index) => (
              <InventorySlot
                key={`${inventory.type}-${inventory.id}-${item.slot}`}
                item={item}
                ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
                inventoryType={inventory.type}
                inventoryGroups={inventory.groups}
                inventoryId={inventory.id}
              />
            ))}
          </>
        </div>
      </div>
    </>
  );
};

export default InventoryGrid;
