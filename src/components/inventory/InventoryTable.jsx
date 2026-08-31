import SortableHeader from "../common/SortableHeader.jsx";
import InventoryItemGroupBadge from "./InventoryItemGroupBadge.jsx";

function InventoryTable({ inventories, sortField, sortDir, onSort }) {
    const sortProps = { sortField, sortDir, onSort };

    return (
        <div className="overflow-x-auto rounded-xl border border-pink-100 bg-white shadow-sm">

            <table className="min-w-[880px] w-full">

                <thead className="border-b border-pink-100">
                <tr>
                    <SortableHeader field="warehouse" label="Kho"     {...sortProps} className="text-left" />
                    <SortableHeader field="itemGroup" label="Loại"    {...sortProps} className="text-left" />
                    <SortableHeader field="code"      label="Mã"      {...sortProps} className="text-left" />
                    <SortableHeader field="name"      label="Tên"     {...sortProps} className="text-left" />
                    <SortableHeader field="unit"      label="Đơn vị"  {...sortProps} className="text-left" />
                    <SortableHeader field="quantity"  label="Tồn kho" {...sortProps} className="text-left" />
                </tr>
                </thead>

                <tbody>
                {inventories.length === 0 ? (

                    <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                            Không có dữ liệu
                        </td>
                    </tr>

                ) : (

                    inventories.map((inventory) => (
                        <tr
                            key={`${inventory.itemGroup}-${inventory.warehouseId}-${inventory.materialId ?? inventory.productId}`}
                            className="border-b border-pink-100 transition hover:bg-pink-50"
                        >
                            <td className="px-6 py-4">{inventory.warehouse}</td>
                            <td className="px-6 py-4">
                                <InventoryItemGroupBadge itemGroup={inventory.itemGroup} />
                            </td>
                            <td className="px-6 py-4">{inventory.code}</td>
                            <td className="px-6 py-4">{inventory.name}</td>
                            <td className="px-6 py-4">{inventory.unit}</td>
                            <td className="px-6 py-4">{inventory.quantity}</td>
                        </tr>
                    ))

                )}
                </tbody>

            </table>

        </div>
    );
}

export default InventoryTable;
