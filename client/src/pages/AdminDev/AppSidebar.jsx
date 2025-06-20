import { ChartBar, ListCheck, Percent, Percent as Discount } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { NavigationItem } from "./NavigationItem"
import { SidebarHeader } from "./SidebarHeader"
import { SidebarFooterContent } from "./SidebarFooterContent"

const navigationItems = [
  { title: "Tổng quan", url: "/", icon: ChartBar },
  { title: "Thống kê", url: "/statistics", icon: ChartBar },
  { title: "Thay đổi vai trò người dùng", url: "/changerole", icon: ListCheck },
  { title: "Quản lý người dùng", url: "/banuser", icon: ChartBar },
  { title: "Quản lý sản phẩm", url: "/product", icon: Percent },

]

export function AppSidebar() {
  return (
    <Sidebar className="border-r">
      <SidebarHeader />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Điều hướng</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <NavigationItem 
                  key={item.title}
                  title={item.title}
                  url={item.url}
                  icon={item.icon}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooterContent />
    </Sidebar>
  )
}