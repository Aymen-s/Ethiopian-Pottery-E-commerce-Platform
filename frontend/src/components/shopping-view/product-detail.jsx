import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  function handleRatingChange(getRating) {
    console.log(getRating, "getRating");

    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error(
            `Only ${getQuantity} quantity can be added for this item`
          );

          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Product is added to cart");
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast.success("Review added successfully!");
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  console.log(reviews, "reviews");

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-[90vw] lg:max-w-[80vw] xl:max-w-[70vw] 2xl:max-w-[60vw] w-full p-0 rounded-lg overflow-hidden">
        {/* Product Image - Now with constrained width */}
        <div className="relative bg-gray-100 flex items-center justify-center">
          <div className="w-full h-full max-h-[60vh] lg:max-h-none lg:h-[70vh] flex items-center justify-center p-4">
            <img
              src={productDetails?.image}
              alt={productDetails?.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          {productDetails?.salePrice > 0 && (
            <div className="absolute top-4 left-4 bg-amber-600 text-white px-3 py-1 rounded-md text-sm font-medium">
              {Math.round(
                ((productDetails?.price - productDetails?.salePrice) /
                  productDetails?.price) *
                  100
              )}
              % OFF
            </div>
          )}
        </div>

        {/* Product Details - Improved scrolling and width */}
        <div className="p-6 lg:p-8 max-h-[80vh] overflow-y-auto w-full">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {productDetails?.title}
            </h1>
            <div className="flex items-center gap-2">
              <StarRatingComponent rating={averageReview} />
              <span className="text-sm text-gray-500">
                {averageReview.toFixed(1)} ({reviews?.length || 0} reviews)
              </span>
            </div>
          </div>

          {/* Description with better line clamping */}
          <p className="mt-4 text-gray-700 line-clamp-5">
            {productDetails?.description}
          </p>

          {/* Price section */}
          <div className="mt-6">
            <div className="flex items-center gap-3">
              {productDetails?.salePrice > 0 ? (
                <>
                  <span className="text-3xl font-bold text-amber-700">
                    {productDetails?.salePrice} ETB
                  </span>
                  <span className="text-xl line-through text-gray-400">
                    {productDetails?.price} ETB
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-amber-700">
                  ${productDetails?.price}
                </span>
              )}
            </div>
            {productDetails?.totalStock < 5 &&
              productDetails?.totalStock > 0 && (
                <p className="mt-1 text-sm text-amber-700">
                  Only {productDetails?.totalStock} left in stock!
                </p>
              )}
          </div>

          {/* Add to Cart button */}
          <div className="mt-6">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full" disabled>
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full bg-amber-600 hover:bg-amber-700 h-12 text-lg"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Cart
              </Button>
            )}
          </div>

          {/* Reviews Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>

            {reviews?.length > 0 ? (
              <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2">
                {reviews.map((reviewItem) => (
                  <div key={reviewItem._id} className="flex gap-4">
                    <Avatar className="w-12 h-12 border flex-shrink-0">
                      <AvatarFallback className="bg-amber-100 text-amber-800">
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h4 className="font-medium truncate">
                          {reviewItem?.userName}
                        </h4>
                        <StarRatingComponent
                          rating={reviewItem?.reviewValue}
                          starSize={16}
                        />
                      </div>
                      <p className="text-gray-600 mt-1 break-words">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 py-4 text-center">
                No reviews yet. Be the first to review!
              </p>
            )}

            {/* Review Form */}
            <div className="mt-8 border-t pt-6">
              <h4 className="font-medium mb-4">Write a Review</h4>
              <div className="space-y-4">
                <div>
                  <Label className="block mb-2">Your Rating</Label>
                  <StarRatingComponent
                    rating={rating}
                    handleRatingChange={handleRatingChange}
                    starSize={24}
                  />
                </div>
                <div>
                  <Label className="block mb-2">Your Review</Label>
                  <textarea
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent min-h-[100px]"
                    value={reviewMsg}
                    onChange={(e) => setReviewMsg(e.target.value)}
                    placeholder="Share your honest thoughts about this product..."
                  />
                </div>
                <Button
                  onClick={handleAddReview}
                  disabled={reviewMsg.trim() === "" || rating === 0}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Submit Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
