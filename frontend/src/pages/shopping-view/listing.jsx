import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-detail";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  // Initialize and sync filters with URL params
  useEffect(() => {
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const newFilters = {};
    if (category) {
      newFilters.category = [category];
    }
    if (brand) {
      newFilters.brand = brand.split(",");
    }
    setFilters(newFilters);
  }, [searchParams]);

  // Update URL params when filters change
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      const queryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(queryString));
    } else {
      setSearchParams(new URLSearchParams());
    }
  }, [filters, setSearchParams]);

  // Fetch products when filters or sort change
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
    );
  }, [dispatch, filters, sort]);

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption, checked) {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      if (!newFilters[getSectionId]) {
        newFilters[getSectionId] = [];
      }
      if (getSectionId === "category") {
        // Single selection for category
        if (checked) {
          newFilters[getSectionId] = [getCurrentOption];
        } else {
          delete newFilters[getSectionId];
        }
      } else {
        // Multi-selection for brand
        if (checked) {
          newFilters[getSectionId] = [
            ...newFilters[getSectionId].filter((id) => id !== getCurrentOption),
            getCurrentOption,
          ];
        } else {
          newFilters[getSectionId] = newFilters[getSectionId].filter(
            (id) => id !== getCurrentOption
          );
          if (newFilters[getSectionId].length === 0) {
            delete newFilters[getSectionId];
          }
        }
      }
      return newFilters;
    });
  }

  function handleGetProductDetails(id) {
    dispatch(fetchProductDetails(id));
  }

  function handleAddtoCart(productId) {
    dispatch(addToCart({ userId: user.id, productId, quantity: 1 })).then(
      (data) => {
        if (data.payload.success) {
          dispatch(fetchCartItems(user.id));
          toast.success("Product added to cart");
        }
      }
    );
  }

  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList.length} products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList.map((product) => (
            <ShoppingProductTile
              handleGetProductDetails={handleGetProductDetails}
              key={product._id}
              product={product}
              handleAddtoCart={handleAddtoCart}
            />
          ))}
        </div>
      </div>
      {productDetails && (
        <ProductDetailsDialog
          open={openDetailsDialog}
          setOpen={setOpenDetailsDialog}
          productDetails={productDetails}
        />
      )}
    </div>
  );
}

export default ShoppingListing;
