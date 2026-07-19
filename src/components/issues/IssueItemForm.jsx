import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import issueApi from "../../api/issueApi";
import materialApi from "../../api/materialApi";

function IssueItemForm({ issueId, item, onSuccess, onCancel }) {

    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        materialId: "",
        quantity: "",
        unitPrice: "",
    });

    useEffect(() => {
        loadMaterials();
    }, []);

    useEffect(() => {
        if (!item) return;
        setForm({
            materialId: item.materialId ?? "",
            quantity: item.quantity ?? "",
            unitPrice: item.unitPrice ?? "",
        });
    }, [item]);

    const loadMaterials = async () => {
        try {
            const response = await materialApi.getAllMaterials({ size: 1000 });
            const data = response.data.data;
            const list = Array.isArray(data) ? data : data?.content ?? [];
            setMaterials(list.filter((m) => m.enabled !== false));
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.quantity || Number(form.quantity) <= 0) {
            toast.error("Số lượng phải lớn hơn 0");
            return;
        }
        if (!form.unitPrice || Number(form.unitPrice) < 0) {
            toast.error("Đơn giá không hợp lệ");
            return;
        }

        setLoading(true);
        try {
            if (item) {
                // Update existing item — only quantity and unitPrice are editable
                await issueApi.updateItem(issueId, item.id, {
                    quantity: Number(form.quantity),
                    unitPrice: Number(form.unitPrice),
                });
                toast.success("Đã cập nhật hàng hóa");
            } else {
                // Add new item
                await issueApi.addItem(issueId, {
                    materialId: Number(form.materialId),
                    quantity: Number(form.quantity),
                    unitPrice: Number(form.unitPrice),
                });
                toast.success("Đã thêm hàng hóa");
            }
            onSuccess();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Thao tác thất bại"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">

            {/* Nguyên vật liệu — only shown when adding */}
            {!item && (
                <div>
                    <label className="mb-2 block font-medium">
                        Nguyên vật liệu <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="materialId"
                        value={form.materialId}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                    >
                        <option value="">Chọn nguyên vật liệu</option>
                        {materials.map((material) => (
                            <option key={material.id} value={material.id}>
                                [{material.code}] {material.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* When editing, show readonly material info */}
            {item && (
                <div>
                    <label className="mb-2 block font-medium">
                        Nguyên vật liệu
                    </label>
                    <div className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-slate-600">
                        [{item.materialCode}] {item.materialName}
                    </div>
                </div>
            )}

            {/* Số lượng */}
            <div>
                <label className="mb-2 block font-medium">
                    Số lượng <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                    min="0.001"
                    step="any"
                    placeholder="Nhập số lượng"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                />
            </div>

            {/* Đơn giá */}
            <div>
                <label className="mb-2 block font-medium">
                    Đơn giá (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    name="unitPrice"
                    value={form.unitPrice}
                    onChange={handleChange}
                    required
                    min="0"
                    step="any"
                    placeholder="Nhập đơn giá"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                />
            </div>

            {/* Preview thành tiền */}
            {form.quantity && form.unitPrice && (
                <div className="rounded-xl border border-pink-100 bg-pink-50 px-4 py-3">
                    <span className="text-sm text-slate-500">Thành tiền: </span>
                    <span className="font-semibold text-pink-600">
                        {(Number(form.quantity) * Number(form.unitPrice)).toLocaleString("vi-VN")} VNĐ
                    </span>
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="rounded-xl border px-6 py-3 transition hover:bg-gray-100 disabled:opacity-50"
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-pink-500 px-6 py-3 font-medium text-white transition hover:bg-pink-600 disabled:opacity-50"
                >
                    {loading
                        ? "Đang xử lý..."
                        : item
                            ? "Cập nhật hàng hóa"
                            : "Thêm hàng hóa"}
                </button>
            </div>

        </form>
    );
}

export default IssueItemForm;
