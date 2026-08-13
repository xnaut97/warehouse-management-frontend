import ReceiptStatusBadge from "../receipts/ReceiptStatusBadge.jsx";

function ProductReceiptTable({ receipts, onView }) {
    return (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">
            <table className="min-w-[1000px] w-full">
                <thead className="border-b border-pink-100">
                <tr>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                        MÃ PHIẾU
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                        KHO
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                        NGÀY NHẬP
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-slate-700">
                        TRẠNG THÁI
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-slate-700">
                        THAO TÁC
                    </th>
                </tr>
                </thead>

                <tbody>
                {receipts.length === 0 ? (
                    <tr>
                        <td
                            colSpan={5}
                            className="py-12 text-center italic text-gray-500"
                        >
                            Không tìm thấy phiếu nhập sản phẩm.
                        </td>
                    </tr>
                ) : (
                    receipts.map((receipt) => (
                        <tr
                            key={receipt.id}
                            className="border-t border-(--color-border) transition hover:bg-pink-50/50"
                        >
                            <td className="px-6 py-4 font-semibold">
                                {receipt.receiptNo}
                            </td>

                            <td className="px-6 py-4">
                                {receipt.warehouse || "—"}
                            </td>

                            <td className="px-6 py-4">
                                {receipt.receiptDate || "—"}
                            </td>

                            <td className="px-6 py-4 text-center">
                                <ReceiptStatusBadge status={receipt.status} />
                            </td>

                            <td className="px-6 py-4 text-center">
                                <button
                                    type="button"
                                    onClick={() => onView(receipt.id)}
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

export default ProductReceiptTable;