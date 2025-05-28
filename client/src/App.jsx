import { useState } from "react";
import "./App.css";
import { TestComponent } from "./components/TestComponent";
import Sidebar from "./components/admin/Sidebar";
import Header from "./components/admin/Header";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={darkMode ? "dark" : ""}>
      <Header
        toggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
        toggleSidebar={toggleSidebar}
      />
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <main className="p-4">
        <TestComponent />
      </main>
    </div>
  );
}

export default App;
