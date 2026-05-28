import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { closeSplitDialog } from '../../store/dialog';
import { fetchNui } from '../../utils/fetchNui';
import Fade from '../utils/transitions/Fade';
import { Locale } from '../../store/locale';

const SplitDialog: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isOpen, item } = useAppSelector((state) => state.dialog);
  const [value, setValue] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setValue(1);
    }
  }, [isOpen]);

  if (!item) return null;

  const handleSplit = () => {
    fetchNui('splitItem', { slot: item.slot, count: value });
    dispatch(closeSplitDialog());
  };

  const handleCancel = () => {
    dispatch(closeSplitDialog());
  };

  return (
    <Fade in={isOpen}>
      <div className="split-dialog-backdrop" onClick={handleCancel}>
        <div className="split-dialog-container" onClick={(e) => e.stopPropagation()}>
          <div className="split-dialog-header">
            {Locale.ui_split || 'Split Item'}
          </div>
          <div className="split-dialog-body">
            <div className="split-dialog-item-info">
              {item.label || item.name} <span>({item.count})</span>
            </div>
            
            <div className="split-dialog-input-group">
              <input
                type="number"
                min={1}
                max={item.count - 1}
                value={value}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) {
                    setValue(Math.min(Math.max(1, val), item.count - 1));
                  }
                }}
                className="split-dialog-input"
              />
              <span className="split-dialog-slash">/</span>
              <span className="split-dialog-max">{item.count - 1}</span>
            </div>

            <div className="split-dialog-slider-container">
              <input
                type="range"
                min={1}
                max={item.count - 1}
                value={value}
                onChange={(e) => setValue(parseInt(e.target.value))}
                className="split-dialog-slider"
              />
            </div>
          </div>
          <div className="split-dialog-footer">
            <button onClick={handleSplit} className="split-dialog-button confirm">
              {Locale.ui_confirm || 'Confirm'}
            </button>
            <button onClick={handleCancel} className="split-dialog-button cancel">
              {Locale.ui_cancel || 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default SplitDialog;
