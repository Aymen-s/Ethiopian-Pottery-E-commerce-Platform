import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import React, { useState } from "react";
import ProductImageUpload from "./image-upload";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  price: "",
  brand: "",
  salePrice: "",
  totalStock: "",
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    const submitData = {
      ...formData,
      image: uploadedImageUrl,
    };
    console.log("Form submitted with:", submitData);
  }

  return (
    <>
      <div className="mb-5 flex justify-end w-full">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4"></div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => setOpenCreateProductsDialog(false)}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Add New Product</SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
          />
          <div className="py-6 px-4">
            <CommonForm
              formData={formData}
              setFormData={setFormData}
              formControls={addProductFormElements}
              buttonText="Add"
              onSubmit={onSubmit}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default AdminProducts;
