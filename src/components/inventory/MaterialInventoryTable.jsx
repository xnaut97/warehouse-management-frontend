import EmptyState from "../common/EmptyState.jsx";
import InventoryStatusBadge from "./InventoryStatusBadge.jsx";

import {
    formatCurrency,
    formatNumber
} from "../reports/reportUtils.js";

function MaterialInventoryTable({ items = [] }) {

    return (

        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">

            <table className="w-full min-w-250">

                <thead className="border-b border-pink-100">

                <tr>

                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                        NVL
                    </th>

                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                        ĐVT
                    </th>

                    <th className="px-6 py-4 text-right font-semibold text-slate-700">
                        TỒN ĐẦU
                    </th>

                    <th className="px-6 py-4 text-right font-semibold text-slate-700">
                        SL NHẬP
                    </th>

                    <th className="px-6 py-4 text-right font-semibold text-slate-700">
                        SL XUẤT
                    </th>

                    <th className="px-6 py-4 text-right font-semibold text-slate-700">
                        TỒN CUỐI
                    </th>

                    <th className="px-6 py-4 text-right font-semibold text-slate-700">
                        GIÁ NHẬP TRUNG BÌNH
                    </th>

                    <th className="px-6 py-4 text-right font-semibold text-slate-700">
                        TỔNG VỐN TỒN
                    </th>

                    <th className="px-6 py-4 text-center font-semibold text-slate-700">
                        TRẠNG THÁI
                    </th>

                </tr>

                </thead>

                <tbody>

                {items.length === 0 ? (

                    <tr>

                        <td colSpan={9}>

                            <EmptyState
                                title="Chưa có dữ liệu tồn kho nguyên vật liệu"
                                description="Không có nguyên vật liệu nào phát sinh tồn kho hoặc chứng từ trong kỳ đã chọn."
                            />

                        </td>

                    </tr>

                ) : (

                    items.map((item) => (

                        <tr
                            key={item.itemId}
                            className="border-b border-pink-100 transition hover:bg-pink-50"
                        >

                            <td className="px-6 py-4 text-sm font-medium text-slate-800">
                                {item.name} ({item.code})
                            </td>

                            <td className="px-6 py-4 text-sm text-slate-700">
                                {item.unit || "-"}
                            </td>

                            <td className="px-6 py-4 text-right text-sm text-slate-700">
                                {formatNumber(item.openingQuantity)}
                            </td>

                            <td className="px-6 py-4 text-right text-sm text-slate-700">
                                {formatNumber(item.receiptQuantity)}
                            </td>

                            <td className="px-6 py-4 text-right text-sm text-slate-700">
                                {formatNumber(item.issueQuantity)}
                            </td>

                            <td className="px-6 py-4 text-right text-sm font-semibold text-slate-800">
                                {formatNumber(item.closingQuantity)}
                            </td>

                            <td className="px-6 py-4 text-right text-sm text-slate-700">
                                {formatCurrency(item.averagePrice)}
                            </td>

                            <td className="px-6 py-4 text-right text-sm font-semibold text-slate-800">
                                {formatCurrency(item.inventoryValue)}
                            </td>

                            <td className="px-6 py-4 text-center">
                                <InventoryStatusBadge status={item.thresholdStatus} />
                            </td>

                        </tr>

                    ))

                )}

                </tbody>

            </table>

        </div>

    );

}

export default MaterialInventoryTable;
