import React, { useState } from 'react';
import { useBall } from './ball-provider';
import './energy-selector.css';

const EnergySelector = () => {
  const [value, setValue] = useState(0);
  const { isAiming, applyForce } = useBall();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAiming) return;
    const slider = e.currentTarget;
    const rect = slider.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const sliderWidth = rect.width;

    const newValue = Math.max(0, Math.min(100, (mouseX / sliderWidth) * 100));
    setValue(newValue);
  };

  const handleMouseUp = () => {
    if (isAiming) return;
    applyForce(value);
  };

  if (isAiming) {
    return null;
  }

  return (
    <div className="slider-container" onMouseUp={handleMouseUp}>
      <div className="slider" onMouseMove={handleMouseMove}>
        {/* Sectioned Power Gauge */}
        <div className="slider-section cool" style={{ width: '25%' }} />
        <div className="slider-section warm" style={{ width: '25%' }} />
        <div className="slider-section hot" style={{ width: '25%' }} />
        <div className="slider-section very-hot" style={{ width: '25%' }} />

        {/* Fill indicating the current value */}
        <div className="slider-fill" style={{ width: `${value}%` }} />
      </div>

      <div className="slider-value">
        <strong>{Math.round(value)}</strong>
      </div>
    </div>
  );
};

export default EnergySelector;
