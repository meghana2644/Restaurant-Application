import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function RestaurantOwnerMenu() {
  const [, setLocation] = useLocation();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false
  });

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLocation("/restaurant-owner/login");
          return;
        }
        const response = await axios.get("http://localhost:5000/api/restaurant-owner/menu-items", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMenuItems(response.data);
      } catch (err) {
        setError("Failed to fetch menu items");
        console.error("Error fetching menu items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, [setLocation]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/restaurant-owner/menu-items",
        newItem,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMenuItems([...menuItems, response.data]);
      setNewItem({
        name: "",
        description: "",
        price: "",
        category: "",
        imageUrl: "",
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false
      });
      toast.success("Menu item added successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add menu item");
    }
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/restaurant-owner/menu-items/${editingItem._id}`,
        editingItem,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMenuItems(menuItems.map(item => item._id === editingItem._id ? response.data : item));
      setEditingItem(null);
      toast.success("Menu item updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update menu item");
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/restaurant-owner/menu-items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMenuItems(menuItems.filter(item => item._id !== itemId));
      toast.success("Menu item deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete menu item");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading menu items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => setLocation("/restaurant-owner/login")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Menu Management</h2>
        </div>

        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
            </h3>
            <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    required
                    value={editingItem ? editingItem.name : newItem.name}
                    onChange={(e) =>
                      editingItem
                        ? setEditingItem({ ...editingItem, name: e.target.value })
                        : setNewItem({ ...newItem, name: e.target.value })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    required
                    value={editingItem ? editingItem.price : newItem.price}
                    onChange={(e) =>
                      editingItem
                        ? setEditingItem({ ...editingItem, price: e.target.value })
                        : setNewItem({ ...newItem, price: e.target.value })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    required
                    value={editingItem ? editingItem.description : newItem.description}
                    onChange={(e) =>
                      editingItem
                        ? setEditingItem({ ...editingItem, description: e.target.value })
                        : setNewItem({ ...newItem, description: e.target.value })
                    }
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    required
                    value={editingItem ? editingItem.category : newItem.category}
                    onChange={(e) =>
                      editingItem
                        ? setEditingItem({ ...editingItem, category: e.target.value })
                        : setNewItem({ ...newItem, category: e.target.value })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input
                    type="url"
                    value={editingItem ? editingItem.imageUrl : newItem.imageUrl}
                    onChange={(e) =>
                      editingItem
                        ? setEditingItem({ ...editingItem, imageUrl: e.target.value })
                        : setNewItem({ ...newItem, imageUrl: e.target.value })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingItem ? editingItem.isVegetarian : newItem.isVegetarian}
                        onChange={(e) =>
                          editingItem
                            ? setEditingItem({ ...editingItem, isVegetarian: e.target.checked })
                            : setNewItem({ ...newItem, isVegetarian: e.target.checked })
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Vegetarian</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingItem ? editingItem.isVegan : newItem.isVegan}
                        onChange={(e) =>
                          editingItem
                            ? setEditingItem({ ...editingItem, isVegan: e.target.checked })
                            : setNewItem({ ...newItem, isVegan: e.target.checked })
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Vegan</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingItem ? editingItem.isGlutenFree : newItem.isGlutenFree}
                        onChange={(e) =>
                          editingItem
                            ? setEditingItem({ ...editingItem, isGlutenFree: e.target.checked })
                            : setNewItem({ ...newItem, isGlutenFree: e.target.checked })
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Gluten Free</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                {editingItem && (
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {editingItem ? "Update Item" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Current Menu Items</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => (
              <div key={item._id} className="bg-white shadow rounded-lg overflow-hidden">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{item.name}</h4>
                      <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                    </div>
                    <p className="text-lg font-medium text-gray-900">₹{item.price}</p>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.isVegetarian && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Vegetarian
                      </span>
                    )}
                    {item.isVegan && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Vegan
                      </span>
                    )}
                    {item.isGlutenFree && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Gluten Free
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="text-sm text-red-600 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 