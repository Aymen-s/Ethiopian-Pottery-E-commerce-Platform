import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  assignDeliveryGuyAndUpdateStatus,
  fetchDeliveryGuys,
} from "@/store/admin/order-slice";
import { toast } from "sonner";

const initialFormData = {
  status: "",
  assignedDeliveryGuy: "",
};

const statusOptions = [
  { id: "pending", label: "Pending" },
  { id: "inShipping", label: "In Shipping" },
  { id: "outForDelivery", label: "Out for Delivery" },
  { id: "delivered", label: "Delivered" },
  { id: "disputed", label: "Disputed" },
];

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user, isLoading, deliveryGuys } = useSelector((state) => ({
    user: state.auth.user,
    isLoading: state.adminOrder.isLoading,
    deliveryGuys: state.adminOrder.deliveryGuys,
  }));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDeliveryGuys());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails) {
      setFormData({
        status: orderDetails.orderStatus || "",
        assignedDeliveryGuy: orderDetails.assignedDeliveryGuy?._id || "",
      });
    }
  }, [orderDetails]);

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status, assignedDeliveryGuy } = formData;

    if (!status) {
      toast.error("Please select an order status");
      return;
    }

    dispatch(
      assignDeliveryGuyAndUpdateStatus({
        id: orderDetails?._id,
        assignedDeliveryGuy,
        orderStatus: status,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Order Updated", {
          description: data?.payload?.message,
        });
      } else {
        toast.error("Order Update Failed", {
          description:
            data?.payload?.message ||
            "An error occurred while updating the order",
        });
      }
    });
  }

  const deliveryGuyOptions = deliveryGuys.map((dg) => ({
    id: dg._id,
    label: dg.userName,
  }));

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>${orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Method</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === "delivered"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "disputed"
                    ? "bg-red-600"
                    : orderDetails?.orderStatus === "inShipping"
                    ? "bg-blue-500"
                    : orderDetails?.orderStatus === "pending"
                    ? "bg-gray-500"
                    : orderDetails?.orderStatus === "outForDelivery"
                    ? "bg-purple-500"
                    : "bg-black"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Assigned Delivery Guy</p>
            <Label>
              {orderDetails?.assignedDeliveryGuy
                ? orderDetails.assignedDeliveryGuy.userName
                : "Not Assigned"}
            </Label>
          </div>
          {orderDetails?.orderStatus === "disputed" && (
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Dispute Reason</p>
              <Label>{orderDetails?.disputeReason || "Not specified"}</Label>
            </div>
          )}
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item) => (
                    <li
                      key={item.productId}
                      className="flex items-center justify-between"
                    >
                      <span>Title: {item.title}</span>
                      <span>Quantity: {item.quantity}</span>
                      <span>Price: ${item.price}</span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user.userName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>

        <div>
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: statusOptions,
              },
              {
                label: "Assign Delivery Guy",
                name: "assignedDeliveryGuy",
                componentType: "select",
                options: deliveryGuyOptions,
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Update Order"}
            onSubmit={handleUpdateStatus}
            isBtnDisabled={isLoading}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
