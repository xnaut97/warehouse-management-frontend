import Badge from "../common/Badge.jsx";
import MaterialActions from "./MaterialActions.jsx";

function MaterialTable({

                           materials,

                           onEdit,

                           onRefresh

                       }) {

    return (

        <div className="
            overflow-x-auto
            rounded-2xl
            border
            border-(--color-border)
            bg-white
            shadow-sm
        ">

            <table className="min-w-[980px] w-full">

                <thead className="border-b border-pink-100">

                <tr>

                    <th className="px-6 py-4 text-left">
                        Nguyên vật liệu
                    </th>

                    <th className="px-6 py-4 text-left">
                        Đơn vị tính
                    </th>

                    <th className="px-6 py-4 text-left">
                        Nhà cung cấp
                    </th>

                    <th className="px-6 py-4 text-right">
                        Đơn giá
                    </th>

                    <th className="px-6 py-4 text-right">
                        Tồn kho tối thiểu
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

                    materials.map((material) => (

                        <tr

                            key={material.id}

                            className="
                                    border-t
                                    border-[var(--color-border)]
                                    transition
                                    hover:bg-pink-50/50
                                "

                        >

                            <td className="px-6 py-4">

                                <div>

                                    <p className="font-semibold">

                                        {material.name}

                                    </p>

                                    <p className="text-sm text-gray-500">

                                        {material.code}

                                    </p>

                                </div>

                            </td>

                            <td className="px-6 py-4">

                                {material.unit}

                            </td>

                            <td className="px-6 py-4">

                                {material.supplierName}

                            </td>

                            <td className="px-6 py-4 text-right">

                                {Number(material.unitPrice).toLocaleString(
                                    "vi-VN"
                                )} ₫

                            </td>

                            <td className="px-6 py-4 text-right">

                                {material.minimumStock} {material.unit}

                            </td>

                            <td className="px-6 py-4 text-center">

                                <Badge

                                    color={
                                        material.enabled
                                            ? "green"
                                            : "red"
                                    }

                                >

                                    {
                                        material.enabled
                                            ? "Hoạt động"
                                            : "Đã khóa"
                                    }

                                </Badge>

                            </td>

                            <td className="px-6 py-4 text-center">

                                <MaterialActions

                                    material={material}

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

export default MaterialTable;
