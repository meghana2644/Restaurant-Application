import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function DietaryFilter({ onFilterChange }) {
  const [filters, setFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false
  });

  const handleFilterChange = (filter) => {
    const newFilters = {
      ...filters,
      [filter]: !filters[filter]
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg border mb-6">
      <h3 className="font-medium text-lg mb-3">Dietary Preferences</h3>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="vegetarian" 
            checked={filters.vegetarian}
            onCheckedChange={() => handleFilterChange('vegetarian')}
          />
          <Label htmlFor="vegetarian" className="cursor-pointer">Vegetarian</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="vegan" 
            checked={filters.vegan}
            onCheckedChange={() => handleFilterChange('vegan')}
          />
          <Label htmlFor="vegan" className="cursor-pointer">Vegan</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="glutenFree" 
            checked={filters.glutenFree}
            onCheckedChange={() => handleFilterChange('glutenFree')}
          />
          <Label htmlFor="glutenFree" className="cursor-pointer">Gluten-Free</Label>
        </div>
      </div>
    </div>
  );
} 