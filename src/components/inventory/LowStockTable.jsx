import StockStatusBadge from "../../components/inventory/StockStatusBadge";

function LowStockTable({ items }) {

    return (

        <div className="overflow-hidden rounded-xl border border-pink-100 bg-white shadow-sm">

            <table className="w-full">

                <thead className="border-b border-pink-100 bg-pink-50">

                <tr>

                    <th className="px-6 py-4 text-left">
                        Kho
                    </th>

                    <th className="px-6 py-4 text-left">
                        Mã NVL
                    </th>

                    <th className="px-6 py-4 text-left">
                        Tên nguyên vật liệu
                    </th>

                    <th className="px-6 py-4 text-right">
                        Tồn hiện tại
                    </th>

                    <th className="px-6 py-4 text-right">
                        Tồn tối thiểu
                    </th>

                    <th className="px-6 py-4 text-center">
                        Đơn vị
                    </th>

                    <th className="px-6 py-4 text-center">
                        Trạng thái
                    </th>

                </tr>

                </thead>

                <tbody>

                {
                    items.length === 0 ? (

                        <tr>

                            <td
                                colSpan={7}
                                className="px-6 py-10 text-center text-slate-500"
                            >
                                Không có nguyên vật liệu nào dưới mức tồn kho tối thiểu.
                            </td>

                        </tr>

                    ) : (

                        items.map(item => (

                            <tr
                                key={item.inventoryId}
                                className="border-b border-pink-100 hover:bg-pink-50 transition"
                            >

                                <td className="px-6 py-4">

                                    {item.warehouse}

                                </td>

                                <td className="px-6 py-4 font-medium">

                                    {item.materialCode}

                                </td>

                                <td className="px-6 py-4">

                                    {item.materialName}

                                </td>

                                <td className="px-6 py-4 text-right font-semibold text-red-600">

                                    {item.currentStock}

                                </td>

                                <td className="px-6 py-4 text-right">

                                    {item.minimumStock}

                                </td>

                                <td className="px-6 py-4 text-center">

                                    {item.unit}

                                </td>

                                <td className="px-6 py-4 text-center">

                                    <StockStatusBadge
                                        status={item.status}
                                    />

                                </td>

                            </tr>

                        ))

                    )

                }

                </tbody>

            </table>

        </div>

    );

}

export default LowStockTable;