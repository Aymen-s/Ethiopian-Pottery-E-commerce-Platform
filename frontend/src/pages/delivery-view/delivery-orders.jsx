import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeliveryOrders } from "@/store/shop/order-slice";
import DeliveryLayout from "@/components/delivery-view/layout";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function DeliveryOrdersView() {
  const { deliveryOrders, isLoading } = useSelector((state) => state.shopOrder);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDeliveryOrders());
  }, [dispatch]);

  return (
    <DeliveryLayout title="Delivery Orders">
      <Card>
        <CardHeader>
          <CardTitle>Your Assigned Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && !deliveryOrders?.length ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-6">
              {deliveryOrders && deliveryOrders.length > 0 ? (
                deliveryOrders.map((orderItem) => (
                  <Card key={orderItem._id} className="p-4">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Order ID</p>
                          <p>{orderItem?._id}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Order Date</p>
                          <p>{orderItem?.orderDate.split("T")[0]}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Order Status</p>
                          <Badge
                            className={`py-1 px-3 ${
                              orderItem?.orderStatus === "delivered"
                                ? "bg-green-500"
                                : orderItem?.orderStatus === "disputed"
                                ? "bg-red-600"
                                : orderItem?.orderStatus === "inShipping"
                                ? "bg-blue-500"
                                : orderItem?.orderStatus === "pending"
                                ? "bg-gray-500"
                                : orderItem?.orderStatus === "outForDelivery"
                                ? "bg-purple-500"
                                : "bg-black"
                            }`}
                          >
                            {orderItem?.orderStatus}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Order Price</p>
                          <p>${orderItem?.totalAmount}</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="grid gap-2">
                        <div className="font-medium">Order Details</div>
                        <ul className="grid gap-3">
                          {orderItem?.cartItems &&
                          orderItem?.cartItems.length > 0 ? (
                            orderItem?.cartItems.map((item) => (
                              <li
                                key={item.productId}
                                className="flex items-center justify-between"
                              >
                                <span>Title: {item.title}</span>
                                <span>Quantity: {item.quantity}</span>
                                <span>Price: ${item.price}</span>
                              </li>
                            ))
                          ) : (
                            <p>No items in this order.</p>
                          )}
                        </ul>
                      </div>
                      <Separator />
                      <div className="grid gap-2">
                        <div className="font-medium">Shipping Info</div>
                        <div className="grid gap-0.5 text-muted-foreground">
                          <span>{orderItem?.addressInfo?.address}</span>
                          <span>{orderItem?.addressInfo?.city}</span>
                          <span>{orderItem?.addressInfo?.pincode}</span>
                          <span>{orderItem?.addressInfo?.phone}</span>
                          <span>
                            {orderItem?.addressInfo?.notes || "No notes"}
                          </span>
                        </div>
                      </div>
                      {orderItem?.orderStatus === "disputed" && (
                        <div className="grid gap-2">
                          <div className="font-medium">Dispute Reason</div>
                          <p>{orderItem?.disputeReason || "Not specified"}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-center">No orders assigned to you.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </DeliveryLayout>
  );
}

export default DeliveryOrdersView;
