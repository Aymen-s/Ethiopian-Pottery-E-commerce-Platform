import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user, isLoading: authLoading } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);

  useEffect(() => {
    console.log("Address - Auth State:", { authLoading, userId: user?._id });
    if (!authLoading && user?._id) {
      dispatch(fetchAllAddresses(user?._id));
    } else if (!authLoading && !user?._id) {
      console.log("User not authenticated, skipping address fetch");
    }
  }, [dispatch, user?._id, authLoading]);

  function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast.error("You can only add up to 3 addresses", {
        description: "Please delete an existing address to add a new one.",
      });

      return;
    }

    currentEditedId !== null
      ? dispatch(
          editaAddress({
            userId: user?._id,
            addressId: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?._id));
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            toast.success("Address updated successfully");
          }
        })
      : dispatch(
          addNewAddress({
            ...formData,
            userId: user?._id,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?._id));
            setFormData(initialAddressFormData);
            toast.success("Address added successfully");
          }
        });
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user?._id, addressId: getCurrentAddress._id })
    );
    dispatch(fetchAllAddresses(user?._id));
    toast.success("Address deleted successfully");
  }

  function handleEditAddress(getCuurentAddress) {
    setCurrentEditedId(getCuurentAddress?._id);
    setFormData({
      ...formData,
      address: getCuurentAddress?.address,
      city: getCuurentAddress?.city,
      phone: getCuurentAddress?.phone,
      pincode: getCuurentAddress?.pincode,
      notes: getCuurentAddress?.notes,
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  }

  if (authLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-40 w-full rounded-lg" />
          ))}
        </div>
        <Card className="border-t">
          <CardHeader className="border-b">
            <CardTitle className="text-lg">
              {currentEditedId !== null ? "Edit Address" : "Add New Address"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Address Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {addressList && addressList.length > 0 ? (
          addressList.map((singleAddressItem) => (
            <AddressCard
              key={singleAddressItem._id}
              selectedId={selectedId}
              handleDeleteAddress={handleDeleteAddress}
              addressInfo={singleAddressItem}
              handleEditAddress={handleEditAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No addresses saved yet</p>
          </div>
        )}
      </div>

      {/* Add/Edit Address Form */}
      <Card className="border-t">
        <CardHeader className="border-b">
          <CardTitle className="text-lg">
            {currentEditedId !== null ? "Edit Address" : "Add New Address"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <CommonForm
            formControls={addressFormControls}
            formData={formData}
            setFormData={setFormData}
            buttonText={
              currentEditedId !== null ? "Update Address" : "Save Address"
            }
            onSubmit={handleManageAddress}
            isBtnDisabled={!isFormValid()}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default Address;
