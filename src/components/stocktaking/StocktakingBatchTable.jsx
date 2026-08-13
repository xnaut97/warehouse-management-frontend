import EditableCell from "./EditableCell.jsx";

import {
    formatDate,
    formatNumber
} from "../reports/reportUtils.js";

function VarianceValue({ value }) {

    const variance = Number(value ?? 0);

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

function StocktakingBatchTable({
                                   item,
                                   editable,
                                   onSaveBatch
                               }) {

    const batches = item.batches ?? [];

    return (

        <div className="rounded-xl border border-(--color-border) bg-pink-50/40 p-4">

            <p className="mb-3 text-sm font-semibold text-slate-700">

                Chi tiết theo lô — {item.code} · {item.name}

            </p>

            {batches.length === 0 ? (

                <p className="text-sm text-slate-500">

                    Chưa có lô hàng nào.

                </p>

            ) : (

                <div className="overflow-x-auto rounded-xl border border-(--color-border) bg-white">

                    <table className="w-full min-w-175 text-sm">

                        <thead className="border-b border-pink-100">

                        <tr>

                            <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                SỐ LÔ
                            </th>

                            <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                HSD
                            </th>

                            <th className="px-4 py-3 text-right font-semibold text-slate-700">
                                SỔ SÁCH
                            </th>

                            <th className="px-4 py-3 text-right font-semibold text-slate-700">
                                THỰC TẾ
                            </th>

                            <th className="px-4 py-3 text-right font-semibold text-slate-700">
                                CHÊNH LỆCH
                            </th>

                            <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                LÝ DO
                            </th>

                        </tr>

                        </thead>

                        <tbody>

                        {batches.map((batch) => (

                            <tr
                                key={batch.id}
                                className="border-b border-pink-100 last:border-b-0"
                            >

                                <td className="px-4 py-3 font-medium text-slate-800">
                                    {batch.lotNumber || "-"}
                                </td>

                                <td className="px-4 py-3 text-slate-700">
                                    {formatDate(batch.expirationDate) || "-"}
                                </td>

                                <td className="px-4 py-3 text-right text-slate-700">
                                    {formatNumber(batch.systemQuantity)}
                                </td>

                                <td className="px-4 py-3 text-right">

                                    {editable ? (

                                        <EditableCell
                                            type="number"
                                            value={
                                                batch.physicalQuantity ?? ""
                                            }
                                            placeholder="0"
                                            className="h-9 w-28 text-right"
                                            onCommit={(next) =>
                                                onSaveBatch(batch, {
                                                    physicalQuantity: Number(next),
                                                    reason: batch.reason ?? null
                                                })
                                            }
                                        />

                                    ) : (

                                        <span className="text-slate-800">
                                            {
                                                batch.physicalQuantity === null ||
                                                batch.physicalQuantity === undefined
                                                    ? "-"
                                                    : formatNumber(batch.physicalQuantity)
                                            }
                                        </span>

                                    )}

                                </td>

                                <td className="px-4 py-3 text-right">
                                    <VarianceValue value={batch.varianceQuantity} />
                                </td>

                                <td className="px-4 py-3">

                                    {editable ? (

                                        <EditableCell
                                            value={batch.reason ?? ""}
                                            placeholder={
                                                Number(batch.varianceQuantity ?? 0) === 0
                                                    ? "Không bắt buộc"
                                                    : "Lý do chênh lệch"
                                            }
                                            className="h-9 w-full min-w-45"
                                            disabled={
                                                batch.physicalQuantity === null ||
                                                batch.physicalQuantity === undefined
                                            }
                                            onCommit={(next) =>
                                                onSaveBatch(batch, {
                                                    physicalQuantity: Number(
                                                        batch.physicalQuantity ?? 0
                                                    ),
                                                    reason: next
                                                })
                                            }
                                        />

                                    ) : (

                                        <span className="text-slate-700">
                                            {batch.reason || "-"}
                                        </span>

                                    )}

                                </td>

                            </tr>

                        ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    );

}

export default StocktakingBatchTable;
