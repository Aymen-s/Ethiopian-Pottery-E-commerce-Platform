import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-[#f8f5f0]">
      {/* Single centered panel */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 sm:p-10 border border-gray-100">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-amber-700 mb-2">
              Ethiopian Pottery Hub
            </h1>
            <p className="text-gray-600">
              Authentic handmade pottery from local artisans
            </p>
          </div>
          <Outlet />
        </div>
        <Toaster position="top-center" />
      </div>
    </div>
  );
};

export default AuthLayout;
