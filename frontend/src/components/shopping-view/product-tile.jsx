import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { cooperativeOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useState } from "react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const { isLoading } = useSelector((state) => state.shopProducts);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  const handleClick = (id) => {
    setIsDetailsLoading(true);
    handleGetProductDetails(id);
  };

  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <div onClick={() => handleClick(product?._id)} className="cursor-pointer">
        <div className="relative overflow-hidden">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-amber-600 hover:bg-amber-700">
              {`Only ${product?.totalStock} left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-green-600 hover:bg-green-700">
              On Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-2 line-clamp-1">
            {product?.title}
          </h2>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-sm text-gray-600">
              {cooperativeOptionsMap[product?.cooperative]}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-lg font-bold ${
                product?.salePrice > 0
                  ? "line-through text-gray-400"
                  : "text-amber-700"
              }`}
            >
              {product?.price} ETB
            </span>
            {product?.salePrice > 0 && (
              <span className="text-lg font-bold text-amber-700">
                {product?.salePrice} ETB
              </span>
            )}
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-6 pt-0">
        {product?.totalStock === 0 ? (
          <Button className="w-full" disabled>
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleAddtoCart(product?._id); // Only pass productId
            }}
            className="w-full bg-amber-600 hover:bg-amber-700 cursor-pointer"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
      {isLoading && isDetailsLoading && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      )}
    </Card>
  );
}

export default ShoppingProductTile;
