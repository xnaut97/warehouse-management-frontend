import CustomerActions from "./CustomerActions.jsx";
import SortableHeader from "../common/SortableHeader.jsx";
import { customerGroupLabel } from "./customerConstants.js";

function CustomerTable({
                           customers,
                           onEdit,
                           onToggleStatus,
                           onDelete,
                           sortField,
                           sortDir,
                           onSort,
                       }) {
    const sortProps = { sortField, sortDir, onSort };

    return (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">

            <table className="min-w-[1080px] w-full text-left">

                <thead className="border-b border-pink-100 text-md text-slate-600">
                <tr>
                    <SortableHeader field="code"          label="Mã KH"           {...sortProps} className="text-left" />
                    <SortableHeader field="name"          label="Tên KH"          {...sortProps} className="text-left" />
                    <SortableHeader field="address"       label="Địa chỉ"         {...sortProps} className="text-left" />
                    <SortableHeader field="customerGroup" label="Nhóm khách hàng" {...sortProps} className="text-left" />
                    <SortableHeader field="receiverName"  label="Người nhận hàng" {...sortProps} className="text-left" />
                    <SortableHeader field="phone"         label="SĐT"             {...sortProps} className="text-left" />
                    <SortableHeader field="note"          label="Ghi chú"         {...sortProps} className="text-left" />
                    <th className="px-6 py-4 text-center font-semibold text-slate-700">Thao tác</th>
                </tr>
                </thead>

                <tbody>
                {customers.map((customer) => (
                    <tr
                        key={customer.id}
                        className="border-t border-(--color-border) transition hover:bg-pink-50/50"
                    >
                        <td className="px-6 py-4">{customer.code || "—"}</td>

                        <td className="px-6 py-4">
                            <p className="font-medium">{customer.name}</p>
                        </td>

                        <td className="px-6 py-4">{customer.address || "—"}</td>

                        <td className="px-6 py-4">{customerGroupLabel(customer.customerGroup) || "—"}</td>

                        <td className="px-6 py-4">{customer.receiverName || "—"}</td>

                        <td className="px-6 py-4">{customer.phone || "—"}</td>

                        <td className="px-6 py-4">
                            <p className="text-sm text-gray-500">{customer.note || "—"}</p>
                        </td>

                        <td className="px-6 py-4 text-center">
                            <CustomerActions
                                customer={customer}
                                onEdit={onEdit}
                                onToggleStatus={onToggleStatus}
                                onDelete={onDelete}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>

            </table>

        </div>
    );
}

export default CustomerTable;
