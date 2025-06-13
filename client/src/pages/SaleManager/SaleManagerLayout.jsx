import { Outlet } from "react-router-dom"
import { Sidebar } from "../../components/ui/sidebar"
import { SidebarHeader } from "./components/SidebarHeader"
import { SidebarFooterContent } from "./components/SidebarFooter"
import { NavigationItem } from "./NavigationItem"
import {
  BarChart3,
  ClipboardList,
  Users,
  Percent,
  FileText,
  LayoutDashboard,
  MessageSquare
} from "lucide-react"

export default function SaleManagerLayout() {
  const navigationItems = [
    {
      title: "Tổng quan",
      url: "/sale-manager",
      icon: LayoutDashboard
    },
    {
      title: "Thống kê",
      url: "/sale-manager/statistics",
      icon: BarChart3
    },
    {
      title: "Quản lý task",
      url: "/sale-manager/task",
      icon: ClipboardList
    },
    {
      title: "KPI nhân viên",
      url: "/sale-manager/kpi",
      icon: Users
    },
    {
      title: "Khuyến mãi",
      url: "/sale-manager/discount",
      icon: Percent
    },
    {
      title: "Quản lý order",
      url: "/sale-manager/order",
      icon: FileText
    },
    {
      title: "Chat",
      url: "/sale-manager/chat",
      icon: MessageSquare
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