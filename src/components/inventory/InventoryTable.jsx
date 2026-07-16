import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

function InventoryTable({ inventories }) {

    const navigate = useNavigate();

    return (

        <div className="overflow-hidden rounded-xl border border-pink-100 bg-white shadow-sm">

            <table className="w-full">

                <thead className="border-b border-pink-100 bg-pink-50">

                <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Kho
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Mã NVL
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Tên nguyên vật liệu
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                        Tồn kho
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                        Thao tác
                    </th>

                </tr>

                </thead>

                <tbody>

                {
                    inventories.length === 0 ? (

                        <tr>

                            <td
                                colSpan={5}
                                className="px-6 py-10 text-center text-slate-500"
                            >
                                Không có dữ liệu
                            </td>

                        </tr>

                    ) : (

                        inventories.map((inventory) => (

                            <tr
                                key={inventory.id}
                                className="border-b border-pink-100 transition hover:bg-pink-50"
                            >

                                <td className="px-6 py-4">
                                    {inventory.warehouse}
                                </td>

                                <td className="px-6 py-4 font-medium">
                                    {inventory.materialCode}
                                </td>

                                <td className="px-6 py-4">
                                    {inventory.materialName}
                                </td>

                                <td className="px-6 py-4 text-right font-semibold">
                                    {inventory.quantity}
                                </td>

                                <td className="px-6 py-4">

                                    <div className="flex justify-center">

                                        <button
                                            onClick={() => navigate(`/inventories/${inventory.id}`)}
                                            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-blue-600"
                                            title="Xem chi tiết"
                                        >

                                            <Eye size={18} />

                                        </button>

                                    </div>

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

export default InventoryTable;