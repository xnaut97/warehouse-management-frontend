import SupplierActions from "./SupplierActions.jsx";
import SortableHeader from "../common/SortableHeader.jsx";

function SupplierTable({ suppliers, onEdit, onRefresh, sortField, sortDir, onSort }) {
    const sortProps = { sortField, sortDir, onSort };

    return (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">

            <table className="min-w-[980px] w-full">

                <thead className="border-b border-pink-100">
                <tr>
                    <SortableHeader field="name"          label="Tên"             {...sortProps} className="text-left" />
                    <SortableHeader field="email"         label="Email"           {...sortProps} className="text-left" />
                    <SortableHeader field="code"          label="Mã"              {...sortProps} className="text-left" />
                    <SortableHeader field="contactPerson" label="Người đại diện"  {...sortProps} className="text-left" />
                    <SortableHeader field="phone"         label="Số điện thoại"   {...sortProps} className="text-left" />
                    <SortableHeader field="address"       label="Địa chỉ"         {...sortProps} className="text-left" />
                    <th className="px-6 py-4 text-center font-semibold text-slate-700">Thao tác</th>
                </tr>
                </thead>

                <tbody>
                {suppliers.map((supplier) => (
                    <tr
                        key={supplier.id}
                        className="border-t border-(--color-border) hover:bg-pink-50/50 transition"
                    >
                        <td className="px-6 py-4">
                            <p className="font-medium">{supplier.name}</p>
                        </td>
                        <td className="px-6 py-4">
                            <p className="text-sm text-gray-500">{supplier.email}</p>
                        </td>
                        <td className="px-6 py-4">{supplier.code}</td>
                        <td className="px-6 py-4">{supplier.contactPerson}</td>
                        <td className="px-6 py-4">{supplier.phone}</td>
                        <td className="px-6 py-4">{supplier.address}</td>
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
