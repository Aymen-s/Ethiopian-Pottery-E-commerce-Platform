import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`transition-all hover:shadow-md ${
        selectedId?._id === addressInfo?._id
          ? "border-2 border-amber-600 ring-2 ring-amber-100"
          : "border-gray-200"
      }`}
    >
      <CardContent className="p-4 space-y-2">
        <div className="space-y-1">
          <h4 className="font-medium text-gray-900">{addressInfo?.address}</h4>
          <p className="text-sm text-gray-600">
            {addressInfo?.city}, {addressInfo?.pincode}
          </p>
          <p className="text-sm text-gray-600">Phone: {addressInfo?.phone}</p>
          {addressInfo?.notes && (
            <p className="text-sm text-gray-500 mt-2">
              <span className="font-medium">Notes:</span> {addressInfo?.notes}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleEditAddress(addressInfo);
          }}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
