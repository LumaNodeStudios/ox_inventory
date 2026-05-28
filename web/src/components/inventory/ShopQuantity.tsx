import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectItemAmount, setItemAmount } from '../../store/inventory';

const ShopQuantity: React.FC = () => {
  const itemAmount = useAppSelector(selectItemAmount);
  const dispatch = useAppDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    dispatch(setItemAmount(isNaN(val) ? 0 : Math.max(0, val)));
  };

  const adjustAmount = (amount: number) => {
    dispatch(setItemAmount(Math.max(0, itemAmount + amount)));
  };

  return (
    <div className="shop-quantity-container">
      <div className="shop-quantity-wrapper">
        <button className="shop-quantity-btn minus" onClick={() => adjustAmount(-1)}>
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M19,13H5V11H19V13Z" />
          </svg>
        </button>
        <div className="shop-quantity-input-box">
          <p className="shop-quantity-label">Purchase Quantity</p>
          <input
            type="number"
            value={itemAmount === 0 ? '' : itemAmount}
            placeholder="0"
            onChange={handleInputChange}
            className="shop-quantity-input"
          />
        </div>
        <button className="shop-quantity-btn plus" onClick={() => adjustAmount(1)}>
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ShopQuantity;
