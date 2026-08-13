import { useEffect, useState } from "react";
import { ArrowLeft, Check, Plus, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import productIssueApi from "../api/productIssueApi.js";

function ProductIssueDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadIssue = async () => {
        try {
            setLoading(true);

            const response =
                await productIssueApi.getDetail(id);

            setIssue(response.data);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Không thể tải phiếu xuất"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadIssue();
    }, [id]);

    const handleConfirm = async () => {
        const confirmed = window.confirm(
            "Xác nhận phiếu xuất này?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await productIssueApi.confirm(id);

            toast.success(
                "Đã xác nhận phiếu xuất"
            );

            await loadIssue();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Xác nhận phiếu xuất thất bại"
            );
        }
    };

    const handleDeleteItem = async (itemId) => {
        const confirmed = window.confirm(
            "Xóa sản phẩm này khỏi phiếu xuất?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await productIssueApi.deleteItem(
                id,
                itemId
            );

            toast.success(
                "Đã xóa sản phẩm khỏi phiếu xuất"
            );

            await loadIssue();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Xóa sản phẩm thất bại"
            );
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <span className="text-sm text-slate-500">
                    Đang tải dữ liệu...
                </span>
            </div>
        );
    }

    if (!issue) {
        return null;
    }

    const isDraft =
        issue.status === "DRAFT";

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/receipts-issues")
                        }
                        className="mb-3 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800"
                    >
                        <ArrowLeft size={16} />
                        Quay lại
                    </button>

                    <h1 className="text-2xl font-bold text-slate-800">
                        Phiếu xuất sản phẩm
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        {issue.issueNo}
                    </p>
                </div>

                {isDraft && (
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/product-issues/${id}/items/new`
                                )
                            }
                            className="flex items-center gap-2 rounded-xl bg-(--color-primary-hover) px-5 py-3 font-medium text-white hover:bg-(--color-primary)"
                        >
                            <Plus size={18} />
                            Thêm sản phẩm
                        </button>

                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={!issue.items?.length}
                            className="flex items-center gap-2 rounded-xl border border-(--color-border) px-5 py-3 font-medium text-slate-700 hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Check size={18} />
                            Xác nhận
                        </button>
                    </div>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <InfoCard
                    label="Mã phiếu"
                    value={issue.issueNo}
                />

                <InfoCard
                    label="Kho"
                    value={issue.warehouse || "-"}
                />

                <InfoCard
                    label="Ngày xuất"
                    value={issue.issueDate || "-"}
                />

                <InfoCard
                    label="Khách hàng"
                    value={issue.customer || "-"}
                />
            </div>

            <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">
                <table className="min-w-[1100px] w-full">
                    <thead className="border-b border-pink-100">
                    <tr>
                        <th className="px-6 py-4 text-left">
                            SẢN PHẨM
                        </th>

                        <th className="px-6 py-4 text-left">
                            ĐVT
                        </th>

                        <th className="px-6 py-4 text-center">
                            SỐ LƯỢNG
                        </th>

                        <th className="px-6 py-4 text-left">
                            LÔ
                        </th>

                        <th className="px-6 py-4 text-left">
                            HSD
                        </th>

                        <th className="px-6 py-4 text-right">
                            ĐƠN GIÁ XUẤT
                        </th>

                        <th className="px-6 py-4 text-right">
                            THÀNH TIỀN
                        </th>

                        {isDraft && (
                            <th className="px-6 py-4 text-center">
                                THAO TÁC
                            </th>
                        )}
                    </tr>
                    </thead>

                    <tbody>
                    {!issue.items?.length ? (
                        <tr>
                            <td
                                colSpan={
                                    isDraft ? 8 : 7
                                }
                                className="py-12 text-center text-slate-500"
                            >
                                Phiếu chưa có sản phẩm.
                            </td>
                        </tr>
                    ) : (
                        issue.items.map((item) => (
                            <tr
                                key={item.id}
                                className="border-t border-(--color-border)"
                            >
                                <td className="px-6 py-4">
                                    <p className="font-semibold">
                                        {item.productName}
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        {item.productCode}
                                    </p>
                                </td>

                                <td className="px-6 py-4">
                                    {item.unit || "-"}
                                </td>

                                <td className="px-6 py-4 text-center">
                                    {item.quantity}
                                </td>

                                <td className="px-6 py-4">
                                    {item.lotNumber || "-"}
                                </td>

                                <td className="px-6 py-4">
                                    {item.expirationDate || "-"}
                                </td>

                                <td className="px-6 py-4 text-right">
                                    {formatMoney(
                                        item.unitPrice
                                    )}
                                </td>

                                <td className="px-6 py-4 text-right">
                                    {formatMoney(
                                        item.amount
                                    )}
                                </td>

                                {isDraft && (
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/product-issues/${id}/items/${item.id}/edit`
                                                    )
                                                }
                                                className="rounded-xl px-3 py-2 text-sm text-slate-500 hover:bg-pink-50 hover:text-(--color-primary)"
                                            >
                                                Sửa
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteItem(
                                                        item.id
                                                    )
                                                }
                                                className="rounded-xl p-2 text-slate-500 hover:bg-red-50 hover:text-red-500"
                                            >
                                                <Trash2
                                                    size={17}
                                                />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end">
                <div className="rounded-2xl border border-(--color-border) bg-white px-8 py-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Tổng tiền
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-800">
                        {formatMoney(
                            issue.totalAmount
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}

function InfoCard({ label, value }) {
    return (
        <div className="rounded-2xl border border-(--color-border) bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
                {label}
            </p>

            <p className="mt-1 font-semibold text-slate-800">
                {value}
            </p>
        </div>
    );
}

function formatMoney(value) {
    return `${Number(value ?? 0).toLocaleString("vi-VN")} ₫`;
}

export default ProductIssueDetailPage;