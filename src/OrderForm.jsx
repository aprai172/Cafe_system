import React, { useState } from "react";
import {QRCodeSVG} from 'qrcode.react';

const QRCodeGenerator = () => {
  const [url, setUrl] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">QR Code Generator</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter URL or Text
        </label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mt-6 flex justify-center">
          {url && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <QRCodeSVG value={url} size={150} />
            </div>
          )}
        </div>
        <button
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => alert("QR Code Generated!")}
        >
          Generate QR Code
        </button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
