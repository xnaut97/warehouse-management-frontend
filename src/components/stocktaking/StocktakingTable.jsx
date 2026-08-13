import { Eye, Pencil, CheckCheck, Scale } from "lucide-react";

import SortableHeader from "../common/SortableHeader.jsx";
import EmptyState from "../common/EmptyState.jsx";

import StocktakingStatusBadge from "./StocktakingStatusBadge.jsx";

import { formatDate } from "../reports/reportUtils.js";

import {
    canBalance,
    canConfirm,
    stockGroupLabel,
    stocktakingTypeLabel
} from "./stocktakingLabels.js";

function StocktakingTable({
                              stocktakings,
                              onView,
                              onEdit,
                              onConfirm,
                              onBalance,
                              sortField,
                              sortDir,
                              onSort
                          }) {

    const sortProps = { sortField, sortDir, onSort };

    return (

        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">

            <table className="w-full min-w-215">

                <thead className="border-b border-pink-100">

                <tr>

                    <SortableHeader
                        field="stocktakingNo"
                        label="MÃ PHIẾU"
                        {...sortProps}
                        className="text-left"
                    />

                    <SortableHeader
                        field="stocktakingDate"
                        label="NGÀY KIỂM KÊ"
                        {...sortProps}
                        className="text-left"
                    />

                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                        KHO KIỂM KÊ
                    </th>

                    <SortableHeader
                        field="type"
                        label="LOẠI KIỂM KÊ"
                        {...sortProps}
                        className="text-left"
                    />

                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                        NGƯỜI KIỂM KÊ
                    </th>

                    <SortableHeader
                        field="status"
                        label="TRẠNG THÁI"
                        {...sortProps}
                        className="text-center"
                    />

                    <th className="px-6 py-4 text-center font-semibold text-slate-700">
                        THAO TÁC
                    </th>

                </tr>

                </thead>

                <tbody>

                {stocktakings.length === 0 ? (

                    <tr>

                        <td colSpan={7}>

                            <EmptyState
                                title="Chưa có phiếu kiểm kê"
                                description="Không tìm thấy phiếu kiểm kê nào phù hợp."
                            />

                        </td>

                    </tr>

                ) : (

                    stocktakings.map((stocktaking) => (

                        <tr
                            key={stocktaking.id}
                            className="border-b border-pink-100 transition hover:bg-pink-50"
                        >

                            <td className="px-6 py-4 font-medium text-slate-800">
                                {stocktaking.stocktakingNo}
                            </td>

                            <td className="px-6 py-4 text-sm text-slate-700">
                                {formatDate(stocktaking.stocktakingDate) || "-"}
                            </td>

                            <td className="px-6 py-4 text-sm text-slate-700">
                                {stockGroupLabel[stocktaking.warehouseGroup] || "-"}
                            </td>

                            <td className="px-6 py-4 text-sm text-slate-700">
                                {stocktakingTypeLabel[stocktaking.type] || "-"}
                            </td>

                            <td className="px-6 py-4 text-sm text-slate-700">
                                {stocktaking.stocktaker || "-"}
                            </td>

                            <td className="px-6 py-4 text-center">
                                <StocktakingStatusBadge status={stocktaking.status} />
                            </td>

                            <td className="px-6 py-4">

                                <div className="flex items-center justify-center gap-1">

                                    <button
                                        type="button"
                                        onClick={() => onView(stocktaking.id)}
                                        className="rounded-lg p-2 text-slate-500 transition hover:text-(--color-primary-hover)"
                                        title="Xem chi tiết"
                                    >
                                        <Eye size={18} />
                                    </button>

                                    {canConfirm(stocktaking.status) && (

                                        <>

                                            <button
                                                type="button"
                                                onClick={() => onEdit(stocktaking.id)}
                                                className="rounded-lg p-2 text-slate-500 transition hover:text-(--color-primary-hover)"
                                                title="Nhập/chỉnh sửa số thực tế"
                                            >
                                                <Pencil size={18} />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => onConfirm(stocktaking)}
                                                className="rounded-lg p-2 text-slate-500 transition hover:text-(--color-primary-hover)"
                                                title="Chốt số liệu"
                                            >
                                                <CheckCheck size={18} />
                                            </button>

                                        </>

                                    )}

                                    {canBalance(stocktaking.status) && (

                                        <button
                                            type="button"
                                            onClick={() => onBalance(stocktaking)}
                                            className="rounded-lg p-2 text-slate-500 transition hover:text-(--color-primary-hover)"
                                            title="Xử lý/cân bằng kho"
                                        >
                                            <Scale size={18} />
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

export default StocktakingTable;
