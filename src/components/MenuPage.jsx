import React, { useState, useEffect } from "react";
import axios from "axios";
import { GiNoodles, GiFruitBowl } from "react-icons/gi";
import OrderItemPage from "./OrderItem";

const MenuPage = () => {
  const [jsonData, setJsonData] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showVegOnly, setShowVegOnly] = useState(false);
  const [showOrderPage, setShowOrderPage] = useState(false);
  const restaurantId = 1; 

  // Fetch menu data from API
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        
        const response = await axios.get(
          `https://menu-order-system.onrender.com/get_menu?restaurant_id=${restaurantId}`
        );
        setJsonData(response.data);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };

    fetchMenuData();
  }, []);

  const handleAddToCart = (item) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.item_id === item.item_id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.item_id === item.item_id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const handleIncrement = (item) => {
    setCartItems((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.item_id === item.item_id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    );
  };

  const handleDecrement = (item) => {
    setCartItems((prevCart) =>
      prevCart
        .map((cartItem) =>
          cartItem.item_id === item.item_id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0)
    );
  };

  const handleRemove = (key) => {
    setCartItems((prevCart) => prevCart.filter((item) => item.item_id !== key));
  };

  if (!jsonData) {
    return <div>Loading menu...</div>;
  }

  const filteredMenu = jsonData.menu
    ?.filter((category) => category.items) // Exclude categories with `null` items
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => (showVegOnly ? item.is_veg : true)),
    }));

  return (
    <div>
      {showOrderPage ? (
        <OrderItemPage
          addedItems={cartItems.map((item) => ({
            key: item.item_id,
            name: item.item_name,
            quantity: item.quantity,
            price: item.price,
          }))}
          handleRemove={handleRemove}
          setShowOrderPage={setShowOrderPage}
        />
      ) : (
        <div
          className="min-h-screen p-4 relative"
          style={{
            background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
          }}
        >
          <header className="bg-white shadow-lg rounded-lg p-4 mb-4 text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {jsonData.restaurant_name}
            </h1>
            <p className="text-sm text-gray-600">Owned by {jsonData.owner_name}</p>
            {jsonData.is_taking_orders ? (
              <p className="text-green-500">We are taking orders!</p>
            ) : (
              <p className="text-red-500">Sorry, we are not taking orders.</p>
            )}
          </header>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 mb-4"
            onClick={() => setShowOrderPage(true)}
          >
            View Order ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
          </button>

          {/* Veg/Non-Veg Toggle */}
          <div className="flex  items-center mb-4 ml-2">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showVegOnly}
                onChange={() => setShowVegOnly((prev) => !prev)}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className={`ms-3 text-lg font-medium ${showVegOnly ? "text-green-500" : "text-gray-900"}`}  >
                 Veg Only
              </span>
            </label>
          </div>

          {/* Categories Section */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Categories
            </h2>
            {filteredMenu.map((category, index) => (
              <div key={index} className="mb-4">
                <button
                  className="flex justify-between items-center w-full p-4 bg-gray-200 rounded-lg hover:bg-gray-300 shadow-md"
                  onClick={() =>
                    setExpandedCategory(expandedCategory === index ? null : index)
                  }
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {category.category_name === "Chinese" ? (
                        <GiNoodles />
                      ) : (
                        <GiFruitBowl />
                      )}
                    </span>
                    <span className="text-gray-800 font-medium">
                      {category.category_name}
                    </span>
                  </div>
                  <span className="text-gray-800 font-bold">
                    {expandedCategory === index ? "▲" : "▼"}
                  </span>
                </button>
                {expandedCategory === index && (
                  <div className="mt-4">
                    {category.items.map((item) => (
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
                        {item.is_available ? (
                          cartItems.find(
                            (cartItem) => cartItem.item_id === item.item_id
                          ) ? (
                            <div className="flex gap-2 mt-2">
                              <button
                                className="bg-red-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-red-600"
                                onClick={() => handleDecrement(item)}
                              >
                                -
                              </button>
                              <span className="text-gray-800 px-2 py-1 text-sm">
                                {
                                  cartItems.find(
                                    (cartItem) =>
                                      cartItem.item_id === item.item_id
                                  )?.quantity || 0
                                }
                              </span>
                              <button
                                className="bg-green-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-green-600"
                                onClick={() => handleIncrement(item)}
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              className="bg-green-500 text-white px-4 py-1 text-sm rounded-lg hover:bg-green-600 mt-2"
                              onClick={() => handleAddToCart(item)}
                            >
                              Add
                            </button>
                          )
                        ) : (
                          <p className="text-red-500 mt-2">Not Available</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
