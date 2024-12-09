import { createSlice } from '@reduxjs/toolkit';

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    categories: [
      {
        name: "Chinese",
        type: "veg",
        subcategories: [
          { name: "Noodles", price: 150 },
          { name: "Manchurian", price: 180 },
          { name: "Fried Rice", price: 120 },
        ],
      },
      {
        name: "Indian",
        type: "veg",
        subcategories: [
          { name: "Curry", price: 120 },
          { name: "Biryani", price: 250 },
          { name: "Roti", price: 20 },
        ],
      },
    ],
    addedItems: [],
    subCategoryQuantity: {},
  },
  reducers: {
    addItem: (state, action) => {
      const { key, name } = action.payload;
      if (!state.subCategoryQuantity[key]) {
        state.subCategoryQuantity[key] = 1;
        state.addedItems.push({ key, name, quantity: 1 });
      }
    },
    incrementItem: (state, action) => {
      const { key } = action.payload;
      state.subCategoryQuantity[key] += 1;
      state.addedItems = state.addedItems.map((item) =>
        item.key === key ? { ...item, quantity: item.quantity + 1 } : item
      );
    },
    decrementItem: (state, action) => {
      const { key } = action.payload;
      if (state.subCategoryQuantity[key] > 1) {
        state.subCategoryQuantity[key] -= 1;
        state.addedItems = state.addedItems.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        delete state.subCategoryQuantity[key];
        state.addedItems = state.addedItems.filter((item) => item.key !== key);
      }
    },
    removeItem: (state, action) => {
      const { key } = action.payload;
      delete state.subCategoryQuantity[key];
      state.addedItems = state.addedItems.filter((item) => item.key !== key);
    },
  },
});

export const { addItem, incrementItem, decrementItem, removeItem } = menuSlice.actions;
export default menuSlice.reducer;
