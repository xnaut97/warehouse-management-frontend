import Badge from "../common/Badge.jsx";
import ProductActions from "./ProductActions.jsx";
import SortableHeader from "../common/SortableHeader.jsx";

function ProductTable({ products, onEdit, onRefresh, sortField, sortDir, onSort, startIndex = 0 }) {
    const sortProps = { sortField, sortDir, onSort };

    return (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">
            <table className="min-w-[1080px] w-full">
                <thead className="border-b border-pink-100">
                <tr>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">STT</th>
                    <SortableHeader field="name" label="SẢN PHẨM" {...sortProps} className="text-left" />
                    <SortableHeader field="unit" label="ĐVT" {...sortProps} className="text-left" />
                    <SortableHeader field="category" label="PHÂN LOẠI" {...sortProps} className="text-left" />
                    <SortableHeader field="averagePrice" label="GIÁ TRUNG BÌNH" {...sortProps} className="text-center" />
                    <SortableHeader field="minimumStock" label="TỒN MIN" {...sortProps} className="text-center" />
                    <SortableHeader field="maximumStock" label="TỒN MAX" {...sortProps} className="text-center" />
                    <SortableHeader field="enabled" label="TRẠNG THÁI" {...sortProps} className="text-center" />
                </tr>
                </thead>

                <tbody>
                {products.length === 0 ? (
                    <tr>
                        <td colSpan={8} className="py-12 text-center italic text-gray-500">
                            Không tìm thấy sản phẩm.
                        </td>
                    </tr>
                ) : (
                    products.map((product, index) => (
                        <tr
                            key={product.id}
                            className="border-t border-(--color-border) transition hover:bg-pink-50/50"
                        >
                            <td className="px-6 py-4">{startIndex + index + 1}</td>
                            <td className="px-6 py-4">
                                <p className="font-semibold">{product.name}</p>
                                <p className="text-sm text-gray-500">{product.code}</p>
                            </td>
                            <td className="px-6 py-4">{product.unit}</td>
                            <td className="px-6 py-4">{product.category || "-"}</td>
                            <td className="px-6 py-4 text-center">
                                {Number(product.averagePrice ?? product.sellingPrice ?? 0).toLocaleString("vi-VN")} ₫
                            </td>
                            <td className="px-6 py-4 text-center">{product.minimumStock ?? 0} {product.unit}</td>
                            <td className="px-6 py-4 text-center">{product.maximumStock ?? 0} {product.unit}</td>
                            <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <Badge color={product.enabled ? "green" : "red"}>
                                        {product.enabled ? "Hoạt động" : "Đã khóa"}
                                    </Badge>
                                    <ProductActions product={product} onEdit={onEdit} onRefresh={onRefresh} />
                                </div>
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
