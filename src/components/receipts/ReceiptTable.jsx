import { Eye } from "lucide-react";

import ReceiptStatusBadge from "./ReceiptStatusBadge.jsx";


function ReceiptTable({
                          receipts,
                          onView
                      }) {


    return (

        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">

            <table className="min-w-[860px] w-full">

                <thead className="border-b border-pink-100">

                <tr>

                    <th className="px-6 py-4 text-left">
                        Số phiếu nhập
                    </th>


                    <th className="px-6 py-4 text-left">
                        Nhà cung cấp
                    </th>


                    <th className="px-6 py-4 text-left">
                        Kho
                    </th>


                    <th className="px-6 py-4 text-left">
                        Ngày
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
                    receipts.map((receipt) => (

                        <tr
                            key={receipt.id}
                            className="border-b border-pink-100 transition hover:bg-pink-50"
                        >

                            <td className="px-6 py-4 text-sm text-slate-700">
                                {receipt.receiptNo}
                            </td>


                            <td className="px-6 py-4 text-sm text-slate-700">
                                {receipt.supplier}
                            </td>


                            <td className="px-6 py-4 text-sm text-slate-700">
                                {receipt.warehouse}
                            </td>


                            <td className="px-6 py-4 text-sm text-slate-700">
                                {receipt.receiptDate}
                            </td>


                            <td className="px-6 py-4 text-center">
                                <ReceiptStatusBadge
                                    status={receipt.status}
                                />
                            </td>


                            <td className="px-6 py-4">

                                <div className="flex justify-center">

                                    <button
                                        onClick={() => onView(receipt.id)}
                                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-blue-600"
                                    >

                                        <Eye size={18}/>

                                    </button>

                                </div>

                            </td>


                        </tr>

                    ))
                }

                </tbody>

            </table>

        </div>

    );

}


export default ReceiptTable;
