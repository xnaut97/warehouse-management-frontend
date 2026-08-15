import EditableCell from "./EditableCell.jsx";

import {
    formatDate,
    formatNumber
} from "../reports/reportUtils.js";

import { parseQuantity } from "./stocktakingDraft.js";

function VarianceValue({ value }) {

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

function StocktakingBatchTable({
                                   item,
                                   editable,
                                   draft,
                                   onChangeBatch
                               }) {

    const batches = item.batches ?? [];

    const readQuantity = (batch) => {

        if (!editable) {

            return batch.physicalQuantity === null ||
            batch.physicalQuantity === undefined
                ? null
                : Number(batch.physicalQuantity);

        }

        return parseQuantity(
            draft.batches[batch.id]?.physicalQuantity
        );

    };

    const readVariance = (batch, physicalQuantity) => {

        if (!editable) {

            return batch.physicalQuantity === null ||
            batch.physicalQuantity === undefined
                ? null
                : Number(batch.varianceQuantity ?? 0);

        }

        return physicalQuantity === null
            ? null
            : physicalQuantity - Number(batch.systemQuantity ?? 0);

    };

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

                        {batches.map((batch) => {

                            const physicalQuantity = readQuantity(batch);

                            const variance = readVariance(
                                batch,
                                physicalQuantity
                            );

                            return (

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

                                            <div className="flex justify-end">

                                                <EditableCell
                                                    type="number"
                                                    value={
                                                        draft.batches[batch.id]
                                                            ?.physicalQuantity ?? ""
                                                    }
                                                    placeholder="Nhập số thực tế"
                                                    className="h-9 w-32 text-right"
                                                    onChange={(next) =>
                                                        onChangeBatch(
                                                            batch.id,
                                                            "physicalQuantity",
                                                            next
                                                        )
                                                    }
                                                />

                                            </div>

                                        ) : (

                                            <span className="text-slate-800">
                                                {
                                                    physicalQuantity === null
                                                        ? "-"
                                                        : formatNumber(physicalQuantity)
                                                }
                                            </span>

                                        )}

                                    </td>

                                    <td className="px-4 py-3 text-right">
                                        <VarianceValue value={variance} />
                                    </td>

                                    <td className="px-4 py-3">

                                        {editable ? (

                                            <EditableCell
                                                value={
                                                    draft.batches[batch.id]?.reason ?? ""
                                                }
                                                placeholder={
                                                    variance === null || variance === 0
                                                        ? "Không bắt buộc"
                                                        : "Lý do chênh lệch"
                                                }
                                                className="h-9 w-full min-w-45"
                                                onChange={(next) =>
                                                    onChangeBatch(
                                                        batch.id,
                                                        "reason",
                                                        next
                                                    )
                                                }
                                            />

                                        ) : (

                                            <span className="text-slate-700">
                                                {batch.reason || "-"}
                                            </span>

                                        )}

                                    </td>

                                </tr>

                            );

                        })}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    );

}

export default StocktakingBatchTable;
