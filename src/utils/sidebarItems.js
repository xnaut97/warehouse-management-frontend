import {
    LayoutDashboard,
    Users,
    Truck,
    Package,
    Warehouse,
    ArrowDownToLine,
    ArrowUpFromLine,
    Boxes,
    Archive,
    ChartColumn,
    ClipboardCheck,
    FileClock,
    User,
    Box,
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
                label: "Sản phẩm",
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
                label: "Tổng quan báo cáo",
                path: "/reports",
            },
            {
                icon: ArrowDownToLine,
                label: "Báo cáo nhập kho",
                path: "/reports/receipts",
            },
            {
                icon: ArrowUpFromLine,
                label: "Báo cáo xuất kho",
                path: "/reports/issues",
            },
            {
                icon: Archive,
                label: "Báo cáo tồn kho",
                path: "/reports/inventory",
            },
            {
                icon: ClipboardCheck,
                label: "Báo cáo kiểm kê",
                path: "/reports/stocktaking",
            },
            {
                icon: FileClock,
                label: "Nhật ký hệ thống",
                path: "/reports/audit-logs",
            },
        ],
    },
];
