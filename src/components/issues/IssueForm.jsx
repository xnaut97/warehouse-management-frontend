import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import issueApi from "../../api/issueApi";
import warehouseApi from "../../api/warehouseApi";
import customerApi from "../../api/customerApi";

function IssueForm({ issue, onSuccess, onCancel }) {

    const [warehouses, setWarehouses] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        warehouseId: "",
        customerId: "",
        issueDate: new Date().toISOString().split("T")[0],
    });

    useEffect(() => {
        loadWarehouses();
        loadCustomers();
    }, []);

    useEffect(() => {
        if (!issue) return;
        setForm({
            warehouseId: issue.warehouseId ?? "",
            customerId: issue.customerId ?? "",
            issueDate: issue.issueDate ?? new Date().toISOString().split("T")[0],
        });
    }, [issue]);

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

    const loadCustomers = async () => {
        try {
            const response = await customerApi.getAllCustomers();
            setCustomers(
                response.data.data.content.filter((c) => c.enabled)
            );
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
                warehouseId: Number(form.warehouseId),
                customerId: Number(form.customerId),
                issueDate: form.issueDate,
            };

            if (issue) {
                await issueApi.update(issue.id, payload);
                toast.success("Đã cập nhật phiếu xuất");
            } else {
                await issueApi.create(payload);
                toast.success("Đã tạo phiếu xuất");
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

            {/* Khách hàng */}
            <div>
                <label className="mb-2 block font-medium">
                    Khách hàng <span className="text-red-500">*</span>
                </label>
                <select
                    name="customerId"
                    value={form.customerId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                >
                    <option value="">Chọn khách hàng</option>
                    {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                            {customer.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Ngày xuất kho */}
            <div>
                <label className="mb-2 block font-medium">
                    Ngày xuất kho <span className="text-red-500">*</span>
                </label>
                <input
                    type="date"
                    name="issueDate"
                    value={form.issueDate}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                />
            </div>

            {/* Actions */}
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
                        : issue
                            ? "Cập nhật phiếu xuất"
                            : "Tạo phiếu xuất"}
                </button>
            </div>

        </form>
    );
}

export default IssueForm;