import React, { useEffect, useState } from "react";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import { Button } from "@/components/ui/button";
import {
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  ShirtIcon,
  UmbrellaIcon,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: ShirtIcon },
  { id: "adidas", label: "Adidas", icon: ShirtIcon },
  { id: "puma", label: "Puma", icon: ShirtIcon },
  { id: "levi", label: "Levi's", icon: ShirtIcon },
  { id: "zara", label: "Zara", icon: ShirtIcon },
  { id: "h&m", label: "H&M", icon: ShirtIcon },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList } = useSelector((state) => state.shopProducts);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slides = [bannerOne, bannerTwo, bannerThree];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleNavigateToListingPage(getCurrentItem, section) {
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    // Construct query string
    const queryParams = new URLSearchParams();
    if (section === "category") {
      queryParams.set("category", getCurrentItem.id);
    } else if (section === "brand") {
      queryParams.set("brand", getCurrentItem.id);
    }

    // Dispatch filter to update product list
    dispatch(
      fetchAllFilteredProducts({
        filterParams: currentFilter,
        sortParams: "price-lowtohigh",
      })
    );

    // Navigate with query params
    navigate({
      pathname: "/shop/listing",
      search: queryParams.toString(),
    });
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSlideChange = (direction) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) =>
      direction === "next"
        ? (prev + 1) % slides.length
        : prev === 0
        ? slides.length - 1
        : prev - 1
    );
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide}
            alt={`Slide ${index}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleSlideChange("prev")}
          disabled={isTransitioning}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 text-gray-800 hover:bg-gray-200 z-20"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleSlideChange("next")}
          disabled={isTransitioning}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 text-gray-800 hover:bg-gray-200 z-20"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                key={categoryItem.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 text-primary mb-4" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                key={brandItem.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 text-primary mb-4" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productList.length > 0
              ? productList.map((product) => (
                  <ShoppingProductTile product={product} key={product._id} />
                ))
              : null}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ShoppingHome;
