import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import materialApi from "../../api/materialApi.js";
import supplierApi from "../../api/supplierApi.js";

const emptyForm = {
    code: "",
    name: "",
    unit: "",
    minimumStock: "",
    maximumStock: "",
    supplierId: "",
};

function MaterialForm({ material, onSuccess, onCancel }) {
    const [suppliers, setSuppliers] = useState([]);
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        loadSuppliers();
    }, []);

    useEffect(() => {
        if (!material) {
            setForm(emptyForm);
            return;
        }

        setForm({
            code: material.code || "",
            name: material.name || "",
            unit: material.unit || "",
            minimumStock: material.minimumStock ?? "",
            maximumStock: material.maximumStock ?? "",
            supplierId: material.supplierId || "",
        });
    }, [material]);

    const loadSuppliers = async () => {
        try {
            const response = await supplierApi.getAllSuppliers();
            setSuppliers(response.data.data.content);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Number(form.maximumStock) < Number(form.minimumStock)) {
            toast.error("Tồn max phải lớn hơn hoặc bằng tồn min");
            return;
        }

        const payload = {
            ...form,
            minimumStock: Number(form.minimumStock),
            maximumStock: Number(form.maximumStock),
            supplierId: Number(form.supplierId),
        };

        try {
            if (material) {
                await materialApi.updateMaterial(material.id, payload);
                toast.success("Đã cập nhật nguyên vật liệu thành công");
            } else {
                await materialApi.createMaterial(payload);
                toast.success("Đã thêm nguyên vật liệu thành công");
            }

            onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || "Thao tác thất bại");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <input
                name="code"
                placeholder="Mã NVL"
                value={form.code}
                onChange={handleChange}
                required
                className="w-full rounded-xl border px-4 py-3"
            />

            <input
                name="name"
                placeholder="Tên nguyên vật liệu"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border px-4 py-3"
            />

            <input
                name="unit"
                placeholder="Đơn vị tính"
                value={form.unit}
                onChange={handleChange}
                required
                className="w-full rounded-xl border px-4 py-3"
            />

            <div>
                <input
                    type="text"
                    readOnly
                    disabled
                    placeholder="Giá trung bình"
                    value={
                        material
                            ? `${Number(material.unitPrice || 0).toLocaleString("vi-VN")} ₫`
                            : ""
                    }
                    className="w-full rounded-xl border bg-gray-100 px-4 py-3 text-gray-500"
                />

                <p className="mt-1 text-xs text-gray-500">
                    Giá trung bình được tính tự động từ các phiếu nhập đã xác nhận
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="minimumStock"
                    placeholder="Tồn min"
                    value={form.minimumStock}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border px-4 py-3"
                />

                <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="maximumStock"
                    placeholder="Tồn max"
                    value={form.maximumStock}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border px-4 py-3"
                />
            </div>

            <select
                name="supplierId"
                value={form.supplierId}
                onChange={handleChange}
                required
                className="w-full rounded-xl border px-4 py-3"
            >
                <option value="">Chọn nhà cung cấp</option>
                {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                    </option>
                ))}
            </select>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl text-(--color-primary-hover) border border-(--color-border) px-6 py-3 font-medium transition hover:bg-pink-50 hover:text-(--color-primary) disabled:opacity-50"
                >
                    Hủy
                </button>

                <button
                    type="submit"
                    className="rounded-xl bg-(--color-primary-hover) px-6 py-3 font-medium text-white transition hover:bg-(--color-primary) disabled:opacity-50"
                >
                    {material ? "Cập nhật" : "Thêm mới"}
                </button>
            </div>
        </form>
    );
}

export default MaterialForm;
