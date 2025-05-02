import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader className="border-b pb-4">
        <DialogTitle>Order Details</DialogTitle>
      </DialogHeader>

      <div className="grid gap-6 py-4">
        {/* Order Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Order ID</Label>
            <p>{orderDetails?._id}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">Date</Label>
            <p>{new Date(orderDetails?.orderDate).toLocaleDateString()}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">Status</Label>
            <Badge
              variant={
                orderDetails?.orderStatus === "delivered"
                  ? "success"
                  : orderDetails?.orderStatus === "disputed"
                  ? "destructive"
                  : "default"
              }
            >
              {orderDetails?.orderStatus}
            </Badge>
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">Total</Label>
            <p className="font-medium">{orderDetails?.totalAmount} ETB</p>
          </div>
        </div>

        <Separator />

        {/* Order Items */}
        <div className="space-y-4">
          <h3 className="font-medium">Items</h3>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderDetails?.cartItems?.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell className="text-right">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.price} ETB
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <Separator />

        {/* Shipping Info */}
        <div className="space-y-4">
          <h3 className="font-medium">Shipping Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-muted-foreground">Name</Label>
              <p>{user?.userName}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Phone</Label>
              <p>{orderDetails?.addressInfo?.phone}</p>
            </div>
            <div className="space-y-1 col-span-2">
              <Label className="text-muted-foreground">Address</Label>
              <p>{orderDetails?.addressInfo?.address}</p>
              <p>
                {orderDetails?.addressInfo?.city},{" "}
                {orderDetails?.addressInfo?.pincode}
              </p>
            </div>
            {orderDetails?.addressInfo?.notes && (
              <div className="space-y-1 col-span-2">
                <Label className="text-muted-foreground">Notes</Label>
                <p>{orderDetails?.addressInfo?.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
