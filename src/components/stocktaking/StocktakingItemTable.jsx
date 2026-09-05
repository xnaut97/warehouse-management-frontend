import {Fragment, useState} from "react";
import {ChevronDown, ChevronRight} from "lucide-react";

import EmptyState from "../common/EmptyState.jsx";

import EditableCell from "./EditableCell.jsx";
import StocktakingBatchTable from "./StocktakingBatchTable.jsx";
import StocktakingItemStatusBadge from "./StocktakingItemStatusBadge.jsx";

import {formatNumber} from "../reports/reportUtils.js";
import {stockGroupLabel} from "./stocktakingLabels.js";

import {resolveItemView} from "./stocktakingDraft.js";

function VarianceValue({value}) {

    if (value === null || value === undefined) {

        return (
            <span className="text-slate-400">
                -
            </span>
        );

    }

    const variance = Number(value);

    return (

        <span
            className={
                variance === 0
                    ? "text-slate-700"
                    : "font-semibold text-red-500"
            }
        >

            {variance > 0 ? "+" : ""}{formatNumber(variance)}

        </span>

    );

}

function StocktakingItemTable({
                                  items,
                                  editable,
                                  draft,
                                  onChangeItem,
                                  onChangeBatch
                              }) {

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

            <table className="w-full min-w-275">

                <thead className="border-b border-pink-100">

                <tr>

                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                        MÃ SP
                    </th>

                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                        TÊN VẬT TƯ
                    </th>

                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                        NHÓM VẬT TƯ
                    </th>

                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                        ĐVT
                    </th>

                    <th className="px-6 py-4 text-right font-semibold text-slate-700">
                        SỔ SÁCH
                    </th>

                    <th className="px-6 py-4 text-right font-semibold text-slate-700">
                        THỰC TẾ
                    </th>

                    <th className="px-6 py-4 text-right font-semibold text-slate-700">
                        CHÊNH LỆCH
                    </th>

                    <th className="px-6 py-4 text-center font-semibold text-slate-700">
                        TRẠNG THÁI KIỂM KÊ
                    </th>

                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                        LÝ DO
                    </th>

                </tr>

                </thead>

                <tbody>

                {items.length === 0 ? (

                    <tr>

                        <td colSpan={9}>

                            <EmptyState
                                title="Chưa có dòng kiểm kê"
                                description="Kho của phiếu kiểm kê này chưa có tồn kho nào."
                            />

                        </td>

                    </tr>

                ) : (

                    items.map((item) => {

                        const expanded = expandedIds.includes(item.id);

                        const {
                            physicalQuantity,
                            variance,
                            status
                        } = resolveItemView(item, draft, editable);

                        return (

                            <Fragment key={item.id}>

                                <tr className="border-b border-pink-100 transition hover:bg-pink-50">

                                    <td className="px-6 py-4 font-medium text-slate-800">

                                        <div className="flex items-center gap-2">

                                            {item.batchManaged ? (

                                                <button
                                                    type="button"
                                                    onClick={() => toggleExpanded(item.id)}
                                                    className="rounded-lg p-1 text-slate-500 transition hover:text-(--color-primary-hover)"
                                                    title={
                                                        expanded
                                                            ? "Thu gọn danh sách lô"
                                                            : "Xem chi tiết theo lô"
                                                    }
                                                >

                                                    {expanded ? (
                                                        <ChevronDown size={18}/>
                                                    ) : (
                                                        <ChevronRight size={18}/>
                                                    )}

                                                </button>

                                            ) : (

                                                <span className="inline-block w-7"/>

                                            )}

                                            {item.code}

                                        </div>

                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {item.name}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {stockGroupLabel[item.itemGroup] || "-"}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {item.unit || "-"}
                                    </td>

                                    <td className="px-6 py-4 text-right text-sm text-slate-700">
                                        {formatNumber(
                                            ["vỏ", "bao"].includes(String(item.unit).trim().toLowerCase())
                                                ? Math.trunc(Number(item.systemQuantity))
                                                : item.systemQuantity
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-right">

                                        {editable && !item.batchManaged ? (

                                            <div className="flex justify-end">

                                                <EditableCell
                                                    type="number"
                                                    value={
                                                        draft.items[item.id]
                                                            ?.physicalQuantity ?? ""
                                                    }
                                                    placeholder="Nhập số thực tế"
                                                    className="h-9 w-32 text-right"
                                                    onChange={(next) =>
                                                        onChangeItem(
                                                            item.id,
                                                            "physicalQuantity",
                                                            next
                                                        )
                                                    }
                                                />

                                            </div>

                                        ) : (

                                            <div>

                                                <span className="font-semibold text-slate-800">
                                                    {
                                                        physicalQuantity === null
                                                            ? "-"
                                                            : formatNumber(
                                                                ["vỏ", "bao"].includes(String(item.unit).trim().toLowerCase())
                                                                    ? Math.trunc(Number(physicalQuantity))
                                                                    : physicalQuantity
                                                            )
                                                    }
                                                </span>

                                                {item.batchManaged && (

                                                    <p className="mt-1 text-xs text-slate-500">
                                                        Tổng thực tế các lô
                                                    </p>

                                                )}

                                            </div>

                                        )}

                                    </td>

                                    <td className="px-6 py-4 text-right text-sm">
                                        <VarianceValue value={variance}/>
                                    </td>

                                    <td className="px-6 py-4 text-center">

                                        <StocktakingItemStatusBadge
                                            status={status}
                                        />

                                    </td>

                                    <td className="px-6 py-4 text-sm">

                                        {editable && !item.batchManaged ? (

                                            <EditableCell
                                                value={
                                                    draft.items[item.id]?.reason ?? ""
                                                }
                                                placeholder={
                                                    variance === null || variance === 0
                                                        ? "Không bắt buộc"
                                                        : "Lý do chênh lệch"
                                                }
                                                className="h-9 w-full min-w-45"
                                                onChange={(next) =>
                                                    onChangeItem(
                                                        item.id,
                                                        "reason",
                                                        next
                                                    )
                                                }
                                            />

                                        ) : (

                                            <span className="text-slate-700">
                                                {item.reason || "-"}
                                            </span>

                                        )}

                                    </td>

                                </tr>

                                {item.batchManaged && expanded && (

                                    <tr className="border-b border-pink-100 bg-pink-50/30">

                                        <td colSpan={9} className="px-6 py-4">

                                            <StocktakingBatchTable
                                                item={item}
                                                editable={editable}
                                                draft={draft}
                                                onChangeBatch={onChangeBatch}
                                            />

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

export default StocktakingItemTable;
