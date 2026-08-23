import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import materialIssueApi from "../../api/materialIssueApi.js";
import materialApi from "../../api/materialApi";
import inventoryApi from "../../api/inventoryApi.js";

import { unwrapContent } from "../../utils/apiResponse.js";
import { formatNumber } from "../reports/reportUtils.js";

function IssueItemForm({ issueId, warehouseId, item, existingItems = [], onSuccess, onCancel }) {
    const [materials, setMaterials] = useState([]);
    const [materialsLoading, setMaterialsLoading] = useState(true);
    const [materialsError, setMaterialsError] = useState("");
    const [loading, setLoading] = useState(false);

    // Inventory of the warehouse this voucher issues from. It is both the
    // source of the selectable materials and the source of the stock shown,
    // so the dropdown can never offer what the warehouse does not hold.
    const [inventories, setInventories] = useState([]);
    const [inventoriesLoading, setInventoriesLoading] = useState(
        Boolean(warehouseId)
    );

    const [form, setForm] = useState({
        materialId: "",
        quantity: "",
    });

    useEffect(() => {
        const loadMaterials = async () => {
            setMaterialsLoading(true);

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

                setMaterialsError("");
            } catch (error) {
                console.error(error);

                // Surface the real backend reason (e.g. missing permission)
                // instead of leaving an empty dropdown behind.
                const message =
                    error.response?.data?.message ||
                    "Không thể tải danh sách nguyên vật liệu";

                setMaterials([]);
                setMaterialsError(message);

                toast.error(message);
            } finally {
                setMaterialsLoading(false);
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

    const selectedMaterialId = item
        ? item.materialId
        : form.materialId;

    useEffect(() => {
        if (!warehouseId) {
            return;
        }

        let active = true;

        inventoryApi
            .getAll({
                warehouseId,
                size: 1000,
            })
            .then((response) => {
                if (!active) {
                    return;
                }

                setInventories(unwrapContent(response));
            })
            .catch((error) => {
                if (!active) {
                    return;
                }

                setInventories([]);

                toast.error(
                    error.response?.data?.message ||
                    "Không thể tải tồn kho nguyên vật liệu"
                );
            })
            .finally(() => {
                if (active) {
                    setInventoriesLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [warehouseId]);

    // Stock of the issue warehouse keyed by the same material id the dropdown
    // submits, so what is displayed and what the backend validates agree.
    const stockByMaterialId = useMemo(() => {
        const totals = new Map();

        inventories.forEach((inventory) => {
            totals.set(
                String(inventory.materialId),
                Number(inventory.quantity ?? 0)
            );
        });

        return totals;
    }, [inventories]);

    // Only materials the issue warehouse actually holds can be issued from it.
    const selectableMaterials = useMemo(
        () =>
            materials.filter((material) =>
                stockByMaterialId.has(String(material.id))
            ),
        [materials, stockByMaterialId]
    );

    const loadingStock =
        Boolean(warehouseId) &&
        Boolean(selectedMaterialId) &&
        inventoriesLoading;

    const stock =
        !selectedMaterialId || loadingStock
            ? null
            : stockByMaterialId.get(String(selectedMaterialId)) ?? 0;

    // Quantity the rest of this voucher already takes from the same material.
    const alreadyIssued = useMemo(
        () =>
            existingItems
                .filter((existing) => existing.id !== item?.id)
                .filter(
                    (existing) =>
                        String(existing.materialId) ===
                        String(selectedMaterialId)
                )
                .reduce(
                    (total, existing) => total + Number(existing.quantity ?? 0),
                    0
                ),
        [existingItems, item, selectedMaterialId]
    );

    const availableQuantity =
        stock === null || loadingStock
            ? null
            : Math.max(0, stock - alreadyIssued);

    const quantityError = useMemo(() => {
        if (form.quantity === "") {
            return "";
        }

        const quantity = Number(form.quantity);

        if (Number.isNaN(quantity) || quantity <= 0) {
            return "Số lượng phải lớn hơn 0";
        }

        if (availableQuantity === null) {
            return "";
        }

        if (quantity > availableQuantity) {
            return `Số lượng vượt quá tồn kho khả dụng (${formatNumber(availableQuantity)}).`;
        }

        return "";
    }, [form.quantity, availableQuantity]);

    const noStockAvailable =
        Boolean(warehouseId) &&
        Boolean(selectedMaterialId) &&
        !loadingStock &&
        availableQuantity === 0;

    const blockSubmit =
        loading ||
        Boolean(quantityError) ||
        noStockAvailable ||
        (!item &&
            (materialsLoading ||
                inventoriesLoading ||
                Boolean(materialsError)));

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

        if (quantityError) {
            toast.error(quantityError);
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
                        disabled={
                            loading ||
                            materialsLoading ||
                            inventoriesLoading ||
                            Boolean(materialsError)
                        }
                        aria-invalid={Boolean(materialsError)}
                        className={
                            materialsError
                                ? "w-full rounded-xl border border-red-400 bg-white px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                : "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-(--color-primary) focus:ring-2 focus:ring-pink-100"
                        }
                    >
                        <option value="">
                            {materialsLoading || inventoriesLoading
                                ? "Đang tải nguyên vật liệu..."
                                : materialsError
                                    ? "Không tải được nguyên vật liệu"
                                    : "Chọn nguyên vật liệu"}
                        </option>

                        {selectableMaterials.map((material) => (
                            <option
                                key={material.id}
                                value={material.id}
                            >
                                [{material.code}] {material.name}
                            </option>
                        ))}
                    </select>

                    {materialsError && (
                        <p className="mt-2 text-sm text-red-500">
                            {materialsError}
                        </p>
                    )}

                    {!materialsLoading &&
                        !inventoriesLoading &&
                        !materialsError &&
                        selectableMaterials.length === 0 && (
                            <p className="mt-2 text-sm text-slate-500">
                                Chưa có nguyên vật liệu nào khả dụng.
                            </p>
                        )}

                    {noStockAvailable && (
                        <p className="mt-2 text-sm text-red-500">
                            Nguyên vật liệu không còn tồn kho khả dụng trong kho của phiếu này.
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

                    {noStockAvailable && (
                        <p className="mt-2 text-sm text-red-500">
                            Nguyên vật liệu không còn tồn kho khả dụng trong kho của phiếu này.
                        </p>
                    )}
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
                    max={
                        availableQuantity !== null
                            ? availableQuantity
                            : undefined
                    }
                    placeholder="Nhập số lượng"
                    disabled={loading}
                    aria-invalid={Boolean(quantityError)}
                    className={
                        quantityError
                            ? "w-full rounded-xl border border-red-400 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                            : "w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-(--color-primary) focus:ring-2 focus:ring-pink-100"
                    }
                />

                {quantityError ? (
                    <p className="mt-2 text-sm text-red-500">
                        {quantityError}
                    </p>
                ) : (
                    availableQuantity !== null && (
                        <p className="mt-2 text-sm text-slate-500">
                            Tồn kho khả dụng: {formatNumber(availableQuantity)}
                            {item?.unit ? ` ${item.unit}` : ""}
                        </p>
                    )
                )}
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