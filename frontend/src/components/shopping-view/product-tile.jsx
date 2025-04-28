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
    <Card className="w-full max-w-sm mx-auto relative">
      <div onClick={() => handleClick(product?._id)}>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-[16px] text-muted-foreground">
              {cooperativeOptionsMap[product?.cooperative]}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-semibold text-primary">
                ${product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
      {isLoading && isDetailsLoading && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-lg">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      )}
    </Card>
  );
}

export default ShoppingProductTile;
