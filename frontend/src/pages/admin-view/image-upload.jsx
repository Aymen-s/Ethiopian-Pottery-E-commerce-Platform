import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

function ProductImageUpload({
  imageFile,
  setImageFile,
  //   uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  imageLoadingState,
  isEditMode,
}) {
  const inputRef = useRef(null);
  const [uploadError, setUploadError] = useState(null);

  function handleImageFileChange(e) {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setImageFile(file);
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    if (!imageFile) return;

    const data = new FormData();
    data.append("my_file", imageFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/products/upload-image", // Fixed endpoint
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.success) {
        setUploadedImageUrl(response.data.result.url);
        setImageLoadingState(false);
        setUploadError(null);
        console.log("Image uploaded successfully:", response.data.result.url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError(error.response?.data?.message || "Upload failed");
    }
  }

  useEffect(() => {
    if (imageFile) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`${
              isEditMode ? "cursor-not-allowed" : "cursor-pointer"
            }flex flex-col items-center justify-center h-32 `}
          >
            <UploadCloudIcon className="h-10 w-10 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">
              Drag and drop or click to upload
            </span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 h-8 text-primary mr-2" />
              <p className="text-sm font-medium">{imageFile.name}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
        {uploadError && (
          <p className="text-red-500 text-sm mt-2">{uploadError}</p>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
