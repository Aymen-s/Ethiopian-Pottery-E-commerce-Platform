import React from "react";
import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import Footer from "../common/footer";

function ShoppingLayout() {
  return (
    <div className="flex flex-col bg-white min-h-screen overflow-hidden">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-col w-full flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default ShoppingLayout;
