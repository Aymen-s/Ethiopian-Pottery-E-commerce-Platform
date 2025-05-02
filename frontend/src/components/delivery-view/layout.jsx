import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { toast } from "sonner";

function DeliveryLayout({ children, title }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleLogout() {
    const response = await dispatch(logoutUser());
    if (response?.payload?.success) {
      toast.success("Logged out successfully");
      navigate("/auth/login");
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <nav className="flex items-center gap-4">
          <Link to="/delivery" className="text-lg font-semibold">
            Delivery Dashboard
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        {title && (
          <div className="border-b pb-2">
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}

export default DeliveryLayout;
