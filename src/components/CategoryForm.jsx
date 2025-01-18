// src/components/MenuManagement/CategoryForm.js
import React, { useState } from 'react';

const CategoryForm = ({ onAddCategory }) => {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    const newCategory = {
      id: Date.now(), // Dummy ID
      name: categoryName.trim(),
    };

    onAddCategory(newCategory);
    setCategoryName('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        className="border border-gray-300 rounded px-2 py-1"
        placeholder="New Category"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
      />
      <button className="bg-blue-600 text-white px-3 py-1 rounded" type="submit">
        Add
      </button>
    </form>
  );
};

export default CategoryForm;
