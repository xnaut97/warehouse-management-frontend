import Badge from "../common/Badge.jsx";
import { formatCurrency, formatDate, formatNumber } from "./reportUtils.js";
import SortableHeader from "../common/SortableHeader.jsx";

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

function InventoryReportTable({
    inventories = [],
    history = [],
    mode = "inventory",
    sortField,
    sortDir,
    onSort,
}) {
    const isHistory = mode === "history";
    const sortProps = { sortField, sortDir, onSort };

    return (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">
            <table className="min-w-[980px] w-full">
                <thead className="border-b border-pink-100">
                {isHistory ? (
                    <tr>
                        <SortableHeader field="transactionDate" label="Thời gian"   {...sortProps} className="text-left" />
                        <SortableHeader field="referenceNo"     label="Mã chứng từ" {...sortProps} className="text-left" />
                        <SortableHeader field="transactionType" label="Loại"        {...sortProps} className="text-left" />
                        <SortableHeader field="materialCode"    label="Mã"          {...sortProps} className="text-left" />
                        <SortableHeader field="materialName"    label="Tên"         {...sortProps} className="text-left" />
                        <SortableHeader field="warehouse"       label="Kho"         {...sortProps} className="text-left" />
                        <SortableHeader field="quantity"        label="Số lượng"    {...sortProps} className="text-left" />
                    </tr>
                ) : (
                    <tr>
                        <SortableHeader field="materialCode"    label="Mã"            {...sortProps} className="text-left" />
                        <SortableHeader field="materialName"    label="Tên"           {...sortProps} className="text-left" />
                        <SortableHeader field="warehouse"       label="Kho"           {...sortProps} className="text-left" />
                        <SortableHeader field="quantity"        label="Số lượng tồn"  {...sortProps} className="text-left" />
                        <SortableHeader field="inventoryValue"  label="Giá trị tồn"  {...sortProps} className="text-left" />
                        <SortableHeader field="status"          label="Trạng thái"    {...sortProps} className="text-center" />
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
                        <tr
                            key={`${item.referenceNo}-${item.transactionDate}-${item.materialCode}`}
                            className="border-b border-pink-100 transition hover:bg-pink-50"
                        >
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
                        <tr
                            key={`${item.warehouseId}-${item.materialId}`}
                            className="border-b border-pink-100 transition hover:bg-pink-50"
                        >
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
