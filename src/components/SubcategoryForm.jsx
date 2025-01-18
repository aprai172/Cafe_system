// src/components/MenuManagement/SubcategoryForm.js
import React, { useState } from 'react';

const SubcategoryForm = ({ category }) => {
  const [subcatName, setSubcatName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subcatName.trim()) return;

    // Dummy "add subcategory" action
    console.log(`Added subcategory "${subcatName}" to category "${category.name}"`);
    setSubcatName('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        placeholder="New Subcategory"
        className="border border-gray-300 rounded px-2 py-1"
        value={subcatName}
        onChange={(e) => setSubcatName(e.target.value)}
      />
      <button className="bg-blue-600 text-white px-3 py-1 rounded" type="submit">
        Add
      </button>
    </form>
  );
};

export default SubcategoryForm;
