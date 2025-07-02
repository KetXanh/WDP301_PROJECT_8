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

//Sale Manager Pages
import AdminDevLayout from "./pages/AdminDev/AdminDevLayout";
import DashboardAdminDev from "./pages/AdminDev/Dashboard";
import StatisticsAdminDev from "./pages/AdminDev/Statistics";
import AccountManagement from "./pages/AdminDev/AccountManagement";
import ProductManagement from "./pages/AdminDev/ProductManagement";


// Customer Layout
const CustomerLayout = () => (
  <div className="min-h-screen flex flex-col">
    <HeaderCustomer />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <ToastContainer position="top-right" autoClose={5000} theme="light" />
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
        className={`flex-1 p-4 pt-20 transition-all duration-300 ${
          isSidebarOpen ? "md:ml-40" : "md:ml-0"
        }`}
      >
        <Outlet />
      </main>
    </div>
  </div>
);

function App() {
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
          <Route path="/product" element={<Products />} />
          <Route path="/otp" element={<ForgotOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
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
        </Route>

          {/* Admin Dev Routes */}
        <Route path="/admin-dev" element={<AdminDevLayout/>}>
          <Route index element={<DashboardAdminDev/>}/>
          <Route path="stats" element={<StatisticsAdminDev/>}/>
          <Route path="accmanage" element={<AccountManagement/>}/>
          <Route path="productmanagement" element={<ProductManagement/>}/>
        </Route>
        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
