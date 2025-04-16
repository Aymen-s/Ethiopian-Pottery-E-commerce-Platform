import { filterOptions } from "@/config";
import React from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filters = {}, handleFilter }) {
  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.keys(filterOptions).map((keyItem) => (
          <React.Fragment key={keyItem}>
            <div className="space-y-2">
              <h3 className="text-base font-bold">
                {keyItem.charAt(0).toUpperCase() + keyItem.slice(1)}
              </h3>
              <div className="grid gap-2 mt-2">
                {filterOptions[keyItem].map((option) => (
                  <Label
                    key={option.id}
                    className="flex font-medium items-center gap-2"
                  >
                    <Checkbox
                      checked={
                        Array.isArray(filters[keyItem]) &&
                        filters[keyItem].includes(option.id)
                      }
                      onCheckedChange={(checked) =>
                        handleFilter(keyItem, option.id, checked)
                      }
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            <Separator />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
