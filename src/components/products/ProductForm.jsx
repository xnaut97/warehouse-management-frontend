import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import productApi from "../../api/productApi.js";

export const PRODUCT_CATEGORIES = [
    "Keo C1",
    "Keo 2",
];

const emptyForm = {
    code: "",
    name: "",
    specification: "",
    unit: "",
    category: PRODUCT_CATEGORIES[0],
    minimumStock: "",
    maximumStock: "",
    enabled: true,
};

function ProductForm({ product, onSuccess, onCancel }) {
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (!product) {
            setForm(emptyForm);
            return;
        }

        setForm({
            code: product.code || "",
            name: product.name || "",
            specification: product.specification || "",
            unit: product.unit || "",
            category: product.category || PRODUCT_CATEGORIES[0],
            minimumStock: product.minimumStock ?? "",
            maximumStock: product.maximumStock ?? "",
            enabled: product.enabled ?? true,
        });
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((current) => ({
            ...current,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const minimumStock = Number(form.minimumStock);
        const maximumStock = Number(form.maximumStock);

        if (maximumStock < minimumStock) {
            toast.error("Tồn max phải lớn hơn hoặc bằng tồn min");
            return;
        }

        const payload = {
            name: form.name.trim(),
            specification: form.specification.trim(),
            unit: form.unit.trim(),
            category: form.category,
            minimumStock,
            maximumStock,
        };

        try {
            if (product) {
                await productApi.updateProduct(product.id, {
                    ...payload,
                    enabled: form.enabled,
                });

                toast.success("Đã cập nhật sản phẩm thành công");
            } else {
                await productApi.createProduct({
                    ...payload,
                    code: form.code.trim(),
                });

                toast.success("Đã thêm sản phẩm thành công");
            }

            onSuccess();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Thao tác thất bại"
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {!product && (
                <div>
                    <label className="mb-2 block font-medium">
                        Mã sản phẩm
                    </label>

                    <input
                        type="text"
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                    />
                </div>
            )}

            <div>
                <label className="mb-2 block font-medium">
                    Tên sản phẩm
                </label>

                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                />
            </div>

            <div>
                <label className="mb-2 block font-medium">
                    Đơn vị tính
                </label>

                <input
                    type="text"
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                />
            </div>

            <div>
                <label className="mb-2 block font-medium">
                    Phân loại
                </label>

                <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                >
                    {PRODUCT_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block font-medium">
                        Tồn min
                    </label>

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        name="minimumStock"
                        value={form.minimumStock}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block font-medium">
                        Tồn max
                    </label>

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        name="maximumStock"
                        value={form.maximumStock}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                    />
                </div>
            </div>

            <div>
                <label className="mb-2 block font-medium">
                    Quy cách
                </label>

                <input
                    type="text"
                    name="specification"
                    value={form.specification}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                />
            </div>

            {product && (
                <label className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        name="enabled"
                        checked={Boolean(form.enabled)}
                        onChange={handleChange}
                        className="h-5 w-5 accent-pink-500"
                    />

                    <span>
                        Sản phẩm đang hoạt động
                    </span>
                </label>
            )}

            <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl border border-(--color-border) px-6 py-3 font-medium text-(--color-primary-hover) transition hover:bg-pink-50 hover:text-(--color-primary)"
                >
                    Hủy
                </button>

                <button
                    type="submit"
                    className="rounded-xl bg-(--color-primary-hover) px-6 py-3 font-medium text-white transition hover:bg-(--color-primary)"
                >
                    {product
                        ? "Cập nhật sản phẩm"
                        : "Thêm sản phẩm"}
                </button>
            </div>
        </form>
    );
}

export default ProductForm;