import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg overflow-hidden">
        <div className="bg-green-100 p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-200">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
        </div>
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Payment Successful!
          </CardTitle>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
            onClick={() => navigate("/shop/account")}
          >
            View Your Orders
          </Button>
          <Button
            variant="outline"
            className="w-full mt-4 py-6 text-lg"
            onClick={() => navigate("/shop/home")}
          >
            Continue Shopping
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;
