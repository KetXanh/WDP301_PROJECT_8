import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminSidebar from "./components/admin/AdminSidebar";
import AdminHeader from "./components/admin/AdminHeader";
import Dashboard from "./pages/admin/Dashboard";



function App() {
  return (
    <Router>
      <AdminSidebar></AdminSidebar>
      <div className="ml-64">
        <AdminHeader></AdminHeader>
        <Routes>
          <Route path="/admin" element={<Dashboard></Dashboard>} />
          {/* Thêm các route khác tại đây */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
