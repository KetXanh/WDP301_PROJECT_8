import { useState } from "react";
import "./App.css";
// import { TestComponent } from "./components/TestComponent";
// import Sidebar from "./components/admin/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Customers/Login";
import { Routes, Route, Outlet } from "react-router-dom";
import Register from "./pages/Customers/Register";
import HomePage from "./pages/Customers/HomePage";
import NotFound from "./pages/NotFound";
import Footer from "./components/customer/Footer";
import Header from "./components/customer/Header";
import Products from "./pages/Customers/Product";
import Verify from "./pages/Customers/Verify";
import ForgotPassword from "./pages/Customers/ForgotPassword";
import ForgotOtp from "./pages/Customers/ForgotOtp";
import ResetPassword from "./pages/Customers/ResetPassword";
import Profile from "./pages/Customers/Profile";
import { useSelector } from "react-redux";


const Layout = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  </div>
);

function App() {
  const accessToken = useSelector((state) => state.customer.accessToken);
  const [darkMode, setDarkMode] = useState(false);
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // const toggleDarkMode = () => setDarkMode(!darkMode);
  // const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={darkMode ? "dark" : ""}>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<HomePage />} />

          {!accessToken ?
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify/:email" element={<Verify />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/otp" element={<ForgotOtp />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </>
            :
            <>
              <Route path="/profile" element={<Profile />} />
              <Route path="/products" element={<Products />} />
            </>
          }

        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
