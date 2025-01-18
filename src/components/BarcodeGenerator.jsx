
import React from 'react';
import Barcode from 'react-barcode';

const BarcodeGenerator = ({ value }) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <Barcode value={value} />
      <p className="text-gray-600">Scan this code to get item info</p>
    </div>
  );
};

export default BarcodeGenerator;
