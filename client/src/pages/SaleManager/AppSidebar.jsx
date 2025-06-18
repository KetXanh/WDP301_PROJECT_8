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
  { title: "Thống kê", url: "/", icon: ChartBar },
  { title: "Quản lý Task", url: "/tasks", icon: ListCheck },
  { title: "Quản lý KPI", url: "/kpi", icon: ChartBar },
  { title: "Quản lý Discount", url: "/discount", icon: Percent },
  { title: "Tạo giảm giá sản phẩm", url: "/create-discount", icon: Discount },
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