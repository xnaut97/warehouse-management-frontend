import Badge from "../common/Badge.jsx";
import { formatCurrency, formatDate, formatNumber } from "./reportUtils.js";

function statusLabel(status) {
    if (status === "OUT_OF_STOCK") return "Hết hàng";
    if (status === "LOW_STOCK") return "Tồn thấp";

    return "Bình thường";
}

function statusColor(status) {
    if (status === "OUT_OF_STOCK") return "red";
    if (status === "LOW_STOCK") return "yellow";

    return "green";
}

function InventoryReportTable({ inventories = [], history = [], mode = "inventory" }) {
    const isHistory = mode === "history";

    return (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">
            <table className="min-w-[980px] w-full">
                <thead className="border-b border-pink-100">
                {isHistory ? (
                    <tr>
                        <th className="px-6 py-4 text-left">Thời gian</th>
                        <th className="px-6 py-4 text-left">Mã chứng từ</th>
                        <th className="px-6 py-4 text-left">Loại</th>
                        <th className="px-6 py-4 text-left">Mã</th>
                        <th className="px-6 py-4 text-left">Tên</th>
                        <th className="px-6 py-4 text-left">Kho</th>
                        <th className="px-6 py-4 text-left">Số lượng</th>
                    </tr>
                ) : (
                    <tr>
                        <th className="px-6 py-4 text-left">Mã</th>
                        <th className="px-6 py-4 text-left">Tên</th>
                        <th className="px-6 py-4 text-left">Kho</th>
                        <th className="px-6 py-4 text-left">Số lượng tồn</th>
                        <th className="px-6 py-4 text-left">Giá trị tồn</th>
                        <th className="px-6 py-4 text-center">Trạng thái</th>
                    </tr>
                )}
                </thead>
                <tbody>
                {isHistory ? (
                    history.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                                Không có dữ liệu lịch sử tồn kho
                            </td>
                        </tr>
                    ) : history.map((item) => (
                        <tr key={`${item.referenceNo}-${item.transactionDate}-${item.materialCode}`} className="border-b border-pink-100 transition hover:bg-pink-50">
                            <td className="px-6 py-4 text-sm text-slate-700">{formatDate(item.transactionDate)}</td>
                            <td className="px-6 py-4 text-sm text-slate-700">{item.referenceNo}</td>
                            <td className="px-6 py-4 text-sm text-slate-700">
                                <Badge color={item.transactionType === "IN" ? "green" : "yellow"}>
                                    {item.transactionType === "IN" ? "Nhập" : "Xuất"}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-700">{item.materialCode}</td>
                            <td className="px-6 py-4 text-sm text-slate-700">{item.materialName}</td>
                            <td className="px-6 py-4 text-sm text-slate-700">{item.warehouse}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-slate-700">{formatNumber(item.quantity)}</td>
                        </tr>
                    ))
                ) : (
                    inventories.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                                Không có dữ liệu báo cáo tồn kho
                            </td>
                        </tr>
                    ) : inventories.map((item) => (
                        <tr key={`${item.warehouseId}-${item.materialId}`} className="border-b border-pink-100 transition hover:bg-pink-50">
                            <td className="px-6 py-4 text-sm text-slate-700">{item.materialCode}</td>
                            <td className="px-6 py-4 text-sm text-slate-700">{item.materialName}</td>
                            <td className="px-6 py-4 text-sm text-slate-700">{item.warehouse}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-slate-700">{formatNumber(item.quantity)} {item.unit}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-slate-700">{formatCurrency(item.inventoryValue)}</td>
                            <td className="px-6 py-4 text-center">
                                <Badge color={statusColor(item.status)}>
                                    {statusLabel(item.status)}
                                </Badge>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}

export default InventoryReportTable;
