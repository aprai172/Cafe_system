import React, { useState, useEffect } from "react";
import axios from "axios";
import { data } from "autoprefixer";

/**
 * CategoryForm component
 * @param {boolean}   isEditMode    - If true, the form is in edit mode
 * @param {Object}    categoryData  - Existing category data (used in edit mode)
 * @param {number}    restaurantId  - (Optional) If your API needs this
 * @param {Function}  onSuccess     - Callback triggered after a successful request (add or edit)
 * @param {Function}  onCancel      - Callback to cancel/close the form or bottom sheet
 */
const CategoryForm = ({
  isEditMode = false,
  categoryData = {},
  restaurantId,
  onSuccess,
  onCancel,
  
}) => {
  // Local state for form fields
  const [categoryCode, setCategoryCode] = useState("");
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // Populate form if in edit mode
  useEffect(() => {
    if (isEditMode && categoryData) {
      setCategoryCode(categoryData.category_code || "");
      setName(categoryData.category_name || "");
      setCategoryId(categoryData.category_id || "");
    }
  }, [isEditMode, categoryData]);
  console.log(categoryData,isEditMode);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the payload
    const payload = {
      category_code: categoryCode,
      name: name,
      category_id: categoryId,
      // If your backend requires a restaurant_id, include it:
      restaurant_id: restaurantId,
    };

    try {
      let response;
      if (isEditMode) {
        // EDIT (PUT, PATCH, or whatever your API expects)
        // Example: https://menuordersystem-production.up.railway.app/admin/edit/category/:id
        // or as a query param /admin/edit/category?category_id=<id>
        // Just replace EDIT_API_URL with the correct endpoint
        response = await axios.post(
          `https://menuordersystem-production.up.railway.app/admin/update/category`, 
          payload
        );
      } else {
        // ADD (POST)
        // Replace ADD_API_URL with your actual add endpoint
        response = await axios.post(
          "https://menuordersystem-production.up.railway.app/admin/add/category",
          payload
        );
      }

      if (response.status === 200 || response.status === 201) {
        console.log("Success:", response.data);
        // Trigger parent callback to reload data, close sheet, etc.
        if (onSuccess) {
          onSuccess();
        }
        // Optionally reset fields (useful for add mode)
        setCategoryCode("");
        setName("");
      }

    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        {isEditMode ? "Edit Category" : "Add New Category"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Code */}
        <div>
          <label
            htmlFor="category_code"
            className="block font-semibold mb-1"
          >
            Category Code
          </label>
          <input
            type="text"
            id="category_code"
            name="category_code"
            placeholder="Enter category code"
            value={categoryCode}
            onChange={(e) => setCategoryCode(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Category Name */}
        <div>
          <label htmlFor="name" className="block font-semibold mb-1">
            Category Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isEditMode ? "Update Category" : "Add Category"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
