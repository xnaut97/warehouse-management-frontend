import { Fragment } from "react";

import EmptyState from "../common/EmptyState.jsx";

import MaterialBOMStatusBadge from "./MaterialBOMStatusBadge.jsx";
import { formatQuantity, formatRatio } from "./bomFormat.js";

function MaterialBOMTable({ boms, onSelect }) {

    return (

        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">

            <table className="w-full min-w-250">

                <thead className="border-b border-pink-100">

                <tr>

                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                        MÃ BOM
                    </th>

                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                        NVL
                    </th>

                    <th className="px-6 py-4 text-right font-semibold text-slate-700">
                        ĐỊNH MỨC TIÊU HAO
                    </th>

                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                        ĐVT
                    </th>

                    <th className="px-6 py-4 text-right font-semibold text-slate-700">
                        TỶ LỆ PHỐI TRỘN
                    </th>

                    <th className="px-6 py-4 text-right font-semibold text-slate-700">
                        TỶ LỆ HAO HỤT TỐI ĐA
                    </th>

                    <th className="px-6 py-4 text-center font-semibold text-slate-700">
                        TRẠNG THÁI
                    </th>

                </tr>

                </thead>

                <tbody>

                {boms.length === 0 ? (

                    <tr>

                        <td colSpan={7}>

                            <EmptyState
                                title="Chưa có định mức nguyên vật liệu"
                                description="Không tìm thấy BOM nào phù hợp."
                            />

                        </td>

                    </tr>

                ) : (

                    boms.map((bom) => {

                        const items = bom.items ?? [];

                        const rowSpan = Math.max(items.length, 1);

                        return (

                            <Fragment key={bom.id}>

                                {(items.length === 0 ? [null] : items).map((item, index) => (

                                    <tr
                                        key={item ? item.id : `${bom.id}-empty`}
                                        onClick={() => onSelect(bom)}
                                        className="cursor-pointer border-b border-pink-100 transition hover:bg-pink-50"
                                    >

                                        {index === 0 && (

                                            <td
                                                rowSpan={rowSpan}
                                                className="border-r border-pink-100 px-6 py-4 align-top"
                                            >

                                                <p className="font-semibold text-(--color-primary-hover)">
                                                    {bom.code}
                                                </p>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    {bom.productName}
                                                </p>

                                            </td>

                                        )}

                                        {item ? (

                                            <>

                                                <td className="px-6 py-4 text-sm text-slate-700">

                                                    <span className="font-medium text-slate-800">
                                                        {item.materialCode}
                                                    </span>

                                                    <span className="text-slate-500">
                                                        {" "}· {item.materialName}
                                                    </span>

                                                </td>

                                                <td className="px-6 py-4 text-right text-sm text-slate-700">
                                                    {formatQuantity(item.consumptionQuantity)}
                                                </td>

                                                <td className="px-6 py-4 text-sm text-slate-700">
                                                    {item.unit || "—"}
                                                </td>

                                                <td className="px-6 py-4 text-right text-sm text-slate-700">
                                                    {formatRatio(item.mixingRatio)}
                                                </td>

                                                <td className="px-6 py-4 text-right text-sm text-slate-700">
                                                    {formatRatio(item.maxWasteRatio)}
                                                </td>

                                            </>

                                        ) : (

                                            <td
                                                colSpan={5}
                                                className="px-6 py-4 text-sm text-slate-500"
                                            >
                                                BOM chưa có nguyên vật liệu.
                                            </td>

                                        )}

                                        {index === 0 && (

                                            <td
                                                rowSpan={rowSpan}
                                                className="border-l border-pink-100 px-6 py-4 text-center align-top"
                                            >
                                                <MaterialBOMStatusBadge enabled={bom.enabled} />
                                            </td>

                                        )}

                                    </tr>

                                ))}

                            </Fragment>

                        );

                    })

                )}

                </tbody>

            </table>

        </div>

    );

}

export default MaterialBOMTable;
