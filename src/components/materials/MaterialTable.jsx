import Badge from "../common/Badge.jsx";
import MaterialActions from "./MaterialActions.jsx";
import SortableHeader from "../common/SortableHeader.jsx";

function MaterialTable({ materials, onEdit, onRefresh, sortField, sortDir, onSort }) {
    const sortProps = { sortField, sortDir, onSort };

    return (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">

            <table className="min-w-[980px] w-full">

                <thead className="border-b border-pink-100">
                <tr>
                    <SortableHeader field="name"         label="Nguyên vật liệu"    {...sortProps} className="text-left" />
                    <SortableHeader field="unit"         label="Đơn vị tính"        {...sortProps} className="text-left" />
                    <SortableHeader field="supplierName" label="Nhà cung cấp"       {...sortProps} className="text-left" />
                    <SortableHeader field="unitPrice"    label="Đơn giá"            {...sortProps} className="text-center" />
                    <SortableHeader field="minimumStock" label="Tồn kho tối thiểu"  {...sortProps} className="text-center" />
                    <SortableHeader field="enabled"      label="Trạng thái"         {...sortProps} className="text-center" />
                    <th className="px-6 py-4 text-center font-semibold text-slate-700">Thao tác</th>
                </tr>
                </thead>

                <tbody>
                {materials.map((material) => (
                    <tr
                        key={material.id}
                        className="border-t border-[var(--color-border)] transition hover:bg-pink-50/50"
                    >
                        <td className="px-6 py-4">
                            <div>
                                <p className="font-semibold">{material.name}</p>
                                <p className="text-sm text-gray-500">{material.code}</p>
                            </div>
                        </td>

                        <td className="px-6 py-4">{material.unit}</td>

                        <td className="px-6 py-4">{material.supplierName}</td>

                        <td className="px-6 py-4 text-center">
                            {Number(material.unitPrice).toLocaleString("vi-VN")} ₫
                        </td>

                        <td className="px-6 py-4 text-center">
                            {material.minimumStock} {material.unit}
                        </td>

                        <td className="px-6 py-4 text-center">
                            <Badge color={material.enabled ? "green" : "red"}>
                                {material.enabled ? "Hoạt động" : "Đã khóa"}
                            </Badge>
                        </td>

                        <td className="px-6 py-4 text-center">
                            <MaterialActions material={material} onEdit={onEdit} onRefresh={onRefresh} />
                        </td>
                    </tr>
                ))}
                </tbody>

            </table>

        </div>
    );
}

export default MaterialTable;
