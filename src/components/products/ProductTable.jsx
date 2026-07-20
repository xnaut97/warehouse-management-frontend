import Badge from "../common/Badge.jsx";
import ProductActions from "./ProductActions.jsx";
import SortableHeader from "../common/SortableHeader.jsx";

function ProductTable({ products, onEdit, onRefresh, sortField, sortDir, onSort }) {
    const sortProps = { sortField, sortDir, onSort };

    return (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">

            <table className="min-w-[920px] w-full">

                <thead className="border-b border-pink-100">
                <tr>
                    <SortableHeader field="name"          label="Tên"         {...sortProps} className="text-left" />
                    <SortableHeader field="code"          label="Mã"          {...sortProps} className="text-left" />
                    <SortableHeader field="specification" label="Thông số"    {...sortProps} className="text-left" />
                    <SortableHeader field="unit"          label="Đơn vị"      {...sortProps} className="text-left" />
                    <SortableHeader field="sellingPrice"  label="Giá bán"     {...sortProps} className="text-center" />
                    <SortableHeader field="enabled"       label="Trạng thái"  {...sortProps} className="text-center" />
                    <th className="px-6 py-4 text-center font-semibold text-slate-700">Thao tác</th>
                </tr>
                </thead>

                <tbody>
                {products.length === 0 ? (
                    <tr>
                        <td colSpan={7} className="py-12 text-center italic text-gray-500">
                            Không tìm thấy sản phẩm.
                        </td>
                    </tr>
                ) : (
                    products.map((product) => (
                        <tr
                            key={product.id}
                            className="border-t border-(--color-border) transition hover:bg-pink-50/50"
                        >
                            <td className="px-6 py-4">{product.name}</td>
                            <td className="px-6 py-4">{product.code}</td>
                            <td className="px-6 py-4">{product.specification}</td>
                            <td className="px-6 py-4">{product.unit}</td>
                            <td className="px-6 py-4 text-center">{product.sellingPrice} đ</td>
                            <td className="px-6 py-4 text-center">
                                <Badge color={product.enabled ? "green" : "red"}>
                                    {product.enabled ? "Hoạt động" : "Đã khóa"}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <ProductActions product={product} onEdit={onEdit} onRefresh={onRefresh} />
                            </td>
                        </tr>
                    ))
                )}
                </tbody>

            </table>

        </div>
    );
}

export default ProductTable;
