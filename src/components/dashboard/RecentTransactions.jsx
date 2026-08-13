import Badge from "../common/Badge.jsx";
import { formatNumber } from "../../utils/dashboardUtils.js";

const TRANSACTION_TYPE_MAP = {
    RECEIPT: { label: "Nhập kho", color: "green" },
    ISSUE: { label: "Xuất kho", color: "pink" },
};

const STATUS_MAP = {
    DRAFT: { label: "Nháp", color: "gray" },
    PENDING: { label: "Chờ duyệt", color: "yellow" },
    COMPLETED: { label: "Hoàn thành", color: "green" },
    CANCELLED: { label: "Đã hủy", color: "red" },
};

function RecentTransactions({ data }) {

    const transactions = data ?? [];

    return (
        <section>
            <div className="mb-5 space-y-1">
                <h2 className="text-2xl font-bold text-gray-800">
                    Giao dịch gần đây
                </h2>
                <p className="text-md text-gray-500">
                    Các phiếu nhập xuất kho mới nhất trong hệ thống.
                </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">
                <table className="min-w-200 w-full">

                    <thead className="border-b border-pink-100">
                    <tr>
                        <th className="px-6 py-4 text-left font-semibold text-slate-700">
                            Thời gian
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-slate-700">
                            Số phiếu
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-slate-700">
                            Mã hàng
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-slate-700">
                            Loại nghiệp vụ
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-slate-700">
                            Loại hàng
                        </th>
                        <th className="px-6 py-4 text-right font-semibold text-slate-700">
                            Số lượng
                        </th>
                        <th className="px-6 py-4 text-center font-semibold text-slate-700">
                            Trạng thái
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {transactions.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                                Không có giao dịch nào gần đây.
                            </td>
                        </tr>
                    ) : (
                        transactions.map((tx) => {
                            const typeInfo = TRANSACTION_TYPE_MAP[tx.transactionType] ?? { label: tx.transactionType, color: "gray" };
                            const statusInfo = STATUS_MAP[tx.status] ?? { label: tx.status, color: "gray" };

                            return (
                                <tr
                                    key={tx.id}
                                    className="border-b border-pink-100 transition hover:bg-pink-50"
                                >
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {tx.time}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-800">
                                        {tx.voucherNo}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {tx.itemCode}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge color={typeInfo.color}>
                                            {typeInfo.label}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {tx.itemCategory}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-slate-800">
                                        {formatNumber(tx.quantity)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge color={statusInfo.color}>
                                            {statusInfo.label}
                                        </Badge>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                    </tbody>

                </table>
            </div>
        </section>
    );

}

export default RecentTransactions;
