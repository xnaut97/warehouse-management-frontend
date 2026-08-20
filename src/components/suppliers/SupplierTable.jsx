import SupplierActions from "./SupplierActions.jsx";
import SortableHeader from "../common/SortableHeader.jsx";
import { supplierGroupLabel } from "./supplierConstants.js";

function SupplierTable({ suppliers, onEdit, onRefresh, sortField, sortDir, onSort }) {
    const sortProps = { sortField, sortDir, onSort };

    return (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">

            <table className="min-w-[1080px] w-full">

                <thead className="border-b border-pink-100">
                <tr>
                    <SortableHeader field="code"          label="Mã NCC"          {...sortProps} className="text-left" />
                    <SortableHeader field="name"          label="Tên NCC"         {...sortProps} className="text-left" />
                    <SortableHeader field="address"       label="Địa chỉ"         {...sortProps} className="text-left" />
                    <SortableHeader field="supplierGroup" label="Nhóm cung cấp"   {...sortProps} className="text-left" />
                    <SortableHeader field="contactPerson" label="Người liên hệ"   {...sortProps} className="text-left" />
                    <SortableHeader field="phone"         label="SĐT"             {...sortProps} className="text-left" />
                    <SortableHeader field="note"          label="Ghi chú"         {...sortProps} className="text-left" />
                    <th className="px-6 py-4 text-center font-semibold text-slate-700">Thao tác</th>
                </tr>
                </thead>

                <tbody>
                {suppliers.map((supplier) => (
                    <tr
                        key={supplier.id}
                        className="border-t border-(--color-border) hover:bg-pink-50/50 transition"
                    >
                        <td className="px-6 py-4">{supplier.code}</td>
                        <td className="px-6 py-4">
                            <p className="font-medium">{supplier.name}</p>
                        </td>
                        <td className="px-6 py-4">{supplier.address || "—"}</td>
                        <td className="px-6 py-4">{supplierGroupLabel(supplier.supplierGroup) || "—"}</td>
                        <td className="px-6 py-4">{supplier.contactPerson || "—"}</td>
                        <td className="px-6 py-4">{supplier.phone || "—"}</td>
                        <td className="px-6 py-4">
                            <p className="text-sm text-gray-500">{supplier.note || "—"}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                            <SupplierActions supplier={supplier} onEdit={onEdit} onRefresh={onRefresh} />
                        </td>
                    </tr>
                ))}
                </tbody>

            </table>

        </div>
    );
}

export default SupplierTable;
