import ReceiptStatusBadge from "../receipts/ReceiptStatusBadge.jsx";
import { formatCurrency, formatDate } from "./reportUtils.js";

function ReceiptReportTable({ receipts = [] }) {
    return (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">
            <table className="min-w-[920px] w-full">
                <thead className="border-b border-pink-100">
                <tr>
                    <th className="px-6 py-4 text-left">Mã phiếu</th>
                    <th className="px-6 py-4 text-left">Ngày nhập</th>
                    <th className="px-6 py-4 text-left">Nhà cung cấp</th>
                    <th className="px-6 py-4 text-left">Kho</th>
                    <th className="px-6 py-4 text-left">Tổng tiền</th>
                    <th className="px-6 py-4 text-center">Trạng thái</th>
                </tr>
                </thead>
                <tbody>
                {receipts.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                            Không có dữ liệu báo cáo nhập kho
                        </td>
                    </tr>
                ) : receipts.map((receipt) => (
                    <tr key={receipt.id} className="border-b border-pink-100 transition hover:bg-pink-50">
                        <td className="px-6 py-4 text-sm text-slate-700">{receipt.receiptNo}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{formatDate(receipt.receiptDate)}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{receipt.supplier}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{receipt.warehouse}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-700">{formatCurrency(receipt.totalAmount)}</td>
                        <td className="px-6 py-4 text-center">
                            <ReceiptStatusBadge status={receipt.status} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ReceiptReportTable;
