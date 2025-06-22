import { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Customer Pages
import Login from "./pages/Customers/Login";
import Register from "./pages/Customers/Register";
import HomePage from "./pages/Customers/HomePage";
import NotFound from "./pages/NotFound";
import Footer from "./components/customer/Footer";
import HeaderCustomer from "./components/customer/Header";
import Products from "./pages/Customers/Product";
import Verify from "./pages/Customers/Verify";
import ForgotPassword from "./pages/Customers/ForgotPassword";
import ForgotOtp from "./pages/Customers/ForgotOtp";
import ResetPassword from "./pages/Customers/ResetPassword";
import Profile from "./pages/Customers/Profile";
import { useSelector } from "react-redux";

// Admin Pages
import Sidebar from "./components/admin/Sidebar";
import HeaderAdmin from "./components/admin/Header";
import Product from "./pages/admin/Product";
import Order from "./pages/admin/Order";
import Category from "./pages/admin/Category";
import Dashboard from "./pages/admin/DashBoard";
import SubCategory from "./pages/admin/SubCategory";
import ProductDetail from "./pages/Customers/ProductDetail";
import ProtectedRoute from "./components/protectedRouter/ProtectedRoute";
import { Car } from "lucide-react";
import Cart from "./pages/Customers/Cart";
import Checkout from "./pages/Customers/Checkout";

// Customer Layout
const CustomerLayout = () => (
  <div className="min-h-screen flex flex-col">
    <HeaderCustomer />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />

  </div>
);

// Admin Layout
const AdminLayout = ({
  toggleSidebar,
  isSidebarOpen,
  toggleDarkMode,
  darkMode,
}) => (
  <div className={darkMode ? "dark" : ""}>
    <HeaderAdmin
      toggleDarkMode={toggleDarkMode}
      darkMode={darkMode}
      toggleSidebar={toggleSidebar}
    />
    <div className="flex">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <main
        className={`flex-1 p-4 pt-20 transition-all duration-300 ${isSidebarOpen ? "md:ml-40" : "md:ml-0"
          }`}
      >
        <Outlet />
      </main>
    </div>
  </div>
);

function App() {
  const accessToken = useSelector((state) => state.customer.accessToken);
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);


  return (
    <div className={darkMode ? "dark" : ""}>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify/:email" element={<Verify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp" element={<ForgotOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          {accessToken &&
            <>
              <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
              <Route path="/checkout" element={<Checkout />} />
            </>
          }

        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminLayout
              toggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
              toggleDarkMode={toggleDarkMode}
              darkMode={darkMode}
            />
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="product" element={<Product />} />
          <Route path="order" element={<Order />} />
          <Route path="subcategory" element={<SubCategory />} />
          <Route path="category" element={<Category />} />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} theme="light" />
    </div>
  );
}

export default App;
