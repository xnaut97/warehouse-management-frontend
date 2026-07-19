import CustomerActions from "./CustomerActions.jsx";
import SortableHeader from "../common/SortableHeader.jsx";

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

            <table className="min-w-[920px] w-full text-left">

                <thead className="border-b border-pink-100 text-md text-slate-600">
                <tr>
                    <SortableHeader field="name"    label="Tên khách hàng" {...sortProps} className="text-left" />
                    <SortableHeader field="address" label="Địa chỉ"        {...sortProps} className="text-left" />
                    <SortableHeader field="phone"   label="Số điện thoại"  {...sortProps} className="text-left" />
                    <SortableHeader field="email"   label="Email"           {...sortProps} className="text-left" />
                    <SortableHeader field="enabled" label="Trạng thái"     {...sortProps} className="text-center" />
                    <th className="px-6 py-4 text-center font-semibold text-slate-700">Thao tác</th>
                </tr>
                </thead>

                <tbody>
                {customers.map((customer) => (
                    <tr
                        key={customer.id}
                        className="border-t border-(--color-border) transition hover:bg-pink-50/50"
                    >
                        <td className="px-6 py-4">{customer.name}</td>

                        <td className="px-6 py-4">{customer.address || "-"}</td>

                        <td className="px-6 py-4">{customer.phone || "-"}</td>

                        <td className="px-6 py-4">{customer.email || "-"}</td>

                        <td className="px-6 py-4 text-center">
                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                                customer.enabled
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}>
                                {customer.enabled ? "Hoạt động" : "Đã khóa"}
                            </span>
                        </td>

                        <td className="px-6 py-4">
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
