import { useNavigate } from "react-router-dom";
import {
    ArrowDownToLine,
    ArrowUpFromLine,
    ClipboardCheck,
    Search
} from "lucide-react";

function QuickActions() {

    const navigate = useNavigate();

    const actions = [
        {
            label: "Lập Phiếu Nhập Kho",
            icon: <ArrowDownToLine size={20} />,
            path: "/receipts",
            color: "text-emerald-600",
            bg: "bg-emerald-50 hover:bg-emerald-100",
        },
        {
            label: "Lập Phiếu Xuất Kho",
            icon: <ArrowUpFromLine size={20} />,
            path: "/issues",
            color: "text-orange-600",
            bg: "bg-orange-50 hover:bg-orange-100",
        },
        {
            label: "Khởi Tạo Kiểm Kê",
            icon: <ClipboardCheck size={20} />,
            path: "/stocktaking",
            color: "text-pink-600",
            bg: "bg-pink-50 hover:bg-pink-100",
        },
        {
            label: "Tra Cứu Tồn Kho",
            icon: <Search size={20} />,
            path: "/inventories",
            color: "text-sky-600",
            bg: "bg-sky-50 hover:bg-sky-100",
        },
    ];

    const handleClick = (path) => {
        if (path) {
            navigate(path);
        } else {
            // TODO: Navigate to stocktaking page when available
        }
    };

    return (
        <section>
            <div className="mb-5 space-y-1">
                <h2 className="text-2xl font-bold text-gray-800">
                    Thao tác nhanh
                </h2>
                <p className="text-md text-gray-500">
                    Truy cập nhanh các nghiệp vụ kho thường dùng.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {actions.map((action) => (
                    <button
                        key={action.label}
                        onClick={() => handleClick(action.path)}
                        disabled={!action.path}
                        className={`flex items-center gap-3 rounded-2xl border border-(--color-border) p-5 text-left font-medium transition-all duration-200 ${action.bg} ${
                            action.path
                                ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md"
                                : "cursor-not-allowed opacity-60"
                        }`}
                    >
                        <div className={`rounded-xl bg-white p-3 shadow-sm ${action.color}`}>
                            {action.icon}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                            {action.label}
                        </span>
                    </button>
                ))}
            </div>
        </section>
    );

}

export default QuickActions;
