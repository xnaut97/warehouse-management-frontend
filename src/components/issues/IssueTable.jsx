import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import IssueStatusBadge from "./IssueStatusBadge.jsx";

function IssueTable({ issues }) {

    const navigate = useNavigate();

    return (

        <div className="overflow-hidden rounded-xl border border-pink-100 bg-white shadow-sm">

            <table className="w-full">

                <thead className="border-b border-pink-100">

                <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Mã phiếu
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Kho
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Khách hàng
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Ngày xuất
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                        Trạng thái
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                        Tổng tiền
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                        Thao tác
                    </th>

                </tr>

                </thead>

                <tbody>

                {
                    issues.length === 0 ? (

                        <tr>

                            <td
                                colSpan={7}
                                className="px-6 py-10 text-center text-slate-500"
                            >
                                Không có dữ liệu
                            </td>

                        </tr>

                    ) : (

                        issues.map((issue) => (

                            <tr
                                key={issue.id}
                                className="border-b border-pink-100 transition hover:bg-pink-50"
                            >

                                <td className="px-6 py-4">
                                    {issue.issueNo}
                                </td>

                                <td className="px-6 py-4">
                                    {issue.warehouse}
                                </td>

                                <td className="px-6 py-4">
                                    {issue.customer}
                                </td>

                                <td className="px-6 py-4">
                                    {issue.issueDate}
                                </td>

                                <td className="px-6 py-4 text-center">
                                    <IssueStatusBadge
                                        status={issue.status}
                                    />
                                </td>

                                <td className="px-6 py-4 text-center">
                                    {issue.totalAmount}
                                </td>

                                <td className="px-6 py-4">

                                    <div className="flex justify-center">

                                        <button
                                            onClick={() => navigate(`/issues/${issue.id}`)}
                                            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-blue-600"
                                            title="Xem chi tiết"
                                        >

                                            <Eye size={18} />

                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))

                    )
                }

                </tbody>

            </table>

        </div>

    );

}

export default IssueTable;