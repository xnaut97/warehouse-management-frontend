import { Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import IssueStatusBadge from "./IssueStatusBadge.jsx";
import SortableHeader from "../common/SortableHeader.jsx";

function IssueTable({ issues, onView, onDelete, sortField, sortDir, onSort }) {

    const navigate = useNavigate();

    const handleView = (id) => {
        if (onView) {
            onView(id);
        } else {
            navigate(`/issues/${id}`);
        }
    };

    const sortProps = { sortField, sortDir, onSort };

    return (
        <div className="overflow-x-auto rounded-xl border border-pink-100 bg-white shadow-sm">

            <table className="min-w-[920px] w-full">

                <thead className="border-b border-pink-100">
                <tr>

                    <SortableHeader field="issueNo"    label="MÃ PHIẾU"    {...sortProps} className="text-left" />
                    <SortableHeader field="warehouse"  label="KHO"         {...sortProps} className="text-left" />
                    <SortableHeader field="issueDate"  label="NGÀY XUẤT"   {...sortProps} className="text-left" />
                    <SortableHeader field="status"     label="TRẠNG THÁI"  {...sortProps} className="text-left" />

                    <th className="px-6 py-4 text-center font-semibold text-slate-700">
                        THAO TÁC
                    </th>

                </tr>
                </thead>

                <tbody>

                {issues.length === 0 ? (

                    <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                            Không có dữ liệu
                        </td>
                    </tr>

                ) : (

                    issues.map((issue) => (

                        <tr
                            key={issue.id}
                            className="border-b border-pink-100 transition hover:bg-pink-50"
                        >

                            <td className="px-6 py-4 font-medium text-slate-800">
                                {issue.issueNo}
                            </td>

                            <td className="px-6 py-4 text-slate-700">
                                {issue.warehouse}
                            </td>

                            <td className="px-6 py-4 text-slate-700">
                                {issue.issueDate}
                            </td>

                            <td className="px-6 py-4">
                                <IssueStatusBadge status={issue.status} />
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-1">

                                    <button
                                        onClick={() => handleView(issue.id)}
                                        className="rounded-lg p-2 text-slate-600 transition  hover:text-(--color-primary-hover)"
                                        title="Xem chi tiết"
                                    >
                                        <Eye size={18} />
                                    </button>

                                    {issue.status === "DRAFT" && onDelete && (
                                        <button
                                            onClick={() => onDelete(issue)}
                                            className="rounded-lg p-2 text-slate-600 transition hover:text-(--color-primary-hover)"
                                            title="Xóa phiếu xuất"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}

                                </div>
                            </td>

                        </tr>

                    ))

                )}

                </tbody>

            </table>

        </div>
    );
}

export default IssueTable;
