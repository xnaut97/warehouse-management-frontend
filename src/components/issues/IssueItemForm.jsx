import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import materialIssueApi from "../../api/materialIssueApi.js";
import materialApi from "../../api/materialApi";

function IssueItemForm({ issueId, item, existingItems = [], onSuccess, onCancel }) {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        materialId: "",
        quantity: "",
    });

    useEffect(() => {
        const loadMaterials = async () => {
            try {
                const response = await materialApi.getAllMaterials({
                    size: 1000,
                });

                const data = response.data?.data;

                const list = Array.isArray(data)
                    ? data
                    : data?.content ?? [];

                setMaterials(
                    list.filter((material) => material.enabled !== false)
                );
            } catch (error) {
                console.error(error);
                toast.error("Không thể tải danh sách nguyên vật liệu");
            }
        };

        loadMaterials();
    }, []);

    useEffect(() => {
        if (!item) {
            return;
        }

        setForm({
            materialId: item.materialId ?? "",
            quantity: item.quantity ?? "",
        });
    }, [item]);

    const usedMaterialIds = useMemo(
        () =>
            new Set(
                existingItems
                    .filter((existing) => existing.id !== item?.id)
                    .map((existing) => existing.materialId)
            ),
        [existingItems, item]
    );

    const availableMaterials = useMemo(
        () =>
            materials.filter(
                (material) => !usedMaterialIds.has(material.id)
            ),
        [materials, usedMaterialIds]
    );

    const noMaterialAvailable =
        !item &&
        materials.length > 0 &&
        availableMaterials.length === 0;

    const blockSubmit = loading || noMaterialAvailable;

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!item && !form.materialId) {
            toast.error("Vui lòng chọn nguyên vật liệu");
            return;
        }

        if (!form.quantity || Number(form.quantity) <= 0) {
            toast.error("Số lượng phải lớn hơn 0");
            return;
        }

        setLoading(true);

        try {
            if (item) {
                await materialIssueApi.updateItem(issueId, item.id, {
                    quantity: Number(form.quantity),
                });

                toast.success("Đã cập nhật mặt hàng");
            } else {
                await materialIssueApi.addItem(issueId, {
                    materialId: Number(form.materialId),
                    quantity: Number(form.quantity),
                });

                toast.success("Đã thêm mặt hàng");
            }

            onSuccess();
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Thao tác thất bại"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {!item ? (
                <div>
                    <label className="mb-2 block font-medium text-slate-700">
                        Nguyên vật liệu
                        <span className="text-red-500"> *</span>
                    </label>

                    <select
                        name="materialId"
                        value={form.materialId}
                        onChange={handleChange}
                        required
                        disabled={loading || noMaterialAvailable}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-(--color-primary) focus:ring-2 focus:ring-pink-100"
                    >
                        <option value="">
                            {noMaterialAvailable
                                ? "Đã thêm hết nguyên vật liệu"
                                : "Chọn nguyên vật liệu"}
                        </option>

                        {availableMaterials.map((material) => (
                            <option
                                key={material.id}
                                value={material.id}
                            >
                                [{material.code}] {material.name}
                            </option>
                        ))}
                    </select>

                    {noMaterialAvailable && (
                        <p className="mt-2 text-sm text-red-500">
                            Tất cả nguyên vật liệu đã có trong phiếu xuất này.
                        </p>
                    )}
                </div>
            ) : (
                <div>
                    <label className="mb-2 block font-medium text-slate-700">
                        Nguyên vật liệu
                    </label>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-slate-600">
                        [{item.materialCode}] {item.materialName}
                    </div>
                </div>
            )}

            <div>
                <label className="mb-2 block font-medium text-slate-700">
                    Số lượng
                    <span className="text-red-500"> *</span>
                </label>

                <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                    min="0.01"
                    step="any"
                    placeholder="Nhập số lượng"
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-(--color-primary) focus:ring-2 focus:ring-pink-100"
                />
            </div>

            <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="rounded-xl border border-(--color-border) px-6 py-3 font-medium text-(--color-primary-hover) transition hover:bg-pink-50 disabled:opacity-50"
                >
                    Hủy
                </button>

                <button
                    type="submit"
                    disabled={blockSubmit}
                    className="rounded-xl bg-(--color-primary-hover) px-6 py-3 font-medium text-white transition hover:bg-(--color-primary) disabled:opacity-50"
                >
                    {loading
                        ? "Đang xử lý..."
                        : item
                            ? "Cập nhật mặt hàng"
                            : "Thêm mặt hàng"}
                </button>
            </div>
        </form>
    );
}

export default IssueItemForm;