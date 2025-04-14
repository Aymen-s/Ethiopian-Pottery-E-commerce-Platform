import React from "react";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems }) {
  console.log(cartItems, "cartItems");
  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0
          ? cartItems.map((item) => <UserCartItemsContent cartItem={item} />)
          : null}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between p-4">
          <span className="font-bold">Total</span>
          <span className="font-bold">$1000</span>
        </div>
      </div>
      <Button className="w-[90%] mt-6 mx-auto">Checkout</Button>
    </SheetContent>
  );
}

export default UserCartWrapper;
