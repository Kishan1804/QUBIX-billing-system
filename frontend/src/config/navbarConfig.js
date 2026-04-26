import { FileText, LayoutDashboard, Phone, Settings, ShoppingBag, User, Package,Users, Contact,BarChart3,UserCircle } from "lucide-react";

export const navbarConfig = {
    admin: [
        { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { label: "Products", path: "/products", icon: Package },
        { label: "Invoices", path: "/invoices", icon: FileText },
        { label: "Users", path: "/users", icon: Users },
        { label: "Contacts", path: "/manage-contact", icon: Contact },
        { label: "Report", path: "/report", icon: BarChart3 },
        { label: "Profile", path: "/profile", icon: UserCircle }
    ],

    customer: [
        { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { label: "Shop", path: "/products", icon: ShoppingBag },
        { label: "My Invoices", path: "/invoices", icon: FileText },
        { label: "Contact", path: "/contact", icon: Phone },
        { label: "Profile", path: "/profile", icon: Settings }
    ]
};