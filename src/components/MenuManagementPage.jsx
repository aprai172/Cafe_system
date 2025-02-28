// src/pages/MenuManagementPage.js
import React, { useState, useEffect, useRef } from "react";
import { GiNoodles, GiFruitBowl } from "react-icons/gi";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import BottomSheet from "../components/global/bottomSheet";
import AddCategoryForm from "./addnewMenu/AddCategory";
import AddSubCategory from "./addnewMenu/AddSubCategory";

const MenuManagementPage = () => {
  const [jsonData, setJsonData] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState(null);
  const [showVegOnly, setShowVegOnly] = useState(false);

  // We use modalType instead of isSheetOpen to decide which form to show
  const [modalType, setModalType] = useState(null);

  const bottomSheetRef = useRef(null);

  const restaurantId = 1;

  // ---------------------------------
  // Fetch menu data
  // ---------------------------------
  const fetchMenuData = async () => {
    try {
      const response = await axios.get(
        `https://menuordersystem-production.up.railway.app/get_menu?restaurant_id=${restaurantId}`
      );
      setJsonData(response.data);
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  // ---------------------------------
  // Open and close BottomSheet
  // ---------------------------------
  const openSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.open();
    }
  };

  const closeSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
    // Reset modalType if needed
    setModalType(null);
    setEditMode(false);
    setEditCategoryData(null);
  };

  // ---------------------------------
  // Edit Category
  // ---------------------------------
  const handleEdit = (category) => {
    setEditMode(true);
    setEditCategoryData(category);
    setModalType("CATEGORY"); // We want to edit an existing Category
    openSheet();
  };

  // ---------------------------------
  // Delete Category
  // ---------------------------------
  const handleDeleteCategory = async (categoryCode) => {
    try {
      // Note: You said your API for delete is a POST endpoint
      // "https://menuordersystem-production.up.railway.app/admin/delete/category".
      // Double-check the required request method & body format.
      await axios.post(
        "https://menuordersystem-production.up.railway.app/admin/delete/category",
        {
          category_code: categoryCode,
          restaurant_id: restaurantId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Delete success");
      // Re-fetch to update the UI or do a full reload
      // fetchMenuData();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // ---------------------------------
  // Callback after success (Add/Edit)
  // ---------------------------------
  const handleSuccess = () => {
    closeSheet();
    // If you don't want a full page reload, do fetchMenuData() instead:
    // fetchMenuData();
    window.location.reload();
  };

  // ---------------------------------
  // Add Category or Subcategory
  // ---------------------------------
  const handleAddCategory = () => {
    // For brand-new category
    setEditMode(false);
    setEditCategoryData(null);
    setModalType("CATEGORY");
    openSheet();
  };

  // When user wants to add subcategory to an expanded category
  // we might pass that category's info to the subcategory form
  // if needed (e.g. category_code).
  const handleAddSubcategory = (category) => {
    setModalType("SUBCATEGORY");
    // If your subcategory form needs the parent category code or ID:
    setEditCategoryData(category);
    openSheet();
  };

  // ---------------------------------
  // Guard: Data is still loading
  // ---------------------------------
  if (!jsonData) {
    return <div>Loading menu...</div>;
  }

  // Filter items if showVegOnly is true
  const filteredMenu = jsonData.menu?.map((category) => {
    const items = category.items || [];
    const filteredItems = showVegOnly
      ? items.filter((item) => item.is_veg)
      : items;
    return { ...category, items: filteredItems };
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Menu Management</h2>

      <div className="min-h-screen p-4 relative">
        {/* Veg/Non-Veg Toggle */}
        <div className="flex items-center mb-4 ml-2">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showVegOnly}
              onChange={() => setShowVegOnly((prev) => !prev)}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            <span
              className={`ms-3 text-lg font-medium ${
                showVegOnly ? "text-green-500" : "text-gray-900"
              }`}
            >
              Veg Only
            </span>
          </label>
        </div>

        <button
          className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          onClick={handleAddCategory}
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Add New Categories
          </span>
        </button>

        {/* Categories Section */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Categories
          </h2>

          {filteredMenu.map((category, index) => (
            <div key={index} className="mb-4">
              {/* Category Header */}
              <div className="flex justify-between items-center w-full p-4 bg-gray-200 rounded-lg hover:bg-gray-300 shadow-md">
                <div className="flex items-center gap-2">
                  {/* Icon */}
                  <span className="text-xl">
                    {category.category_name === "Chinese" ? (
                      <GiNoodles />
                    ) : (
                      <GiFruitBowl />
                    )}
                  </span>
                  {/* Name */}
                  <span className="text-gray-800 font-medium">
                    {category.category_name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Delete Category */}
                  <button
                    onClick={() => handleDeleteCategory(category.category_code)}
                  >
                    <MdDeleteOutline />
                  </button>
                  {/* Edit Category */}
                  <button
                    className="text-gray-800 font-bold"
                    onClick={() => handleEdit(category)}
                  >
                    Edit
                  </button>
                  {/* Expand/Collapse */}
                  <button
                    className="text-gray-800 font-bold"
                    onClick={() =>
                      setExpandedCategory(
                        expandedCategory === index ? null : index
                      )
                    }
                  >
                    {expandedCategory === index ? "▲" : "▼"}
                  </button>
                </div>
              </div>

              {/* Items List (expanded) */}
              {expandedCategory === index && (
                <div className="mt-4">
                  {category.items && category.items.length > 0 ? (
                    category.items.map((item) => (
                      <div
                        key={item.item_id}
                        className={`border rounded-lg p-4 shadow-md mb-4 ${
                          !item.is_available ? "opacity-50" : "bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src="https://via.placeholder.com/50"
                            alt={`${item.item_name} image`}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="text-sm font-medium text-gray-800">
                              {item.item_name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {item.description}
                            </p>
                            <p className="text-sm text-gray-700 font-bold">
                              ₹{item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {!item.is_available && (
                          <p className="text-red-500 mt-2">Not Available</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="italic text-gray-500 text-sm">
                      No items available for this category.
                    </div>
                  )}

                  {/* Add New Subcategory Button */}
                  <button
                    className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                    onClick={() => handleAddSubcategory(category)}
                  >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0 text-black">
                      Add New Subcategory
                    </span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* BottomSheet for Add/Edit Category or Subcategory */}
        <BottomSheet
          ref={bottomSheetRef}
          maxHeightPercent={100}
          dragThresholdPercent={25}
          isStatic={true}
          staticHeight={400}
          onClose={closeSheet}
        >
          {modalType === "CATEGORY" ? (
            <AddCategoryForm
              isEditMode={editMode}
              categoryData={editCategoryData}
              restaurantId={restaurantId}
              onSuccess={handleSuccess}
            />
          ) : modalType === "SUBCATEGORY" ? (
            <AddSubCategory
              parentCategory={editCategoryData} // If needed to know which category to attach subcategory to
              onSuccess={handleSuccess}
            />
          ) : (
            <div className="p-4">
              <p className="text-gray-500">No form selected</p>
            </div>
          )}
        </BottomSheet>
      </div>
    </div>
  );
};

export default MenuManagementPage;
