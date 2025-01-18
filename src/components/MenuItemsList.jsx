// src/components/MenuManagement/MenuItemsList.js
import React from 'react';

const MenuItemsList = ({ category }) => {
  // Dummy menu items. In a real scenario, you'd filter or fetch from an API.
  const dummyMenuItems = [
    { id: 101, name: 'Espresso', subcategory: 'Hot Coffee' },
    { id: 102, name: 'Latte', subcategory: 'Hot Coffee' },
    { id: 201, name: 'Green Tea', subcategory: 'Hot Tea' },
    { id: 202, name: 'Iced Tea', subcategory: 'Cold Tea' },
  ];

  // Let’s assume these belong to the currently selected category
  const relevantItems = dummyMenuItems.filter(item =>
    category.name.toLowerCase().includes('coffee') ? item.subcategory.toLowerCase().includes('coffee')
      : category.name.toLowerCase().includes('tea') ? item.subcategory.toLowerCase().includes('tea')
      : true
  );

  return (
    <div>
      <h4 className="font-semibold text-lg">Menu Items</h4>
      <ul className="divide-y divide-gray-200 border border-gray-200 rounded">
        {relevantItems.map((item) => (
          <li key={item.id} className="p-2 flex justify-between">
            <span>{item.name} <span className="italic text-sm text-gray-500">({item.subcategory})</span></span>
            <button className="text-blue-600 underline">Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuItemsList;
