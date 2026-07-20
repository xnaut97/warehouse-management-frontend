import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import receiptApi from "../../api/receiptApi";
import warehouseApi from "../../api/warehouseApi";
import supplierApi from "../../api/supplierApi";

function ReceiptForm({ receipt, onSuccess, onCancel }) {

    const [warehouses, setWarehouses] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        supplierId: "",
        warehouseId: "",
        receiptDate: new Date().toISOString().split("T")[0],
    });

    useEffect(() => {
        loadWarehouses();
        loadSuppliers();
    }, []);

    useEffect(() => {
        if (!receipt) return;
        setForm({
            supplierId: receipt.supplierId ?? "",
            warehouseId: receipt.warehouseId ?? "",
            receiptDate: receipt.receiptDate ?? new Date().toISOString().split("T")[0],
        });
    }, [receipt]);

    const loadWarehouses = async () => {
        try {
            const response = await warehouseApi.getAllWarehouses();
            setWarehouses(
                response.data.data.content.filter((w) => w.enabled)
            );
        } catch (error) {
            console.error(error);
        }
    };

    const loadSuppliers = async () => {
        try {
            const response = await supplierApi.getAllSuppliers();
            const data = response.data.data;
            const list = Array.isArray(data) ? data : data?.content ?? [];
            setSuppliers(list.filter((s) => s.enabled !== false));
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
        setLoading(true);
        try {
            const payload = {
                supplierId: Number(form.supplierId),
                warehouseId: Number(form.warehouseId),
                receiptDate: form.receiptDate,
            };

            if (receipt) {
                await receiptApi.update(receipt.id, payload);
                toast.success("Đã cập nhật phiếu nhập");
            } else {
                await receiptApi.create(payload);
                toast.success("Đã tạo phiếu nhập");
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

            {/* Nhà cung cấp */}
            <div>
                <label className="mb-2 block font-medium">
                    Nhà cung cấp <span className="text-red-500">*</span>
                </label>
                <select
                    name="supplierId"
                    value={form.supplierId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                >
                    <option value="">Chọn nhà cung cấp</option>
                    {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Kho */}
            <div>
                <label className="mb-2 block font-medium">
                    Kho <span className="text-red-500">*</span>
                </label>
                <select
                    name="warehouseId"
                    value={form.warehouseId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                >
                    <option value="">Chọn kho</option>
                    {warehouses.map((warehouse) => (
                        <option key={warehouse.id} value={warehouse.id}>
                            {warehouse.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Ngày nhập kho */}
            <div>
                <label className="mb-2 block font-medium">
                    Ngày nhập kho <span className="text-red-500">*</span>
                </label>
                <input
                    type="date"
                    name="receiptDate"
                    value={form.receiptDate}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                />
            </div>

            <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="rounded-xl text-(--color-primary-hover) border border-(--color-border) px-6 py-3 font-medium
                    transition hover:bg-pink-50 hover:text-(--color-primary) disabled:opacity-50"
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-(--color-primary-hover) px-6 py-3 font-medium text-white transition
                    hover:bg-(--color-primary) disabled:opacity-50"
                >
                    {loading
                        ? "Đang xử lý..."
                        : receipt
                            ? "Cập nhật phiếu nhập"
                            : "Tạo phiếu nhập"}
                </button>
            </div>

        </form>
    );
}

export default ReceiptForm;
