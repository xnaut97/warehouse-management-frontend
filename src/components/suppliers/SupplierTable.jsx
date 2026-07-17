import SupplierActions from "./SupplierActions.jsx";

function SupplierTable({

                           suppliers,

                           onEdit,

                           onRefresh

                       }) {

    return (

        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">

            <table className="min-w-[980px] w-full">

                <thead className="border-b border-pink-100">
                <tr>
                    <th className="px-6 py-4 text-left">
                        Tên
                    </th>

                    <th className="px-6 py-4 text-left">
                        Email
                    </th>

                    <th className="px-6 py-4 text-left">
                        Mã
                    </th>

                    <th className="px-6 py-4 text-left">
                        Người đại diện
                    </th>

                    <th className="px-6 py-4 text-left">
                        Số điện thoại
                    </th>

                    <th className="px-6 py-4 text-left">
                        Địa chỉ
                    </th>


                </tr>

                </thead>

                <tbody>

                {

                    suppliers.map((supplier) => (

                        <tr
                            key={supplier.id}
                            className="border-t border-(--color-border) hover:bg-pink-50/50 transition"
                        >

                            <td className="px-6 py-4">
                                <div>
                                    <p className="font-medium">
                                        {supplier.name}
                                    </p>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <p className="text-sm text-gray-500">

                                    {supplier.email}

                                </p>
                            </td>

                            <td className="px-6 py-4">

                                {supplier.code}

                            </td>

                            <td className="px-6 py-4">

                                {supplier.contactPerson}

                            </td>

                            <td className="px-6 py-4">

                                {supplier.phone}

                            </td>

                            <td className="px-6 py-4">

                                {supplier.address}

                            </td>

                            <td className="px-6 py-4 text-center">

                                <SupplierActions

                                    supplier={supplier}

                                    onEdit={onEdit}

                                    onRefresh={onRefresh}

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

export default SupplierTable;
