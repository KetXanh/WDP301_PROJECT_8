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
import DashboardAdmin from "./pages/admin/DashBoard";
import SubCategory from "./pages/admin/SubCategory";
import Task from "./pages/admin/Task";

//Sale Manager Pages
import SaleManagerLayout from "./pages/SaleManager/SaleManagerLayout";
import Dashboard from "./pages/SaleManager/Dashboard";
import Statistics from "./pages/SaleManager/Statistics";
import ManagerTask from "./pages/SaleManager/ManagerTask";
import ManagerKPI from "./pages/SaleManager/ManagerKPI";
import ManagerDiscount from "./pages/SaleManager/ManagerDiscount";
import Chat from "./pages/SaleManager/components/Chat";
import ManagerOrder from "./pages/SaleManager/ManagerOrder";
import SaleManagerProfile from "./pages/SaleManager/Profile";

//Sale Staff Pages
import SaleStaffLayout from "./pages/SaleStaff/SaleStaffLayout";
import SaleStaffDashboard from "./pages/SaleStaff/Dashboard";
import SaleStaffStatistics from "./pages/SaleStaff/Statistics";
import SaleStaffKPI from "./pages/SaleStaff/KPI";
import SaleStaffOrders from "./pages/SaleStaff/Orders";
import SaleStaffTasks from "./pages/SaleStaff/Tasks";
import SaleStaffChat from "./pages/SaleStaff/Chat";
import SaleStaffProfile from "./pages/SaleStaff/Profile";

import ProductDetail from "./pages/Customers/ProductDetail";
import ProtectedRoute from "./components/protectedRouter/ProtectedRoute";
import { Car } from "lucide-react";
import Cart from "./pages/Customers/Cart";
//Sale Manager Pages
import AdminDevLayout from "./pages/AdminDev/AdminDevLayout";


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
          <Route path="/profile" element={<Profile />} />
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
          <Route index element={<DashboardAdmin />} />
          <Route path="product" element={<Product />} />
          <Route path="order" element={<Order />} />
          <Route path="subcategory" element={<SubCategory />} />
          <Route path="category" element={<Category />} />
          <Route path="task" element={<Task />} />
        </Route>

        {/* Sale Manager Routes */}
        <Route path="/sale-manager" element={<SaleManagerLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="task" element={<ManagerTask />} />
          <Route path="kpi" element={<ManagerKPI />} />
          <Route path="discount" element={<ManagerDiscount />} />
          <Route path="chat" element={<Chat />} />
          <Route path="order" element={<ManagerOrder />} />
          <Route path="profile" element={<SaleManagerProfile />} />
        </Route>

        {/* Sale Staff Routes */}
        <Route path="/sale-staff" element={<SaleStaffLayout />}>
          <Route index element={<SaleStaffDashboard />} />
          <Route path="statistics" element={<SaleStaffStatistics />} />
          <Route path="kpi" element={<SaleStaffKPI />} />
          <Route path="orders" element={<SaleStaffOrders />} />
          <Route path="tasks" element={<SaleStaffTasks />} />
          <Route path="chat" element={<SaleStaffChat />} />
          <Route path="profile" element={<SaleStaffProfile />} />
        </Route>

          {/* Admin Dev Routes */}
        <Route path="/admin-dev" element={<AdminDevLayout/>}>
            
        </Route>
        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} theme="light" />
    </div>
  );
}

export default App;
