function IssueItemTable({ items }) {

    return (

        <div className="overflow-hidden rounded-xl border border-pink-100 bg-white shadow-sm">

            <table className="w-full">

                <thead className="border-b border-pink-100 bg-pink-50">

                <tr>

                    <th className="px-6 py-4 text-left">
                        Mã NVL
                    </th>

                    <th className="px-6 py-4 text-left">
                        Tên nguyên vật liệu
                    </th>

                    <th className="px-6 py-4 text-right">
                        Số lượng
                    </th>

                    <th className="px-6 py-4 text-right">
                        Đơn giá
                    </th>

                    <th className="px-6 py-4 text-right">
                        Thành tiền
                    </th>

                </tr>

                </thead>

                <tbody>

                {
                    items.length === 0 ? (

                        <tr>

                            <td
                                colSpan={5}
                                className="py-8 text-center text-slate-500"
                            >
                                Chưa có hàng hóa
                            </td>

                        </tr>

                    ) : (

                        items.map(item => (

                            <tr
                                key={item.id}
                                className="border-b border-pink-100 hover:bg-pink-50"
                            >

                                <td className="px-6 py-4">

                                    {item.materialCode}

                                </td>

                                <td className="px-6 py-4">

                                    {item.materialName}

                                </td>

                                <td className="px-6 py-4 text-right">

                                    {item.quantity}

                                </td>

                                <td className="px-6 py-4 text-right">

                                    {item.unitPrice}

                                </td>

                                <td className="px-6 py-4 text-right font-semibold">

                                    {item.amount}

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

export default IssueItemTable;