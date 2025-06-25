import { useState } from "react";
import { cn } from "@/lib/utils";

export function PriceRange({ value, onChange }) {
  const [selectedPrice, setSelectedPrice] = useState(value || 0);

  const handlePriceClick = (price) => {
    // Toggle price: if clicking on the current selection, deselect it
    const newPrice = selectedPrice === price ? 0 : price;
    setSelectedPrice(newPrice);
    if (onChange) {
      onChange(newPrice);
    }
  };

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4].map((price) => (
        <button
          key={price}
          className={cn(
            "px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 text-gray-700",
            selectedPrice === price && "bg-primary text-white hover:bg-primary/90 border-primary"
          )}
          onClick={() => handlePriceClick(price)}
        >
          {"₹".repeat(price)}
        </button>
      ))}
    </div>
  );
} 