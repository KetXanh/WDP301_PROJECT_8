import { Outlet } from "react-router-dom"
import { Sidebar } from "../../components/ui/sidebar"
import { SidebarHeader } from "./components/SidebarHeader"
import { SidebarFooterContent } from "./components/SidebarFooter"
import { NavigationItem } from "./NavigationItem"
import {
  BarChart3,
  ClipboardList,
  Settings,
  LayoutDashboard
} from "lucide-react"

export default function AdminDevLayout() {
  const navigationItems = [
    {
      title: "Tổng quan",
      url: "/admin-dev",
      icon: LayoutDashboard
    },
    {
      title: "Thống kê",
      url: "/admin-dev/stats",
      icon: BarChart3
    },
    {
      title: "Quản lí tài khoản người dùng",
      url: "/admin-dev/accmanage",
      icon: ClipboardList
    },
    {
      title: "Quản lý sản phẩm",
      url: "/admin-dev/productmanagement",
      icon: ClipboardList
    },
        {
      title: "Quản lý blog",
      url: "/admin-dev/blogmanagement",
      icon: ClipboardList
    }
  ]

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar>
        <SidebarHeader />
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.url}
                title={item.title}
                url={item.url}
                icon={item.icon}
              />
            ))}
          </nav>
        </div>
        <SidebarFooterContent />
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
} 