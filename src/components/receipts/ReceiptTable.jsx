import { Eye, Trash2 } from "lucide-react";

import ReceiptStatusBadge from "./ReceiptStatusBadge.jsx";
import SortableHeader from "../common/SortableHeader.jsx";

function ReceiptTable({ receipts, onView, onDelete, sortField, sortDir, onSort }) {

    const sortProps = { sortField, sortDir, onSort };

    return (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">

            <table className="min-w-215 w-full">

                <thead className="border-b border-pink-100">
                <tr>

                    <SortableHeader field="receiptNo"   label="Số phiếu nhập"   {...sortProps} className="text-left" />
                    <SortableHeader field="supplier"    label="Nhà cung cấp"    {...sortProps} className="text-left" />
                    <SortableHeader field="warehouse"   label="Kho"             {...sortProps} className="text-left" />
                    <SortableHeader field="receiptDate" label="Ngày"            {...sortProps} className="text-right" />
                    <SortableHeader field="status"      label="Trạng thái"      {...sortProps} className="text-right" />

                    <th className="px-6 py-4 text-center font-semibold text-slate-700">
                        Thao tác
                    </th>

                </tr>
                </thead>

                <tbody>

                {receipts.length === 0 ? (

                    <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                            Không có dữ liệu
                        </td>
                    </tr>

                ) : (

                    receipts.map((receipt) => (

                        <tr
                            key={receipt.id}
                            className="border-b border-pink-100 transition hover:bg-pink-50"
                        >

                            <td className="px-6 py-4 font-medium text-slate-800">
                                {receipt.receiptNo}
                            </td>

                            <td className="px-6 py-4 text-sm text-slate-700">
                                {receipt.supplier}
                            </td>

                            <td className="px-6 py-4 text-sm text-slate-700">
                                {receipt.warehouse}
                            </td>

                            <td className="px-6 py-4 text-sm text-slate-700">
                                {receipt.receiptDate}
                            </td>

                            <td className="px-6 py-4 text-center">
                                <ReceiptStatusBadge status={receipt.status} />
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-1">

                                    <button
                                        onClick={() => onView(receipt.id)}
                                        className="rounded-lg p-2 text-slate-500 transition hover:text-(--color-primary-hover)"
                                        title="Xem chi tiết"
                                    >
                                        <Eye size={18} />
                                    </button>

                                    {receipt.status === "DRAFT" && onDelete && (
                                        <button
                                            onClick={() => onDelete(receipt)}
                                            className="rounded-lg p-2 text-slate-500 transition hover:text-(--color-primary-hover)"
                                            title="Xóa phiếu nhập"
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

export default ReceiptTable;
