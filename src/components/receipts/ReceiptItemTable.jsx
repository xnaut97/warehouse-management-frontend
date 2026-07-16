import { Pencil, Trash2 } from "lucide-react";


function ReceiptItemTable({
                              items,
                              status,
                              onUpdate,
                              onDelete
                          }) {

    const editable = status === "DRAFT";


    return (
        <div className="overflow-x-auto rounded-xl bg-white shadow">

            <table className="w-full">

                <thead className="border-b bg-gray-50">

                <tr>

                    <th className="p-3 text-left">
                        Mã nguyên vật liệu
                    </th>

                    <th className="p-3 text-left">
                        Tên nguyên vật liệu
                    </th>

                    <th className="p-3">
                        Số lượng
                    </th>

                    <th className="p-3">
                        Đơn giá
                    </th>

                    <th className="p-3">
                        Thành tiền
                    </th>

                    {
                        editable && (
                            <th className="p-3">
                                Thao tác
                            </th>
                        )
                    }

                </tr>

                </thead>


                <tbody>

                {
                    items.length === 0 ? (

                        <tr>

                            <td
                                colSpan={6}
                                className="p-5 text-center text-gray-500"
                            >
                                Không có mặt hàng nào
                            </td>

                        </tr>

                    ) : (

                        items.map(item => (

                            <tr
                                key={item.id}
                                className="border-b hover:bg-gray-50"
                            >

                                <td className="p-3">
                                    {item.materialCode}
                                </td>


                                <td>
                                    {item.materialName}
                                </td>


                                <td className="text-center">
                                    {item.quantity}
                                </td>


                                <td className="text-center">
                                    {item.unitPrice}
                                </td>


                                <td className="text-center">
                                    {item.amount}
                                </td>


                                {
                                    editable && (

                                        <td className="text-center">

                                            <div className="flex justify-center gap-3">

                                                <button
                                                    onClick={() => onUpdate(item)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <Pencil size={17}/>
                                                </button>


                                                <button
                                                    onClick={() => onDelete(item)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 size={17}/>
                                                </button>

                                            </div>

                                        </td>

                                    )
                                }

                            </tr>

                        ))

                    )
                }

                </tbody>

            </table>

        </div>
    );
}


export default ReceiptItemTable;
