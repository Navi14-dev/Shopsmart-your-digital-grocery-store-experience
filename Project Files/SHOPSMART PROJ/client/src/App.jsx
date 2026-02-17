import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRedirect from "./components/RoleRedirect";
import UserRoute from "./routes/UserRoute";

import { useAuth } from "./context/AuthContext";


import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/User/Home";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Unauthorized from "./pages/Unauthorized";
import Navbar from "./components/Navbar";
import AdminProducts from "./pages/admin/AdminProducts";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import UserProducts from "./pages/User/UserProducts";
import Cart from "./pages/User/Cart";
import ProductList from "./pages/User/ProductList";
import Checkout from "./pages/User/Checkout";
import Profile from "./pages/User/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import OrderDetails from "./pages/User/OrderDetails";
import Orders from "./pages/User/Orders";
import OrderSuccess from "./pages/User/OrderSuccess";
import OrderTracking from "./pages/User/OrderTracking";
import HomePublic from "./pages/HomePublic";
import AdminHome from "./pages/admin/AdminHome";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";



function App() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/register" element={<Register />} />

        {/* PRIVATE USER */}
        <Route
          path="/user/home"
          element={
            <UserRoute>
              <Home />
            </UserRoute>
          }
        />


        <Route
          path="/"
          element={
            user ? <Home /> : <HomePublic />
          }
        />
        <Route
  path="/checkout"
  element={
    <PrivateRoute>
      <Checkout />
    </PrivateRoute>
  }
/>
<Route
  path="/products"
  element={
    <PrivateRoute>
      <UserProducts />
    </PrivateRoute>
  }
/>

<Route
  path="/cart"
  element={
    <PrivateRoute>
      <Cart />
    </PrivateRoute>
  }
/>
<Route path="/change-password" element={<ChangePassword />} />

<Route path="/profile" element={<Profile />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/orders" element={<Orders />} />
<Route path="/orders/:id" element={<OrderDetails />} />
<Route path="/order-success" element={<OrderSuccess />} />
<Route
  path="/order-tracking"
  element={<OrderTracking />}
/>


        {/* ADMIN ONLY */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminHome />
            </AdminRoute>
          }
        />
         <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

<Route
  path="/admin/dashboard"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>

        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/edit-product/:id"
          element={
            <AdminRoute>
              <EditProduct />
            </AdminRoute>
          }
        />

{/* <Route path="/products" element={<ProductList />} /> */}


      </Routes>
    </>
  );
}

export default App;
