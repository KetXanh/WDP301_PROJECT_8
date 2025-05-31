import { useState } from "react";
import "./App.css";
// import { TestComponent } from "./components/TestComponent";
// import Sidebar from "./components/admin/Sidebar";
import Login from "./pages/Customers/Login";
import { Routes, Route, Outlet } from "react-router-dom";
import Register from "./pages/Customers/Register";
import HomePage from "./pages/Customers/HomePage";
import NotFound from "./pages/NotFound";
import Footer from "./components/customer/Footer";
import Header from "./components/customer/Header";
import Products from "./pages/Customers/Product";


const Layout = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  const [darkMode, setDarkMode] = useState(false);
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // const toggleDarkMode = () => setDarkMode(!darkMode);
  // const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={darkMode ? "dark" : ""}>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product" element={<Products />} />

        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
