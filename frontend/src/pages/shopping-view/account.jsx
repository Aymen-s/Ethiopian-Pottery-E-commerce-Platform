import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";

function ShoppingAccount() {
  return (
    <div className="flex flex-col">
      {/* Hero Banner */}
      <div className="relative h-[250px] w-full bg-gradient-to-r from-amber-700 to-amber-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">My Account</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <Tabs defaultValue="orders">
            <TabsList className="w-full bg-gray-50 px-6 py-4">
              <TabsTrigger
                value="orders"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2"
              >
                My Orders
              </TabsTrigger>
              <TabsTrigger
                value="address"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2"
              >
                Address Book
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="orders">
                <ShoppingOrders />
              </TabsContent>
              <TabsContent value="address">
                <Address />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;
