import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import stocktakingApi from "../../api/stocktakingApi.js";
import warehouseApi from "../../api/warehouseApi.js";

import Button from "../common/Button.jsx";

import { stocktakingTypeLabel } from "./stocktakingLabels.js";

const selectClassName = `
    w-full rounded-xl border border-gray-300 bg-white px-4 py-3
    text-slate-700 outline-none transition
    focus:border-(--color-primary) focus:ring-2 focus:ring-pink-100
    disabled:bg-gray-50
`;

function StocktakingForm({ onSuccess, onCancel }) {

    const [warehouses, setWarehouses] = useState([]);

    const [loadingData, setLoadingData] = useState(true);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        warehouseId: "",
        stocktakingDate: new Date().toISOString().split("T")[0],
        type: "PERIODIC",
        note: ""
    });

    useEffect(() => {

        const loadWarehouses = async () => {

            setLoadingData(true);

            try {

                const response = await warehouseApi.getAllWarehouses();

                const data = response.data?.data;

                const list = Array.isArray(data)
                    ? data
                    : data?.content ?? [];

                setWarehouses(
                    list.filter((warehouse) => warehouse.enabled !== false)
                );

            } catch (error) {

                toast.error(
                    error.response?.data?.message ||
                    "Không thể tải danh sách kho."
                );

            } finally {

                setLoadingData(false);

            }

        };

        loadWarehouses();

    }, []);

    const handleChange = (event) => {

        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!form.warehouseId) {

            toast.error("Vui lòng chọn kho kiểm kê.");

            return;

        }

        if (!form.stocktakingDate) {

            toast.error("Vui lòng chọn ngày kiểm kê.");

            return;

        }

        setLoading(true);

        try {

            const response = await stocktakingApi.create({
                warehouseId: Number(form.warehouseId),
                stocktakingDate: form.stocktakingDate,
                type: form.type,
                note: form.note.trim() || null
            });

            toast.success("Đã tạo phiếu kiểm kê.");

            onSuccess(response.data?.data?.id);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Không thể tạo phiếu kiểm kê."
            );

        } finally {

            setLoading(false);

        }

    };

    if (loadingData) {

        return (

            <div className="flex min-h-55 items-center justify-center">

                <p className="text-sm text-slate-500">
                    Đang tải dữ liệu...
                </p>

            </div>

        );

    }

    return (

        <form onSubmit={handleSubmit} className="space-y-6">

            <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Kho kiểm kê
                    <span className="text-red-500"> *</span>
                </label>

                <select
                    name="warehouseId"
                    value={form.warehouseId}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className={selectClassName}
                >

                    <option value="">
                        Chọn kho
                    </option>

                    {warehouses.map((warehouse) => (

                        <option key={warehouse.id} value={warehouse.id}>
                            {warehouse.name}
                        </option>

                    ))}

                </select>

            </div>

            <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Ngày kiểm kê
                    <span className="text-red-500"> *</span>
                </label>

                <input
                    type="date"
                    name="stocktakingDate"
                    value={form.stocktakingDate}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className={selectClassName}
                />

            </div>

            <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Loại kiểm kê
                </label>

                <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    disabled={loading}
                    className={selectClassName}
                >

                    {Object.entries(stocktakingTypeLabel).map(([value, label]) => (

                        <option key={value} value={value}>
                            {label}
                        </option>

                    ))}

                </select>

            </div>

            <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Ghi chú
                </label>

                <input
                    type="text"
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Không bắt buộc"
                    className={selectClassName}
                />

            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-(--color-border) pt-6 sm:flex-row sm:justify-end">

                <Button
                    variant="secondary"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Hủy
                </Button>

                <Button type="submit" disabled={loading}>
                    {loading ? "Đang tạo..." : "Tạo phiếu kiểm kê"}
                </Button>

            </div>

        </form>

    );

}

export default StocktakingForm;
