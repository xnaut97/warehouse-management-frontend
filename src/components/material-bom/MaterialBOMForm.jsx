import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import bomApi from "../../api/bomApi.js";
import materialApi from "../../api/materialApi.js";
import productApi from "../../api/productApi.js";

import Button from "../common/Button.jsx";
import Loading from "../common/Loading.jsx";

import { unwrapContent } from "../../utils/apiResponse.js";

const emptyItem = {
    materialId: "",
    consumptionQuantity: "",
    mixingRatio: "",
    maxWasteRatio: "",
};

const inputClass =
    "w-full rounded-xl border border-(--color-border) bg-white px-3 py-2.5 text-sm outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-pink-100";

function MaterialBOMForm({ bom, onSuccess, onCancel }) {

    const [products, setProducts] = useState([]);

    const [materials, setMaterials] = useState([]);

    const [loadingData, setLoadingData] = useState(true);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState(() => ({
        code: bom?.code ?? "",
        productId: bom?.productId ?? "",
    }));

    const [items, setItems] = useState(() =>
        bom?.items?.length
            ? bom.items.map((item) => ({
                materialId: item.materialId ?? "",
                consumptionQuantity: item.consumptionQuantity ?? "",
                mixingRatio: item.mixingRatio ?? "",
                maxWasteRatio: item.maxWasteRatio ?? "",
            }))
            : [{ ...emptyItem }]
    );

    useEffect(() => {

        Promise.all([
            productApi.getProducts({ size: 1000 }),
            materialApi.getAllMaterials({ size: 1000 }),
        ])

            .then(([productResponse, materialResponse]) => {

                setProducts(
                    unwrapContent(productResponse)
                        .filter((product) => product.enabled !== false)
                );

                setMaterials(
                    unwrapContent(materialResponse)
                        .filter((material) => material.enabled !== false)
                );

            })

            .catch((error) => {

                toast.error(
                    error.response?.data?.message ||
                    "Không thể tải danh sách sản phẩm và nguyên vật liệu"
                );

            })

            .finally(() => {

                setLoadingData(false);

            });

    }, []);

    const handleChange = (event) => {

        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

    };

    const handleItemChange = (index, field, value) => {

        setItems((previous) =>
            previous.map((item, position) =>
                position === index
                    ? { ...item, [field]: value }
                    : item
            )
        );

    };

    const addItem = () => {

        setItems((previous) => [...previous, { ...emptyItem }]);

    };

    const removeItem = (index) => {

        setItems((previous) =>
            previous.filter((item, position) => position !== index)
        );

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!items.length) {
            toast.error("BOM phải có ít nhất một nguyên vật liệu");
            return;
        }

        const materialIds = items.map((item) => String(item.materialId));

        if (new Set(materialIds).size !== materialIds.length) {
            toast.error("Một nguyên vật liệu không thể xuất hiện nhiều lần trong cùng một BOM");
            return;
        }

        const payload = {
            code: form.code.trim(),
            productId: Number(form.productId),
            items: items.map((item) => ({
                materialId: Number(item.materialId),
                consumptionQuantity: Number(item.consumptionQuantity),
                mixingRatio: Number(item.mixingRatio),
                maxWasteRatio: Number(item.maxWasteRatio),
            })),
        };

        setLoading(true);

        try {

            if (bom) {

                await bomApi.update(bom.id, payload);

                toast.success("Đã cập nhật định mức nguyên vật liệu");

            } else {

                await bomApi.create(payload);

                toast.success("Đã thêm định mức nguyên vật liệu");

            }

            onSuccess();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Thao tác thất bại"
            );

        } finally {

            setLoading(false);

        }

    };

    if (loadingData) {
        return <Loading rows={4} />;
    }

    return (

        <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid gap-4 sm:grid-cols-2">

                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Mã BOM
                        <span className="text-red-500"> *</span>
                    </label>

                    <input
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        placeholder="Nhập mã BOM"
                        className={inputClass}
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Sản phẩm
                        <span className="text-red-500"> *</span>
                    </label>

                    <select
                        name="productId"
                        value={form.productId}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className={inputClass}
                    >

                        <option value="">
                            Chọn sản phẩm
                        </option>

                        {products.map((product) => (

                            <option key={product.id} value={product.id}>
                                [{product.code}] {product.name}
                            </option>

                        ))}

                    </select>

                </div>

            </div>

            <div>

                <div className="mb-3 flex items-center justify-between">

                    <h3 className="font-semibold text-slate-800">
                        Nguyên vật liệu
                    </h3>

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={addItem}
                        disabled={loading}
                    >
                        <Plus size={16} />
                        Thêm dòng
                    </Button>

                </div>

                <div className="space-y-3">

                    {items.map((item, index) => (

                        <div
                            key={index}
                            className="rounded-xl border border-(--color-border) bg-pink-50/30 p-4"
                        >

                            <div className="grid gap-3 md:grid-cols-12">

                                <div className="md:col-span-4">

                                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                                        NVL
                                    </label>

                                    <select
                                        value={item.materialId}
                                        onChange={(event) =>
                                            handleItemChange(index, "materialId", event.target.value)
                                        }
                                        required
                                        disabled={loading}
                                        className={inputClass}
                                    >

                                        <option value="">
                                            Chọn nguyên vật liệu
                                        </option>

                                        {materials.map((material) => (

                                            <option key={material.id} value={material.id}>
                                                [{material.code}] {material.name}
                                            </option>

                                        ))}

                                    </select>

                                </div>

                                <div className="md:col-span-3">

                                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                                        Định mức tiêu hao
                                    </label>

                                    <input
                                        type="number"
                                        step="0.0001"
                                        min="0.0001"
                                        value={item.consumptionQuantity}
                                        onChange={(event) =>
                                            handleItemChange(index, "consumptionQuantity", event.target.value)
                                        }
                                        required
                                        disabled={loading}
                                        className={inputClass}
                                    />

                                </div>

                                <div className="md:col-span-2">

                                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                                        Tỷ lệ phối trộn (%)
                                    </label>

                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={item.mixingRatio}
                                        onChange={(event) =>
                                            handleItemChange(index, "mixingRatio", event.target.value)
                                        }
                                        required
                                        disabled={loading}
                                        className={inputClass}
                                    />

                                </div>

                                <div className="md:col-span-2">

                                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                                        Hao hụt tối đa (%)
                                    </label>

                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={item.maxWasteRatio}
                                        onChange={(event) =>
                                            handleItemChange(index, "maxWasteRatio", event.target.value)
                                        }
                                        required
                                        disabled={loading}
                                        className={inputClass}
                                    />

                                </div>

                                <div className="flex items-end md:col-span-1">

                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        disabled={loading || items.length === 1}
                                        title="Xóa dòng"
                                        className="rounded-lg p-2 text-slate-500 transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-(--color-border) pt-5 sm:flex-row sm:justify-end">

                <Button
                    variant="secondary"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Hủy
                </Button>

                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Đang xử lý..."
                        : bom
                            ? "Cập nhật"
                            : "Thêm mới"}
                </Button>

            </div>

        </form>

    );
}

export default MaterialBOMForm;
