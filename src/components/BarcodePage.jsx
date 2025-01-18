// src/pages/BarcodePage.js
import React, { useState } from 'react';
import BarcodeGenerator from './BarcodeGenerator';

const BarcodePage = () => {
  const [inputValue, setInputValue] = useState('MenuItem_123');

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Barcode Generator</h2>
      <div className="bg-white p-4 rounded shadow space-y-4">
        <input
          type="text"
          className="border border-gray-300 rounded px-2 py-1"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <BarcodeGenerator value={inputValue} />
      </div>
    </div>
  );
};

export default BarcodePage;
