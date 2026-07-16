import {
    LayoutDashboard,
    Users,
    Truck,
    Package,
    Warehouse,
    ArrowDownToLine,
    ArrowUpFromLine,
    Boxes,
    ChartColumn,
    Settings, User, Box,
} from "lucide-react";

export const sidebarItems = [
    {
        title: "CHUNG",
        items: [
            {
                icon: LayoutDashboard,
                label: "Trang chủ",
                path: "/dashboard",
            },
        ],
    },

    {
        title: "QUẢN LÝ",
        items: [
            {
                icon: User,
                label: "Người dùng",
                path: "/users",
            },
            {
                icon: Truck,
                label: "Nhà cung cấp",
                path: "/suppliers",
            },
            {
                icon: Box,
                label: "Nguyên vật liệu",
                path: "/materials",
            },
            {
                icon: Users,
                label: "Khách hàng",
                path: "/customers",
            },
            {
                icon: Warehouse,
                label: "Kho",
                path: "/warehouses",
            },
            {
                icon: Package,
                label: "Thành phẩm",
                path: "/products",
            },
        ],
    },

    {
        title: "VẬN HÀNH",
        items: [
            {
                icon: ArrowDownToLine,
                label: "Phiếu nhập kho",
                path: "/receipts",
            },
            {
                icon: ArrowUpFromLine,
                label: "Phiếu xuất kho",
                path: "/issues",
            },
            {
                icon: Boxes,
                label: "Tồn kho",
                path: "/inventories",
            },
        ],
    },

    {
        title: "BÁO CÁO",
        items: [
            {
                icon: ChartColumn,
                label: "Báo cáo",
                path: "/reports",
            },
        ],
    },

    {
        title: "CÀI ĐẶT",
        items: [
            {
                icon: Settings,
                label: "Cài đặt",
                path: "/settings",
            },
        ],
    },
];
