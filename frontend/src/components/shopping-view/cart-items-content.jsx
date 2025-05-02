import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { toast } from "sonner";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction === "plus") {
      if (!productList || productList.length === 0) {
        toast.error("Product information not available");
        return;
      }

      const getCurrentProduct = productList.find(
        (product) => product._id === getCartItem?.productId
      );

      if (!getCurrentProduct) {
        toast.error("Product not found");
        return;
      }

      const currentQuantity = getCartItem?.quantity || 0;
      if (currentQuantity + 1 > getCurrentProduct.totalStock) {
        toast.error(
          `Only ${getCurrentProduct.totalStock} units available for this item`
        );
        return;
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : Math.max(1, getCartItem?.quantity - 1),
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success(
          typeOfAction === "plus"
            ? "Product quantity increased"
            : "Product quantity decreased"
        );
      } else {
        toast.error(data?.payload?.message || "Failed to update quantity");
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Product removed from cart");
      } else {
        toast.error(data?.payload?.message || "Failed to remove item");
      }
    });
  }

  return (
    <div className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
      <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
        <img
          src={cartItem?.image || "/placeholder-product.jpg"}
          alt={cartItem?.title || "Product image"}
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            e.target.src = "/placeholder-product.jpg";
          }}
        />
      </div>

      <div className="ml-4 flex-1">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            {cartItem?.title || "Unknown Product"}
          </h3>
          <button
            onClick={() => handleCartItemDelete(cartItem)}
            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
            aria-label="Remove item"
          >
            <Trash size={18} />
          </button>
        </div>

        <p className="text-gray-600 mt-1">
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) ||
            0
          ).toFixed(2)}{" "}
          ETB
        </p>

        <div className="flex items-center mt-3">
          <div className="flex items-center border border-gray-200 rounded-lg">
            <Button
              variant="ghost"
              className="h-8 w-8 rounded-r-none text-gray-600 hover:bg-gray-100"
              size="icon"
              disabled={cartItem?.quantity <= 1}
              onClick={() => handleUpdateQuantity(cartItem, "minus")}
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="px-3 text-gray-800 font-medium">
              {cartItem?.quantity || 1}
            </span>
            <Button
              variant="ghost"
              className="h-8 w-8 rounded-l-none text-gray-600 hover:bg-gray-100"
              size="icon"
              onClick={() => handleUpdateQuantity(cartItem, "plus")}
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="ml-auto">
            <p className="text-lg font-semibold text-gray-900">
              {(
                ((cartItem?.salePrice > 0
                  ? cartItem?.salePrice
                  : cartItem?.price) || 0) * (cartItem?.quantity || 1)
              ).toFixed(2)}{" "}
              ETB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCartItemsContent;
