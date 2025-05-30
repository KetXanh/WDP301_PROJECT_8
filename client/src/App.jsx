import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Sidebar from "./components/admin/Sidebar";
import Header from "./components/admin/Header";
import Product from "./pages/admin/Product";
import Order from "./pages/admin/Order";
import User from "./pages/admin/User";
import Category from "./pages/admin/Category";
import Dashboard from "./pages/admin/DashBoard";



function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={darkMode ? "dark" : ""}>
      <Router>
        <Header
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
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/product" element={<Product />} />
              <Route path="/order" element={<Order />} />
              <Route path="/user" element={<User />} />
              <Route path="/category" element={<Category />} />
              {/* <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} /> */}
            </Routes>
          </main>
        </div>
      </Router>
    </div>
  );
}

export default App;
