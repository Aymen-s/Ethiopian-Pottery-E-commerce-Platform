import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import ProductDetailsDialog from "@/components/shopping-view/product-detail";
import { getFeatureImages } from "@/store/common-slice";
import {
  BrushIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CoffeeIcon,
  EthernetPort,
  GlassWaterIcon,
  IceCreamBowlIcon,
  SoupIcon,
  UsersIcon,
} from "lucide-react";

const categoriesWithIcon = [
  { id: "jebenas", label: "Jebenas", icon: CoffeeIcon },
  { id: "dists", label: "Dists", icon: SoupIcon },
  { id: "bowls", label: "Bowls", icon: IceCreamBowlIcon },
  { id: "vases", label: "Vases", icon: GlassWaterIcon },
  { id: "other", label: "Other", icon: EthernetPort },
];

const cooperativesWithIcon = [
  { id: "kechene", label: "Kechene", icon: UsersIcon },
  { id: "other", label: "Other Artisans", icon: BrushIcon },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { user, isLoading: authLoading } = useSelector((state) => state.auth);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Debug user state on mount and changes
  useEffect(() => {
    console.log("ShoppingHome - Auth State:", { user, authLoading });
  }, [user, authLoading]);

  function handleNavigateToListingPage(getCurrentItem, section) {
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    const queryParams = new URLSearchParams();
    if (section === "category") {
      queryParams.set("category", getCurrentItem.id);
    } else if (section === "cooperative") {
      queryParams.set("cooperative", getCurrentItem.id);
    }

    dispatch(
      fetchAllFilteredProducts({
        filterParams: currentFilter,
        sortParams: "price-lowtohigh",
      })
    );

    navigate({
      pathname: "/shop/listing",
      search: queryParams.toString(),
    });
  }

  function handleGetProductDetails(id) {
    dispatch(fetchProductDetails(id));
  }

  function handleAddtoCart(productId) {
    // Check if auth is still loading
    if (authLoading) {
      toast.info("Please wait, checking authentication...");
      return;
    }

    // Check if user is authenticated
    // if (!user || !user.id) {
    //   toast.error("Please log in to add items to your cart", {
    //     description: "Redirecting to login page...",
    //   });
    //   setTimeout(() => {
    //     navigate("/auth/login");
    //   }, 1500);
    //   return;
    // }

    dispatch(addToCart({ productId, quantity: 1 })).then((data) => {
      if (data.payload.success) {
        dispatch(fetchCartItems());
        toast.success("Product added to cart");
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
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featureImageList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-[#faf6f2]">
      {/* Hero Carousel Section */}
      <div className="relative w-full h-[70vh] max-h-[800px] overflow-hidden">
        {featureImageList && featureImageList.length > 0 && (
          <>
            {featureImageList.map((slide, index) => (
              <img
                key={index}
                src={slide.image}
                alt={`Slide ${index}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
              {featureImageList.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? "bg-amber-600 w-6" : "bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                key={categoryItem.id}
                className="cursor-pointer group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <div className="bg-amber-100/30 group-hover:bg-amber-100/50 p-4 rounded-full mb-4 transition-colors">
                    <categoryItem.icon className="w-10 h-10 text-amber-600" />
                  </div>
                  <span className="font-semibold text-gray-800 group-hover:text-amber-700 transition-colors">
                    {categoryItem.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cooperatives Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Shop by Cooperative
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {cooperativesWithIcon.map((coopItem) => (
              <Card
                onClick={() =>
                  handleNavigateToListingPage(coopItem, "cooperative")
                }
                key={coopItem.id}
                className="cursor-pointer group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <div className="bg-amber-100/30 group-hover:bg-amber-100/50 p-4 rounded-full mb-4 transition-colors">
                    <coopItem.icon className="w-10 h-10 text-amber-600" />
                  </div>
                  <span className="font-semibold text-gray-800 group-hover:text-amber-700 transition-colors">
                    {coopItem.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Featured Pottery</h2>
            <p className="text-gray-600 mt-2">
              Handpicked traditional Ethiopian pottery
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {productList.length > 0 ? (
              productList
                .slice(0, 3)
                .map((product) => (
                  <ShoppingProductTile
                    key={product._id}
                    product={product}
                    handleGetProductDetails={handleGetProductDetails}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No featured products available</p>
              </div>
            )}
          </div>
        </div>
      </section>

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

export default ShoppingHome;
