import IssueStatusBadge from "../issues/IssueStatusBadge.jsx";
import { formatCurrency, formatDate } from "./reportUtils.js";

function IssueReportTable({ issues = [] }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-(--color-border) bg-white shadow-sm">
            <table className="w-full">
                <thead className="border-b border-pink-100">
                <tr>
                    <th className="px-6 py-4 text-left">Mã phiếu</th>
                    <th className="px-6 py-4 text-left">Ngày xuất</th>
                    <th className="px-6 py-4 text-left">Khách hàng</th>
                    <th className="px-6 py-4 text-left">Kho</th>
                    <th className="px-6 py-4 text-left">Tổng tiền</th>
                    <th className="px-6 py-4 text-center">Trạng thái</th>
                </tr>
                </thead>
                <tbody>
                {issues.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                            Không có dữ liệu báo cáo xuất kho
                        </td>
                    </tr>
                ) : issues.map((issue) => (
                    <tr key={issue.id} className="border-b border-pink-100 transition hover:bg-pink-50">
                        <td className="px-6 py-4 text-sm text-slate-700">{issue.issueNo}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{formatDate(issue.issueDate)}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{issue.customer}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{issue.warehouse}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-700">{formatCurrency(issue.totalAmount)}</td>
                        <td className="px-6 py-4 text-center">
                            <IssueStatusBadge status={issue.status} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default IssueReportTable;
