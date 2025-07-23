import { LogOut } from "lucide-react"
import { SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "../../../components/ui/sidebar"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { logout } from "../../../store/customer/authSlice";

export function SidebarFooterContent() {
    const { open } = useSidebar();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogout = () => {
        dispatch(logout());
        toast.success(t('toast.logout'));
        navigate('/');
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
