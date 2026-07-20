import Badge from "../common/Badge.jsx";
import WarehouseActions from "./WarehouseActions.jsx";
import SortableHeader from "../common/SortableHeader.jsx";

function WarehouseTable({ warehouses, onEdit, onRefresh, sortField, sortDir, onSort }) {
    const sortProps = { sortField, sortDir, onSort };

    return (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">

            <table className="min-w-[920px] w-full">

                <thead className="border-b border-pink-100">
                <tr>
                    <SortableHeader field="name"        label="Kho"            {...sortProps} className="text-left" />
                    <SortableHeader field="code"        label="Mã"             {...sortProps} className="text-left" />
                    <SortableHeader field="managerName" label="Người quản lý"  {...sortProps} className="text-left" />
                    <SortableHeader field="address"     label="Địa chỉ"        {...sortProps} className="text-left" />
                    <SortableHeader field="enabled"     label="Trạng thái"     {...sortProps} className="text-center" />
                    <th className="px-6 py-4 text-center font-semibold text-slate-700">Thao tác</th>
                </tr>
                </thead>

                <tbody>
                {warehouses.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-500">
                            Không tìm thấy kho.
                        </td>
                    </tr>
                ) : (
                    warehouses.map((warehouse) => (
                        <tr
                            key={warehouse.id}
                            className="border-t border-[var(--color-border)] transition hover:bg-pink-50/50"
                        >
                            <td className="px-6 py-4">
                                <div>
                                    <p className="font-semibold">{warehouse.name}</p>
                                    <p className="text-sm text-gray-500">{warehouse.description || "-"}</p>
                                </div>
                            </td>
                            <td className="px-6 py-4">{warehouse.code}</td>
                            <td className="px-6 py-4">{warehouse.managerName || "-"}</td>
                            <td className="px-6 py-4">{warehouse.address || "-"}</td>
                            <td className="px-6 py-4 text-left">
                                <Badge color={warehouse.enabled ? "green" : "red"}>
                                    {warehouse.enabled ? "Hoạt động" : "Đã khóa"}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <WarehouseActions warehouse={warehouse} onEdit={onEdit} onRefresh={onRefresh} />
                            </td>
                        </tr>
                    ))
                )}
                </tbody>

            </table>

        </div>
    );
}

export default WarehouseTable;
