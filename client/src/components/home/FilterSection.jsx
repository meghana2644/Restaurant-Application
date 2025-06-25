import { useState } from "react";
import { PriceRange } from "@/components/ui/price-range";
import { Input } from "@/components/ui/input";

export default function FilterSection({ onFilterChange, filters }) {
  const [searchInput, setSearchInput] = useState(filters.search);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    onFilterChange({ ...filters, search: value });
  };

  const handleSortChange = (sort) => {
    onFilterChange({ ...filters, sort });
  };

  const handlePriceChange = (price) => {
    onFilterChange({ ...filters, price });
  };

  const toggleDietary = (option) => {
    const newDietary = filters.dietary.includes(option)
      ? filters.dietary.filter(d => d !== option)
      : [...filters.dietary, option];
    onFilterChange({ ...filters, dietary: newDietary });
  };

  return (
    <section className="bg-white py-4 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search restaurants, cuisines, or dishes..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchInput}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex gap-4">
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={filters.sort}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>

            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={filters.price}
              onChange={(e) => handlePriceChange(Number(e.target.value))}
            >
              <option value={0}>All Prices</option>
              <option value={1}>₹</option>
              <option value={2}>₹₹</option>
              <option value={3}>₹₹₹</option>
              <option value={4}>₹₹₹₹</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => toggleDietary('vegetarian')}
            className={`px-3 py-1 rounded-full text-sm ${
              filters.dietary.includes('vegetarian')
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            Vegetarian
          </button>
          <button
            onClick={() => toggleDietary('vegan')}
            className={`px-3 py-1 rounded-full text-sm ${
              filters.dietary.includes('vegan')
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            Vegan
          </button>
          <button
            onClick={() => toggleDietary('glutenFree')}
            className={`px-3 py-1 rounded-full text-sm ${
              filters.dietary.includes('glutenFree')
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            Gluten Free
          </button>
        </div>
      </div>
    </section>
  );
} 