import { formatNumber, formatPercent, toNumber } from "./reportUtils.js";

function varianceClass(value) {
    const variance = toNumber(value);

    if (variance > 0) return "text-red-600";
    if (variance < 0) return "text-emerald-600";

    return "text-slate-700";
}

function MaterialConsumptionTable({ comparisons = [] }) {
    return (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">
            <table className="min-w-[880px] w-full">
                <thead className="border-b border-pink-100">
                <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Mã NVL
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Tên nguyên vật liệu
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        ĐVT
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Định mức BOM
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Xuất thực tế
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Chênh lệch
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Chênh lệch %
                    </th>
                </tr>
                </thead>

                <tbody>
                {comparisons.length === 0 ? (
                    <tr>
                        <td
                            colSpan={7}
                            className="px-6 py-10 text-center text-slate-500"
                        >
                            Chưa có dữ liệu xuất kho hoặc định mức BOM trong khoảng thời gian đã chọn.
                        </td>
                    </tr>
                ) : comparisons.map((item) => (
                    <tr
                        key={item.materialId}
                        className="border-b border-pink-100 transition last:border-b-0 hover:bg-pink-50"
                    >
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                            {item.materialCode || "-"}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-700">
                            {item.materialName || "-"}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                            {item.unit || "-"}
                        </td>

                        <td className="px-6 py-4 text-right text-sm text-slate-700">
                            {formatNumber(item.standardQuantity)}
                        </td>

                        <td className="px-6 py-4 text-right text-sm text-slate-700">
                            {formatNumber(item.actualQuantity)}
                        </td>

                        <td className={`px-6 py-4 text-right text-sm font-medium ${varianceClass(item.varianceQuantity)}`}>
                            {formatNumber(item.varianceQuantity)}
                        </td>

                        <td className={`px-6 py-4 text-right text-sm font-medium ${varianceClass(item.varianceQuantity)}`}>
                            {formatPercent(item.wasteRatePercent)}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default MaterialConsumptionTable;
