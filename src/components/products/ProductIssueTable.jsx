function ProductIssueTable({ issues, onView }) {
    return (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">
            <table className="min-w-[1100px] w-full">
                <thead className="border-b border-pink-100">
                <tr>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                        MÃ PHIẾU
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                        KHO
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                        NGÀY XUẤT
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                        KHÁCH HÀNG
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-slate-700">
                        TRẠNG THÁI
                    </th>
                    <th className="px-6 py-4 text-right font-semibold text-slate-700">
                        TỔNG TIỀN
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-slate-700">
                        THAO TÁC
                    </th>
                </tr>
                </thead>

                <tbody>
                {issues.length === 0 ? (
                    <tr>
                        <td
                            colSpan={7}
                            className="py-12 text-center italic text-gray-500"
                        >
                            Không tìm thấy phiếu xuất sản phẩm.
                        </td>
                    </tr>
                ) : (
                    issues.map((issue) => (
                        <tr
                            key={issue.id}
                            className="border-t border-(--color-border) transition hover:bg-pink-50/50"
                        >
                            <td className="px-6 py-4 font-semibold">
                                {issue.issueNo}
                            </td>

                            <td className="px-6 py-4">
                                {issue.warehouse || "-"}
                            </td>

                            <td className="px-6 py-4">
                                {issue.issueDate || "-"}
                            </td>

                            <td className="px-6 py-4">
                                {issue.customer || "-"}
                            </td>

                            <td className="px-6 py-4 text-center">
                                {issue.status}
                            </td>

                            <td className="px-6 py-4 text-right">
                                {Number(issue.totalAmount ?? 0).toLocaleString("vi-VN")} ₫
                            </td>

                            <td className="px-6 py-4 text-center">
                                <button
                                    type="button"
                                    onClick={() => onView(issue.id)}
                                    className="rounded-xl px-4 py-2 text-sm font-medium text-(--color-primary) transition hover:bg-pink-50"
                                >
                                    Chi tiết
                                </button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}

export default ProductIssueTable;