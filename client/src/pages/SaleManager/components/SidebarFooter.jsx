import { LogOut } from "lucide-react"
import { SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "../../../components/ui/sidebar"

export function SidebarFooterContent() {
    const { open } = useSidebar()

    const handleLogout = () => {
        console.log("Logout clicked")
    }

    return (
        <SidebarFooter className="border-t p-4">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout} className="w-full">
                        <LogOut className="h-4 w-4" />
                        {open && <span className="text-sm font-medium">Đăng xuất</span>}
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    )
}
