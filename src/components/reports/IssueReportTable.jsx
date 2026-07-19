import IssueStatusBadge from "../issues/IssueStatusBadge.jsx";
import { formatCurrency, formatDate } from "./reportUtils.js";
import SortableHeader from "../common/SortableHeader.jsx";

function IssueReportTable({ issues = [], sortField, sortDir, onSort }) {
    const sortProps = { sortField, sortDir, onSort };

    return (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">
            <table className="min-w-[920px] w-full">
                <thead className="border-b border-pink-100">
                <tr>
                    <SortableHeader field="issueNo"      label="Mã phiếu"   {...sortProps} className="text-left" />
                    <SortableHeader field="issueDate"    label="Ngày xuất"   {...sortProps} className="text-left" />
                    <SortableHeader field="customer"     label="Khách hàng"  {...sortProps} className="text-left" />
                    <SortableHeader field="warehouse"    label="Kho"         {...sortProps} className="text-left" />
                    <SortableHeader field="totalAmount"  label="Tổng tiền"   {...sortProps} className="text-left" />
                    <SortableHeader field="status"       label="Trạng thái"  {...sortProps} className="text-center" />
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
