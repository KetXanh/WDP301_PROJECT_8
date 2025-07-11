import { GoGoal } from "react-icons/go";
import { GrPlan } from "react-icons/gr";
import {
  IoIosStats,
  IoIosSettings,
  IoIosPerson,
  IoIosPersonAdd,
  IoIosEyeOff,
  IoIosLogIn,
  IoIosLogOut,
} from "react-icons/io";
import {
  FaChartBar,
  FaUsersCog,
  FaListAlt,
  FaMoon,
  FaSun,
  FaCartPlus,
  FaBox,
  FaStarHalfAlt,
} from "react-icons/fa";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { MdCategory, MdOutlineCategory, MdSpaceDashboard } from "react-icons/md";

import user01 from "../assets/user01.png";
import user02 from "../assets/user02.png";
import user03 from "../assets/user03.png";

export const links = [
  {
    href: "/admin",
    icon: FaChartBar,
    text: "dashboard",
  },
  {
    href: "/admin/category",
    icon: MdOutlineCategory,
    text: "categories",
  },
  {
    href: "/admin/subcategory",
    icon: MdOutlineCategory,
    text: "subcategories",
  },
  {
    href: "/admin/order",
    icon: FaCartPlus,
    text: "order",
  },
  {
    href: "/admin/rating",
    icon: FaStarHalfAlt,
    text: "Rating",
  },
  {
    href: "/admin/product",
    icon: FaBox,
    text: "products",
  },
  {
    href: "/admin/task",
    icon: FaListAlt,
    text: "task",
  },
  {
    href: "/admin/kpi",
    icon: FaUsersCog,
    text: "kpi",
  },
  {
    href: "/login",
    icon: IoIosLogIn,
    text: "login",
  },
  {
    href: "/register",
    icon: IoIosPersonAdd,
    text: "register",
  },
];


export const empolyeesData = [
  {
    title: "Total Empolyees",
    icon: IoIosPerson,
    count: 200,
    bgColor: "bg-gray-100",
  },
  {
    title: "On Leave",
    icon: IoIosEyeOff,
    count: 15,
    bgColor: "bg-blue-100",
  },
  {
    title: "New Joinee",
    icon: IoIosPersonAdd,
    count: 25,
    bgColor: "bg-yellow-100",
  },
];

export const shortcutLink = [
  {
    title: "Goals",
    icon: GoGoal,
  },
  {
    title: "Plan",
    icon: GrPlan,
  },
  {
    title: "Stats",
    icon: IoIosStats,
  },
  {
    title: "Setting",
    icon: IoIosSettings,
  },
];

export const users = [
  {
    name: "Robert Fox",
    country: "USA",
    role: "Python Developer",
    image: user01,
    bgColor: "bg-yellow-100",
  },
  {
    name: "Jane Doe",
    country: "UK",
    role: "Frontend Developer",
    image: user02,
    bgColor: "bg-blue-100",
  },
  {
    name: "John Smith",
    country: "Canada",
    role: "Backend Developer",
    image: user03,
    bgColor: "bg-gray-100",
  },
  {
    name: "Alice Johnson",
    country: "Australia",
    role: "Full Stack Developer",
    image: user01,
    bgColor: "bg-slate-100",
  },
];

export const events = [
  {
    date: "01 Aug",
    title: "Upcoming Event",
    description: "Lorem ipsum dolor sit amet.",
  },
  {
    date: "15 Sept",
    title: "Annual Conference",
    description: "Join us for our annual conference.",
  },
  {
    date: "20 Sept",
    title: "Networking Meetup",
    description: "Connect with professionals in your field.",
  },
];

export const ROLE = [1, 2, 3, 4]

export const MAX_PRICE = 1000000
