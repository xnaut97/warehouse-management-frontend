import Badge from "../common/Badge.jsx";
import MaterialActions from "./MaterialActions.jsx";
import SortableHeader from "../common/SortableHeader.jsx";

function MaterialTable({ materials, onEdit, onRefresh, sortField, sortDir, onSort, startIndex = 0 }) {
    const sortProps = { sortField, sortDir, onSort };

    return (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">
            <table className="min-w-[1080px] w-full">
                <thead className="border-b border-pink-100">
                <tr>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">STT</th>
                    <SortableHeader field="name" label="NVL" {...sortProps} className="text-left" />
                    <SortableHeader field="unit" label="ĐVT" {...sortProps} className="text-left" />
                    <SortableHeader field="supplierName" label="NHÀ CUNG CẤP" {...sortProps} className="text-left" />
                    <SortableHeader field="unitPrice" label="GIÁ TRUNG BÌNH" {...sortProps} className="text-center" />
                    <SortableHeader field="minimumStock" label="TỒN MIN" {...sortProps} className="text-center" />
                    <SortableHeader field="maximumStock" label="TỒN MAX" {...sortProps} className="text-center" />
                    <SortableHeader field="enabled" label="TRẠNG THÁI" {...sortProps} className="text-center" />
                </tr>
                </thead>

                <tbody>
                {materials.length === 0 ? (
                    <tr>
                        <td colSpan={8} className="py-12 text-center text-gray-500">
                            Không tìm thấy nguyên vật liệu.
                        </td>
                    </tr>
                ) : (
                    materials.map((material, index) => (
                        <tr
                            key={material.id}
                            className="border-t border-[var(--color-border)] transition hover:bg-pink-50/50"
                        >
                            <td className="px-6 py-4">{startIndex + index + 1}</td>
                            <td className="px-6 py-4">
                                <p className="font-semibold">{material.name}</p>
                                <p className="text-sm text-gray-500">{material.code}</p>
                            </td>
                            <td className="px-6 py-4">{material.unit}</td>
                            <td className="px-6 py-4">{material.supplierName || "-"}</td>
                            <td className="px-6 py-4 text-center">
                                {Number(material.unitPrice || 0).toLocaleString("vi-VN")} ₫
                            </td>
                            <td className="px-6 py-4 text-center">{material.minimumStock} {material.unit}</td>
                            <td className="px-6 py-4 text-center">{material.maximumStock} {material.unit}</td>
                            <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <Badge color={material.enabled ? "green" : "red"}>
                                        {material.enabled ? "Hoạt động" : "Đã khóa"}
                                    </Badge>
                                    <MaterialActions material={material} onEdit={onEdit} onRefresh={onRefresh} />
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

export default MaterialTable;
