import { Edit, Trash2 } from "lucide-react";

function IssueItemTable({ items, status, onUpdate, onDelete }) {
    const editable = status === "DRAFT";

    return (
        <div className="overflow-x-auto rounded-xl border border-pink-100 shadow">
            <table className="min-w-[760px] w-full">
                <thead className="bg-white">
                <tr className="border-b border-pink-100">
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                        Mã nguyên vật liệu
                    </th>

                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                        Tên nguyên vật liệu
                    </th>

                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                        ĐVT
                    </th>

                    <th className="px-6 py-4 text-center font-semibold text-slate-700">
                        Số lượng
                    </th>

                    {editable && (
                        <th className="w-32 px-6 py-4 text-center font-semibold text-slate-700">
                            Thao tác
                        </th>
                    )}
                </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 bg-white">
                {items.length === 0 ? (
                    <tr>
                        <td
                            colSpan={editable ? 5 : 4}
                            className="py-16 text-center text-slate-500"
                        >
                            Không có mặt hàng nào.
                        </td>
                    </tr>
                ) : (
                    items.map((item) => (
                        <tr
                            key={item.id}
                            className="transition hover:bg-pink-50"
                        >
                            <td className="px-6 py-4 text-slate-800">
                                {item.materialCode}
                            </td>

                            <td className="px-6 py-4 text-slate-700">
                                {item.materialName}
                            </td>

                            <td className="px-6 py-4 text-slate-700">
                                {item.unit ?? "-"}
                            </td>

                            <td className="px-6 py-4 text-center text-slate-700">
                                {item.quantity}
                            </td>

                            {editable && (
                                <td className="px-6 py-4">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onUpdate(item)}
                                            className="rounded-lg p-2 text-slate-500 transition hover:text-(--color-primary-hover)"
                                            title="Chỉnh sửa"
                                        >
                                            <Edit size={18} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => onDelete(item)}
                                            className="rounded-lg p-2 text-slate-500 transition hover:text-(--color-primary-hover)"
                                            title="Xóa"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}

export default IssueItemTable;