function ProductDetailCard({ product }) {
    const formatCurrency = (value) =>
        Number(value ?? 0).toLocaleString("vi-VN");

    return (
        <div className="rounded-xl bg-white p-4 shadow-sm sm:p-8">

            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">
                    Thông tin sản phẩm
                </h2>

                <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                        product.enabled
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    {product.enabled
                        ? "Hoạt động"
                        : "Đã khóa"}
                </span>
            </div>

            <div className="grid gap-5 text-sm sm:grid-cols-2">

                <div>
                    <p className="text-gray-500">
                        Mã sản phẩm
                    </p>

                    <p className="font-medium">
                        {product.code}
                    </p>
                </div>

                <div>
                    <p className="text-gray-500">
                        Tên sản phẩm
                    </p>

                    <p className="font-medium">
                        {product.name}
                    </p>
                </div>

                <div>
                    <p className="text-gray-500">
                        Đơn vị tính
                    </p>

                    <p className="font-medium">
                        {product.unit}
                    </p>
                </div>

                <div>
                    <p className="text-gray-500">
                        Phân loại
                    </p>

                    <p className="font-medium">
                        {product.category}
                    </p>
                </div>

                <div>
                    <p className="text-gray-500">
                        Giá trung bình
                    </p>

                    <p className="font-medium">
                        {formatCurrency(product.averagePrice)} ₫
                    </p>
                </div>

                <div>
                    <p className="text-gray-500">
                        Tồn tối thiểu
                    </p>

                    <p className="font-medium">
                        {product.minimumStock} {product.unit}
                    </p>
                </div>

                <div>
                    <p className="text-gray-500">
                        Tồn tối đa
                    </p>

                    <p className="font-medium">
                        {product.maximumStock} {product.unit}
                    </p>
                </div>

                <div className="sm:col-span-2">
                    <p className="text-gray-500">
                        Quy cách
                    </p>

                    <p className="font-medium">
                        {product.specification || "-"}
                    </p>
                </div>

            </div>
        </div>
    );
}

export default ProductDetailCard;