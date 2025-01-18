// src/components/MenuManagement/CategoryList.js
import React from 'react';

const CategoryList = ({ categories, onSelectCategory }) => {
  return (
    <ul className="divide-y divide-gray-200 border border-gray-200 rounded">
      {categories.map((cat) => (
        <li key={cat.id} className="p-2 flex justify-between items-center">
          <span>{cat.name}</span>
          <button
            className="text-blue-600 underline"
            onClick={() => onSelectCategory(cat)}
          >
            Manage
          </button>
        </li>
      ))}
    </ul>
  );
};

export default CategoryList;
