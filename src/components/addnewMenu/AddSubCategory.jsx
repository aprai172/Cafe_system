import React, { useState } from 'react';

const AddSubCategory = () => {
  const [restaurantId, setRestaurantId] = useState('');
  const [categoryCode, setCategoryCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isVeg, setIsVeg] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare the payload
    const formData = {
      restaurant_id: parseInt(restaurantId, 10) || 0,
      category_code: categoryCode,
      name: name,
      description: description,
      price: parseFloat(price) || 0,
      is_veg: isVeg,
      is_available: isAvailable,
    };
    
    console.log('Form Data:', formData);
    
    // TODO: Replace console.log with an actual API request, e.g.:
    // axios.post('YOUR_API_ENDPOINT', formData)
    //   .then(response => ...)
    //   .catch(error => ...);
    
    // Reset form (optional)
    setRestaurantId('');
    setCategoryCode('');
    setName('');
    setDescription('');
    setPrice('');
    setIsVeg(false);
    setIsAvailable(true);
  };

  return (
    <div className="flex justify-center items-center   bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-2 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-3 text-center">Add Menu Item</h2>

        {/* Restaurant ID */}
        <label htmlFor="restaurant_id" className="block mb-1 font-semibold">
          Restaurant ID
        </label>
        <input
          type="number"
          id="restaurant_id"
          name="restaurant_id"
          value={restaurantId}
          onChange={(e) => setRestaurantId(e.target.value)}
          placeholder="Enter Restaurant ID"
          className="w-full mb-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
          required
        />

        {/* Category Code */}
        <label htmlFor="category_code" className="block mb-1 font-semibold">
          Category Code
        </label>
        <input
          type="text"
          id="category_code"
          name="category_code"
          value={categoryCode}
          onChange={(e) => setCategoryCode(e.target.value)}
          placeholder="Enter Category Code"
          className="w-full mb-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
          required
        />

        {/* Name */}
        <label htmlFor="name" className="block mb-2 font-semibold">
          Item Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Item Name"
          className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
          required
        />

        {/* Description */}
        <label htmlFor="description" className="block mb-2 font-semibold">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter Item Description"
          className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
          rows="3"
        />

        {/* Price */}
        <label htmlFor="price" className="block mb-2 font-semibold">
          Price (₹)
        </label>
        <input
          type="number"
          step="0.01"
          id="price"
          name="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter Price"
          className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
          required
        />

        {/* is_veg */}
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="is_veg"
            name="is_veg"
            checked={isVeg}
            onChange={(e) => setIsVeg(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="is_veg" className="font-semibold">
            Is Veg?
          </label>
        </div>

        {/* is_available */}
        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="is_available"
            name="is_available"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="is_available" className="font-semibold">
            Is Available?
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddSubCategory;
