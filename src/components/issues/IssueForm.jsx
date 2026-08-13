import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import materialIssueApi from "../../api/materialIssueApi.js";
import warehouseApi from "../../api/warehouseApi";

function IssueForm({ issue, onSuccess, onCancel }) {
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    const [form, setForm] = useState({
        warehouseId: "",
        issueDate: new Date().toISOString().split("T")[0],
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
                    list.filter((warehouse) => warehouse.enabled)
                );
            } catch (error) {
                console.error(error);
                toast.error("Không thể tải dữ liệu kho");
            } finally {
                setLoadingData(false);
            }
        };

        loadWarehouses();
    }, []);

    useEffect(() => {
        if (!issue) {
            return;
        }

        setForm({
            warehouseId: issue.warehouseId ?? "",
            issueDate:
                issue.issueDate ??
                new Date().toISOString().split("T")[0],
        });
    }, [issue]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.warehouseId) {
            toast.error("Vui lòng chọn kho");
            return;
        }

        if (!form.issueDate) {
            toast.error("Vui lòng chọn ngày xuất");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                warehouseId: Number(form.warehouseId),
                issueDate: form.issueDate,
            };

            if (issue) {
                await materialIssueApi.update(issue.id, payload);

                toast.success("Đã cập nhật phiếu xuất");
                onSuccess(issue.id);
            } else {
                const response = await materialIssueApi.create(payload);
                const createdIssue = response.data?.data;
                const issueId = createdIssue?.id;

                if (!issueId) {
                    toast.error(
                        "Tạo phiếu thành công nhưng không nhận được mã phiếu"
                    );
                    return;
                }

                toast.success("Đã tạo phiếu xuất");
                onSuccess(issueId);
            }
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Không thể tạo phiếu xuất"
            );
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="flex min-h-[220px] items-center justify-center">
                <div className="text-sm text-slate-500">
                    Đang tải dữ liệu...
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Kho
                    <span className="text-red-500"> *</span>
                </label>

                <select
                    name="warehouseId"
                    value={form.warehouseId}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-pink-100 disabled:bg-gray-50"
                >
                    <option value="">Chọn kho</option>

                    {warehouses.map((warehouse) => (
                        <option
                            key={warehouse.id}
                            value={warehouse.id}
                        >
                            {warehouse.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Ngày xuất
                    <span className="text-red-500"> *</span>
                </label>

                <input
                    type="date"
                    name="issueDate"
                    value={form.issueDate}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-pink-100 disabled:bg-gray-50"
                />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-(--color-border) pt-6 sm:flex-row sm:justify-end">
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
                    disabled={loading}
                    className="rounded-xl bg-(--color-primary) px-6 py-3 font-medium text-white transition hover:bg-(--color-primary-hover) disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? "Đang tạo..."
                        : issue
                            ? "Cập nhật phiếu xuất"
                            : "Tạo phiếu xuất"}
                </button>
            </div>
        </form>
    );
}

export default IssueForm;