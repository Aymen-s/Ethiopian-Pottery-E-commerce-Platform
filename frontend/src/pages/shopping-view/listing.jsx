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
import { toast } from "sonner";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon, SearchIcon } from "lucide-react"; // Added SearchIcon import
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

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
  const navigate = useNavigate();
  const { productList, productDetails, isLoading } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  useEffect(() => {
    const category = searchParams.get("category");
    const cooperative = searchParams.get("cooperative");

    const initialFilters = {};
    if (category) {
      initialFilters.category = category.split(",").filter(Boolean);
    }
    if (cooperative) {
      initialFilters.cooperative = cooperative.split(",").filter(Boolean);
    }

    const storedFilters = JSON.parse(sessionStorage.getItem("filters"));

    const mergedFilters =
      !category &&
      !cooperative &&
      (!storedFilters || Object.keys(storedFilters).length === 0)
        ? {}
        : {
            ...storedFilters,
            ...initialFilters,
          };

    setFilters(mergedFilters);
    sessionStorage.setItem("filters", JSON.stringify(mergedFilters));
  }, [searchParams]);

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    // if (!user || !user._id) {
    //   toast.error("Please log in to add items to your cart", {
    //     description: "Redirecting to login page...",
    //   });
    //   setTimeout(() => {
    //     navigate("/auth/login");
    //   }, 1500);
    //   return;
    // }

    const product = productList.find(
      (item) => item._id === getCurrentProductId
    );
    if (!product) {
      toast.error("Product not found");
      return;
    }

    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > product.totalStock) {
          toast.error(
            `Only ${getQuantity} quantity can be added for this item`
          );
          return;
        }
      }
    }

    dispatch(
      addToCart({
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems());
        toast.success("Product is added to cart");
      } else {
        const errorMessage = data?.payload?.message || "An error occurred";
        console.error("Add to Cart Error:", data?.payload);
        toast.error("Failed to add product to cart", {
          description: errorMessage,
        });
        if (
          errorMessage.includes("Unauthorized") ||
          errorMessage.includes("Token has expired")
        ) {
          setTimeout(() => {
            navigate("/auth/login");
          }, 1500);
        }
      }
    });
  }

  useEffect(() => {
    setSort("price-lowtohigh");
  }, []);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    } else {
      setSearchParams(new URLSearchParams());
    }
  }, [filters, setSearchParams]);

  useEffect(() => {
    if (filters !== null && sort !== null) {
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
    }
  }, [dispatch, sort, filters]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  // Get current sort label for display
  const currentSortLabel =
    sortOptions.find((item) => item.id === sort)?.label || "Sort by";

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 p-4 md:p-8">
      {/* Filter Sidebar */}
      <div className="bg-white rounded-lg shadow-sm border p-6 h-fit sticky top-4 max-h-[calc(100vh-32px)] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4 text-gray-900">Filters</h3>
        <ProductFilter filters={filters} handleFilter={handleFilter} />
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">All Pottery</h2>
            <p className="text-gray-500 mt-1">
              Discover traditional Ethiopian craftsmanship
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              {productList?.length}{" "}
              {productList?.length === 1 ? "Item" : "Items"}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 min-w-[150px] justify-between"
                >
                  <span className="truncate">{currentSortLabel}</span>
                  <ArrowUpDownIcon className="h-4 w-4 flex-shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[220px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {productList && productList.length > 0 ? (
              productList.map((productItem) => (
                <ShoppingProductTile
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                  key={productItem._id}
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <div className="mx-auto max-w-md space-y-4">
                  <SearchIcon className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="text-xl font-medium text-gray-900">
                    No products found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your filters to find what you're looking for
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilters({});
                      setSort("price-lowtohigh");
                    }}
                    className="mt-4"
                  >
                    Clear all filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingListing;
