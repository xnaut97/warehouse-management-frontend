import {
    LayoutDashboard,
    User,
    Box,
    Warehouse,
    Package,
    ClipboardList,
    ArrowDownToLine,
    ArrowUpFromLine,
    Boxes,
    ClipboardCheck,
    TriangleAlert,
    ChartColumn,
    CircleDollarSign,
    FileChartColumn, ListChecks, ArrowDownUp,
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
            // {
            //     icon: User,
            //     label: "Người dùng",
            //     path: "/users",
            // },
            // {
            //     icon: Truck,
            //     label: "Nhà cung cấp",
            //     path: "/suppliers",
            // },
            {
                icon: Box,
                label: "Nguyên vật liệu",
                path: "/materials",
            },
            // {
            //     icon: Warehouse,
            //     label: "Kho",
            //     path: "/warehouses",
            // },
            {
                icon: Package,
                label: "Sản phẩm",
                path: "/products",
            },
            {
                icon: ClipboardList,
                label: "Định mức nguyên vật liệu",
                path: "/materials-consumptions",
            },
        ],
    },

    {
        title: "VẬN HÀNH",
        items: [
            {
                icon: ArrowDownUp,
                label: "Phiếu nhập xuất",
                path: "/receipts-issues",
            },

            {
                icon: Boxes,
                label: "Tồn kho",
                path: "/inventories",
            },
            {
                icon: ListChecks,
                label: "Kiểm kê",
                path: "/stocktaking",
            },

        ],
    },

    {
        title: "TÁC NGHIỆP",
        items: [
            {
                icon: FileChartColumn,
                label: "Báo cáo tác nghiệp",
                path: "/operations",
            },
        ],
    },

    {
        title: "HỆ THỐNG",
        items: [
            {
                icon: TriangleAlert,
                label: "Trung tâm cảnh báo",
                path: "/alerts",
            },
        ],
    },

    {
        title: "BÁO CÁO",
        items: [
            {
                icon: CircleDollarSign,
                label: "Báo cáo giá trị vốn lưu động tồn kho",
                path: "/reports/inventory-value",
            },
            {
                icon: ChartColumn,
                label: "Báo cáo hiệu quả vận hành & định mức",
                path: "/reports/operations",
            },
            {
                icon: ClipboardCheck,
                label: "Báo cáo kiểm kê & tỉ lệ chính xác kho",
                path: "/reports/stocktaking",
            },
        ],
    },
];
