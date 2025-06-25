import { useState } from "react";
import { cn } from "@/lib/utils";

export default function MenuCategories({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}) {
  return (
    <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category}
          className={cn(
            "px-4 py-2 rounded-full whitespace-nowrap font-medium",
            activeCategory === category
              ? "bg-primary text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
          )}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
} 