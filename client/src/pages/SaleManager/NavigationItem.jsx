import { NavLink } from "react-router-dom"
import { SidebarMenuButton, SidebarMenuItem } from "../../components/ui/sidebar"
import { useSidebar } from "../../components/ui/sidebar"
import PropTypes from 'prop-types'


export function NavigationItem({ title, url, icon: Icon }) {
  const { open } = useSidebar()

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <NavLink 
          to={url} 
          end 
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-accent hover:text-accent-foreground"
            }`
          }
        >
          {Icon && <Icon className="h-4 w-4" />}
          {open && <span className="text-sm font-medium">{title}</span>}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

NavigationItem.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired
}
