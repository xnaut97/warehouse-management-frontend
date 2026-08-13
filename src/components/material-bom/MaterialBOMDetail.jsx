import { Pencil, Power, PowerOff } from "lucide-react";

import Button from "../common/Button.jsx";
import EmptyState from "../common/EmptyState.jsx";

import MaterialBOMStatusBadge from "./MaterialBOMStatusBadge.jsx";
import { formatQuantity, formatRatio } from "./bomFormat.js";

function Field({ label, children }) {

    return (

        <div>

            <p className="text-sm text-slate-500">
                {label}
            </p>

            <div className="mt-1 font-semibold text-slate-800">
                {children}
            </div>

        </div>

    );

}

function MaterialBOMDetail({ bom, onEdit, onToggleStatus }) {

    const items = bom.items ?? [];

    return (

        <div className="space-y-6">

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

                <Field label="Mã BOM">
                    {bom.code}
                </Field>

                <Field label="Sản phẩm">
                    {bom.productCode
                        ? `[${bom.productCode}] ${bom.productName}`
                        : bom.productName || "—"}
                </Field>

                <Field label="Trạng thái">
                    <MaterialBOMStatusBadge enabled={bom.enabled} />
                </Field>

            </div>

            <div className="overflow-x-auto rounded-xl border border-(--color-border)">

                <table className="w-full min-w-175 text-sm">

                    <thead className="border-b border-pink-100">

                    <tr>

                        <th className="px-4 py-3 text-left font-semibold text-slate-700">
                            NVL
                        </th>

                        <th className="px-4 py-3 text-right font-semibold text-slate-700">
                            ĐỊNH MỨC TIÊU HAO
                        </th>

                        <th className="px-4 py-3 text-left font-semibold text-slate-700">
                            ĐVT
                        </th>

                        <th className="px-4 py-3 text-right font-semibold text-slate-700">
                            TỶ LỆ PHỐI TRỘN
                        </th>

                        <th className="px-4 py-3 text-right font-semibold text-slate-700">
                            TỶ LỆ HAO HỤT TỐI ĐA
                        </th>

                    </tr>

                    </thead>

                    <tbody>

                    {items.length === 0 ? (

                        <tr>

                            <td colSpan={5}>

                                <EmptyState
                                    title="Chưa có nguyên vật liệu"
                                    description="BOM này chưa khai báo nguyên vật liệu nào."
                                />

                            </td>

                        </tr>

                    ) : (

                        items.map((item) => (

                            <tr
                                key={item.id}
                                className="border-b border-pink-100 last:border-b-0"
                            >

                                <td className="px-4 py-3">

                                    <span className="font-medium text-slate-800">
                                        {item.materialCode}
                                    </span>

                                    <span className="text-slate-500">
                                        {" "}· {item.materialName}
                                    </span>

                                </td>

                                <td className="px-4 py-3 text-right text-slate-700">
                                    {formatQuantity(item.consumptionQuantity)}
                                </td>

                                <td className="px-4 py-3 text-slate-700">
                                    {item.unit || "—"}
                                </td>

                                <td className="px-4 py-3 text-right text-slate-700">
                                    {formatRatio(item.mixingRatio)}
                                </td>

                                <td className="px-4 py-3 text-right text-slate-700">
                                    {formatRatio(item.maxWasteRatio)}
                                </td>

                            </tr>

                        ))

                    )}

                    </tbody>

                </table>

            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-(--color-border) pt-5 sm:flex-row sm:justify-end">

                <Button
                    variant="secondary"
                    onClick={onToggleStatus}
                >
                    {bom.enabled ? (
                        <>
                            <PowerOff size={18} />
                            Ngừng áp dụng
                        </>
                    ) : (
                        <>
                            <Power size={18} />
                            Áp dụng lại
                        </>
                    )}
                </Button>

                <Button onClick={onEdit}>
                    <Pencil size={18} />
                    Chỉnh sửa
                </Button>

            </div>

        </div>

    );

}

export default MaterialBOMDetail;
