import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import IssueStatusBadge from "./IssueStatusBadge.jsx";

function IssueTable({ issues }) {

    const navigate = useNavigate();

    return (

        <div className="overflow-x-auto rounded-xl border border-pink-100 bg-white shadow-sm">

            <table className="min-w-[920px] w-full">

                <thead className="border-b border-pink-100">

                <tr>

                    <th className="px-6 py-4 text-left">
                        Mã phiếu
                    </th>

                    <th className="px-6 py-4 text-left">
                        Kho
                    </th>

                    <th className="px-6 py-4 text-left">
                        Khách hàng
                    </th>

                    <th className="px-6 py-4 text-left">
                        Ngày xuất
                    </th>

                    <th className="px-6 py-4 text-left">
                        Trạng thái
                    </th>

                    <th className="px-6 py-4 text-left">
                        Tổng tiền
                    </th>

                    <th className="px-6 py-4 text-center">
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

                                <td className="px-6 py-4">
                                    <IssueStatusBadge
                                        status={issue.status}
                                    />
                                </td>

                                <td className="px-6 py-4">
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
