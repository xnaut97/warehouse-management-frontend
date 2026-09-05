import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import EmptyState from "../common/EmptyState.jsx";
import ExpiryStatusBadge from "./ExpiryStatusBadge.jsx";
import ProductLotTable from "./ProductLotTable.jsx";

import {
    formatCurrency,
    formatNumber
} from "../reports/reportUtils.js";

function ProductInventoryTable({ items = [] }) {

    const [expandedIds, setExpandedIds] = useState([]);

    const toggleExpanded = (itemId) => {

        setExpandedIds((current) =>
            current.includes(itemId)
                ? current.filter((id) => id !== itemId)
                : [...current, itemId]
        );

    };

    return (

        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">

            <table className="w-full min-w-250">

                <thead className="border-b border-pink-100">

                <tr>

                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                        SẢN PHẨM
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
                        GIÁ VỐN TRUNG BÌNH
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
                                title="Chưa có dữ liệu tồn kho sản phẩm"
                                description="Không có sản phẩm nào phát sinh tồn kho hoặc chứng từ trong kỳ đã chọn."
                            />

                        </td>

                    </tr>

                ) : (

                    items.map((item) => {

                        const expanded = expandedIds.includes(item.itemId);

                        return (

                            <Fragment key={item.itemId}>

                                <tr
                                    onClick={() => toggleExpanded(item.itemId)}
                                    className="cursor-pointer border-b border-pink-100 transition hover:bg-pink-50"
                                >

                                    <td className="px-6 py-4 text-sm font-medium text-slate-800">

                                        <div className="flex items-center gap-2">

                                            <span className="rounded-lg p-1 text-slate-500">

                                                {expanded ? (
                                                    <ChevronDown size={18} />
                                                ) : (
                                                    <ChevronRight size={18} />
                                                )}

                                            </span>

                                            {item.name} ({item.code})

                                        </div>

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
                                        <ExpiryStatusBadge status={item.expiryStatus} />
                                    </td>

                                </tr>

                                {expanded && (

                                    <tr className="border-b border-pink-100 bg-pink-50/30">

                                        <td colSpan={9} className="px-6 py-4">

                                            <ProductLotTable lots={item.lots ?? []} />

                                        </td>

                                    </tr>

                                )}

                            </Fragment>

                        );

                    })

                )}

                </tbody>

            </table>

        </div>

    );

}

export default ProductInventoryTable;
