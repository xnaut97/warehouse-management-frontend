import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

function InventoryTable({ inventories }) {

    const navigate = useNavigate();

    return (

        <div className="overflow-x-auto rounded-xl border border-pink-100 bg-white shadow-sm">

            <table className="min-w-[720px] w-full">

                <thead className="border-b border-pink-100">

                <tr>

                    <th className="px-6 py-4 text-left">
                        Kho
                    </th>

                    <th className="px-6 py-4 text-left">
                        Mã
                    </th>

                    <th className="px-6 py-4 text-left">
                        Tên
                    </th>

                    <th className="px-6 py-4 text-left">
                        Tồn kho
                    </th>

                    {/*<th className="px-6 py-4 text-center">*/}
                    {/*    Thao tác*/}
                    {/*</th>*/}

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

                                <td className="px-6 py-4">
                                    {inventory.materialCode}
                                </td>

                                <td className="px-6 py-4">
                                    {inventory.materialName}
                                </td>

                                <td className="px-6 py-4">
                                    {inventory.quantity}
                                </td>

                                {/*<td className="px-6 py-4">*/}

                                {/*    <div className="flex justify-center">*/}

                                {/*        <button*/}
                                {/*            onClick={() => navigate(`/inventories/${inventory.id}`)}*/}
                                {/*            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-blue-600"*/}
                                {/*            title="Xem chi tiết"*/}
                                {/*        >*/}

                                {/*            <Eye size={18} />*/}

                                {/*        </button>*/}

                                {/*    </div>*/}

                                {/*</td>*/}

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
