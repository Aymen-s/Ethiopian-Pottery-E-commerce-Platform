import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  confirmDelivery,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { SearchIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openDisputeDialog, setOpenDisputeDialog] = useState(null);
  const [disputeReason, setDisputeReason] = useState("");
  const { user, isLoading: authLoading } = useSelector((state) => state.auth);
  const { orderList, orderDetails, isLoading } = useSelector(
    (state) => state.shopOrder
  );
  const dispatch = useDispatch();
  console.log("ShoppingOrders - Order List:", orderList);

  useEffect(() => {
    console.log("ShoppingOrders - Auth State:", {
      authLoading,
      userId: user?._id,
    });
    if (!authLoading && user?._id) {
      dispatch(getAllOrdersByUserId(user?._id));
    } else if (!authLoading && !user?._id) {
      console.log("User not authenticated, skipping order fetch");
    }
  }, [dispatch, user?._id, authLoading]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  useEffect(() => {
    const outForDeliveryOrders = orderList.filter(
      (order) => order.orderStatus === "outForDelivery"
    );
    if (outForDeliveryOrders.length > 0) {
      outForDeliveryOrders.forEach((order) => {
        toast.info("Action Required", {
          description: `Order ${order._id} is out for delivery. Please confirm receipt or dispute the delivery.`,
        });
      });
    }
  }, [orderList]);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  function handleConfirmDelivery(orderId, confirmed) {
    if (!confirmed) {
      setOpenDisputeDialog(orderId);
      return;
    }

    dispatch(
      confirmDelivery({ id: orderId, confirmed, disputeReason: null })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getAllOrdersByUserId(user?._id));
        toast.success("Delivery Confirmed", {
          description: "The order has been marked as delivered.",
        });
      } else {
        toast.error("Failed to Confirm Delivery", {
          description: data?.payload?.message || "An error occurred",
        });
      }
    });
  }

  function handleDisputeDelivery(orderId) {
    if (!disputeReason.trim()) {
      toast.error("Please provide a reason for disputing the delivery");
      return;
    }

    dispatch(
      confirmDelivery({ id: orderId, confirmed: false, disputeReason })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getAllOrdersByUserId(user?._id));
        setOpenDisputeDialog(null);
        setDisputeReason("");
        toast.success("Delivery Disputed", {
          description: data?.payload?.message,
        });
      } else {
        toast.error("Failed to Dispute Delivery", {
          description: data?.payload?.message || "An error occurred",
        });
      }
    });
  }

  if (authLoading) {
    return (
      <div className="space-y-6">
        <div className="overflow-hidden rounded-lg border shadow-sm">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[180px]">Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16 ml-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-32" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-lg border shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[180px]">Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0 ? (
              orderList.map((orderItem) => (
                <TableRow key={orderItem._id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    #{orderItem._id.slice(-6).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    {new Date(orderItem.orderDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        orderItem.orderStatus === "delivered"
                          ? "success"
                          : orderItem.orderStatus === "disputed"
                          ? "destructive"
                          : orderItem.orderStatus === "outForDelivery"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {orderItem.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {orderItem.totalAmount} ETB
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFetchOrderDetails(orderItem._id)}
                          disabled={isLoading}
                        >
                          View
                        </Button>
                      </DialogTrigger>
                      <ShoppingOrderDetailsView orderDetails={orderDetails} />
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    {orderItem.orderStatus === "outForDelivery" && (
                      <div className="flex gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            handleConfirmDelivery(orderItem._id, true)
                          }
                        >
                          Confirm
                        </Button>
                        <Dialog
                          open={openDisputeDialog === orderItem._id}
                          onOpenChange={(open) => {
                            if (!open) {
                              setOpenDisputeDialog(null);
                              setDisputeReason("");
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleConfirmDelivery(orderItem._id, false)
                              }
                            >
                              Dispute
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Dispute Delivery</DialogTitle>
                              <DialogDescription>
                                Please explain why you're disputing this
                                delivery
                              </DialogDescription>
                            </DialogHeader>
                            <Input
                              value={disputeReason}
                              onChange={(e) => setDisputeReason(e.target.value)}
                              placeholder="Reason for dispute..."
                            />
                            <DialogFooter>
                              <Button
                                variant="destructive"
                                onClick={() =>
                                  handleDisputeDelivery(orderItem._id)
                                }
                              >
                                Submit Dispute
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center py-8">
                    <SearchIcon className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">No orders found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ShoppingOrders;
