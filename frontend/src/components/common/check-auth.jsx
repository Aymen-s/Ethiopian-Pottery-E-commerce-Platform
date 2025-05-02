import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  console.log(location.pathname, isAuthenticated, user?.role);

  // Handle root route
  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    } else {
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else if (user?.role === "delivery-guy") {
        return <Navigate to="/delivery" />;
      } else {
        return <Navigate to="/shop/home" />;
      }
    }
  }

  // Redirect unauthenticated users to login, unless they're on login/register pages
  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
  ) {
    return <Navigate to="/auth/login" />;
  }

  // Redirect authenticated users away from login/register pages
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else if (user?.role === "delivery-guy") {
      return <Navigate to="/delivery" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  // Restrict /admin routes to admins only
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("/admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  // Restrict /delivery routes to delivery guys only
  if (
    isAuthenticated &&
    user?.role !== "delivery-guy" &&
    location.pathname.includes("/delivery")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  // Redirect admins away from /shop and /delivery routes
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    (location.pathname.includes("/shop") ||
      location.pathname.includes("/delivery"))
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  // Redirect delivery guys away from /shop routes
  if (
    isAuthenticated &&
    user?.role === "delivery-guy" &&
    location.pathname.includes("/shop")
  ) {
    return <Navigate to="/delivery" />;
  }

  // Redirect regular users away from /delivery routes
  if (
    isAuthenticated &&
    user?.role === "user" &&
    location.pathname.includes("/delivery")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  return <>{children}</>;
}

export default CheckAuth;
