import CustomerActions from "./CustomerActions.jsx";


function CustomerTable({
                           customers,
                           onEdit,
                           onToggleStatus,
                           onDelete
                       }) {


    return (

        <div className="overflow-hidden rounded-2xl border border-(--color-border) bg-white shadow-sm">


            <table className="w-full text-left">


                <thead className="border-b border-pink-100 text-md text-slate-600">

                <tr>

                    <th className="px-6 py-4">
                        Tên khách hàng
                    </th>

                    <th className="px-6 py-4">
                        Địa chỉ
                    </th>

                    <th className="px-6 py-4">
                        Số điện thoại
                    </th>

                    <th className="px-6 py-4">
                        Email
                    </th>

                    <th className="px-6 py-4 text-center">
                        Trạng thái
                    </th>

                    <th className="px-6 py-4 text-center">
                        Thao tác
                    </th>

                </tr>

                </thead>


                <tbody>

                {
                    customers.map((customer) => (

                        <tr
                            key={customer.id}
                            className="border-t border-(--color-border) transition hover:bg-pink-50/50"
                        >

                            <td className="px-6 py-4">
                                {customer.name}
                            </td>


                            <td className="px-6 py-4">
                                {customer.address || "-"}
                            </td>


                            <td className="px-6 py-4">
                                {customer.phone || "-"}
                            </td>


                            <td className="px-6 py-4">
                                {customer.email || "-"}
                            </td>


                            <td className="px-6 py-4 text-center">

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                        customer.enabled
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >

                                    {
                                        customer.enabled
                                            ? "Hoạt động"
                                            : "Đã khóa"
                                    }

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

                    ))
                }

                </tbody>


            </table>


        </div>

    );

}


export default CustomerTable;