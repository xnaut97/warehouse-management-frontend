import Badge from "../common/Badge.jsx";

import ProductActions from "./ProductActions.jsx";

function ProductTable({

                            products,

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

            <table className="min-w-[920px] w-full">

                <thead className="border-b border-pink-100">

                <tr>

                    <th className="px-6 py-4 text-left">
                        Tên
                    </th>

                    <th className="px-6 py-4 text-left">
                        Mã
                    </th>

                    <th className="px-6 py-4 text-left">
                        Thông số
                    </th>

                    <th className="px-6 py-4 text-left">
                        Đơn vị
                    </th>

                    <th className="px-6 py-4 text-center">
                        Giá bán
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

                    products.map((product) => (

                        <tr

                            key={product.id}

                            className="
                                border-t
                                border-[var(--color-border)]
                                transition
                                hover:bg-pink-50/50
                            "

                        >

                            <td className="px-6 py-4">
                                {product.name}
                            </td>

                            <td className="px-6 py-4">
                                {product.code}
                            </td>

                            <td className="px-6 py-4">

                                {product.specification}

                            </td>

                            <td className="px-6 py-4">

                                {product.unit}

                            </td>

                            <td className="px-6 py-4 text-center">

                                {product.sellingPrice} đ

                            </td>

                            <td className="px-6 py-4 text-center">

                                <Badge

                                    color={
                                        product.enabled
                                            ? "green"
                                            : "red"
                                    }

                                >

                                    {

                                        product.enabled
                                            ? "Hoạt động"
                                            : "Đã khóa"

                                    }

                                </Badge>

                            </td>

                            <td className="px-6 py-4 text-center">

                                <ProductActions

                                    product={product}

                                    onEdit={onEdit}

                                    onRefresh={onRefresh}

                                />

                            </td>

                        </tr>

                    ))

                }

                {

                    products.length === 0 &&

                    <tr>

                        <td

                            colSpan={6}

                            className="
                                italic
                                py-12-+
                                text-center
                                text-gray-500
                                p-10
                            "

                        >

                            Không tìm thấy sản phẩm.

                        </td>

                    </tr>

                }

                </tbody>

            </table>

        </div>

    );

}

export default ProductTable;
