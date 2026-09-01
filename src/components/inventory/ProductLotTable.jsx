import ExpiryStatusBadge from "./ExpiryStatusBadge.jsx";

import {
    formatDate,
    formatNumber
} from "../reports/reportUtils.js";

function ProductLotTable({ lots = [] }) {

    if (lots.length === 0) {

        return (
            <p className="text-sm text-slate-500">
                Sản phẩm này chưa có lô nào còn tồn trong kho.
            </p>
        );

    }

    return (

        <div className="overflow-x-auto rounded-xl border border-(--color-border) bg-white">

            <table className="w-full min-w-150">

                <thead className="border-b border-pink-100">

                <tr>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        STT
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        SỐ LÔ
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        HSD
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        TỒN LÔ
                    </th>

                    <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                        TRẠNG THÁI
                    </th>

                </tr>

                </thead>

                <tbody>

                {lots.map((lot, index) => (

                    <tr
                        key={lot.inventoryId}
                        className="border-b border-pink-100 last:border-b-0"
                    >

                        <td className="px-5 py-3 text-sm text-slate-700">
                            {index + 1}
                        </td>

                        <td className="px-5 py-3 text-sm font-medium text-slate-800">
                            {lot.lotNumber || "-"}
                        </td>

                        <td className="px-5 py-3 text-sm text-slate-700">
                            {formatDate(lot.expirationDate) || "-"}
                        </td>

                        <td className="px-5 py-3 text-right text-sm text-slate-700">
                            {formatNumber(lot.quantity)}
                        </td>

                        <td className="px-5 py-3 text-center">
                            <ExpiryStatusBadge status={lot.status} />
                        </td>

                    </tr>

                ))}

                </tbody>

            </table>

        </div>

    );

}

export default ProductLotTable;
