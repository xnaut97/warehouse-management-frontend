import { ArrowDownToLine, ArrowUpFromLine, Archive, ClipboardCheck, FileClock } from "lucide-react";
import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader.jsx";

const reports = [
    {
        title: "Báo cáo nhập kho",
        description: "Theo ngày, theo tháng và theo nhà cung cấp.",
        path: "/reports/receipts",
        icon: ArrowDownToLine
    },
    {
        title: "Báo cáo xuất kho",
        description: "Theo ngày, khách hàng và thành phẩm.",
        path: "/reports/issues",
        icon: ArrowUpFromLine
    },
    {
        title: "Báo cáo tồn kho",
        description: "Tồn hiện tại và lịch sử biến động tồn.",
        path: "/reports/inventory",
        icon: Archive
    },
    {
        title: "Báo cáo kiểm kê",
        description: "Phiếu kiểm kê, chênh lệch và giá trị sai lệch.",
        path: "/reports/stocktaking",
        icon: ClipboardCheck
    },
    {
        title: "Nhật ký hệ thống",
        description: "Lịch sử thao tác và truy vết hệ thống.",
        path: "/reports/audit-logs",
        icon: FileClock
    }
];

function ReportsPage() {
    const navigate = useNavigate();

    return (
        <div>
            <PageHeader
                title="Báo cáo"
                description="Tổng hợp các báo cáo vận hành kho và nhật ký hệ thống."
            />

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {reports.map((report) => {
                    const Icon = report.icon;

                    return (
                        <button
                            key={report.path}
                            type="button"
                            onClick={() => navigate(report.path)}
                            className="rounded-2xl border border-(--color-border) bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="mb-5 inline-flex rounded-xl bg-pink-50 p-3 text-(--color-primary)">
                                <Icon size={24} />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                {report.title}
                            </h2>
                            <p className="mt-2 text-sm text-gray-500">
                                {report.description}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default ReportsPage;
