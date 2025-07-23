import { useSidebar } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { useSelector } from "react-redux"

export function SidebarHeader() {
  const { open } = useSidebar()
  // const user = useSelector((state) => state.saleManager.user)

  return (
    <div className="p-4 border-b">
      <div className="flex items-center space-x-3">
        {/* <Avatar className="h-10 w-10">
          <AvatarImage src={user?.avatar?.url} alt={user?.username} />
          <AvatarFallback className="bg-gradient-to-r from-green-600 to-amber-600 text-white">
            {user?.username?.charAt(0)}
          </AvatarFallback>
        </Avatar> */}
        {/* {open && (
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-primary">
              {user?.username || "Quản lý cửa hàng"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {user?.email}
            </p>
          </div>
        )} */}
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-primary">
            {open ? "Quản lý trang bán hàng" : "QL"}
          </h2>
        </div>
      </div>
    </div>
  )
}