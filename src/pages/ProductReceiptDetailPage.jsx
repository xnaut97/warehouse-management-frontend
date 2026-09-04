import { useEffect, useState } from "react";
import { ArrowLeft, Check, Plus, Printer, Trash2, Edit } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import productReceiptApi from "../api/productReceiptApi.js";

import Loading from "../components/common/Loading.jsx";
import Modal from "../components/common/Modal.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ReceiptStatusBadge from "../components/receipts/ReceiptStatusBadge.jsx";
import ProductDocumentItemForm from "../components/products/ProductDocumentItemForm.jsx";

import { unwrapData } from "../utils/apiResponse.js";
import { formatDate, formatNumber } from "../components/reports/reportUtils.js";
import { printTransactionDocument } from "../components/transactions/documentPrint.js";

function ProductReceiptDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showItemForm, setShowItemForm] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [showConfirm, setShowConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const loadReceipt = () =>
        productReceiptApi.getDetail(id)
            .then((response) => {
                setReceipt(unwrapData(response));
            })
            .catch((error) => {
                toast.error(
                    error.response?.data?.message ||
                    "Không thể tải phiếu nhập"
                );
                setReceipt(null);
            })
            .finally(() => {
                setLoading(false);
            });

    useEffect(() => {
        loadReceipt();
    }, [id]);

    const handleConfirm = async () => {
        setShowConfirm(false);

        try {
            await productReceiptApi.confirm(id);

            toast.success("Đã xác nhận phiếu nhập");

            await loadReceipt();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Xác nhận phiếu nhập thất bại"
            );
        }
    };

    const handleDeleteItem = async () => {
        const item = itemToDelete;

        setItemToDelete(null);

        try {
            await productReceiptApi.deleteItem(id, item.id);

            toast.success("Đã xóa sản phẩm khỏi phiếu nhập");

            await loadReceipt();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Xóa sản phẩm thất bại"
            );
        }
    };

    if (loading) {
        return <Loading rows={6} />;
    }

    if (!receipt) {
        return (
            <EmptyState
                title="Không tìm thấy phiếu nhập"
                description="Phiếu nhập sản phẩm không tồn tại hoặc đã bị xóa."
            />
        );
    }

    const isDraft = receipt.status === "DRAFT";

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate("/receipts-issues")}
                        className="mb-3 flex items-center gap-2 text-sm text-slate-500 transition hover:text-(--color-primary-hover)"
                    >
                        <ArrowLeft size={16} />
                        Quay lại
                    </button>

                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-800">
                            Phiếu nhập sản phẩm
                        </h1>

                        <ReceiptStatusBadge status={receipt.status} />
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                        {receipt.receiptNo}
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            printTransactionDocument(
                                "PRODUCT_RECEIPT",
                                receipt
                            )
                        }
                        className="flex items-center gap-2 rounded-xl border border-(--color-border) px-5 py-3 font-medium text-slate-700 transition hover:bg-pink-50"
                    >
                        <Printer size={18} />
                        In phiếu
                    </button>

                    {isDraft && (
                        <>
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedItem(null);
                                setShowItemForm(true);
                            }}
                            className="flex items-center gap-2 rounded-xl bg-(--color-primary-hover) px-5 py-3 font-medium text-white transition hover:bg-(--color-primary)"
                        >
                            <Plus size={18} />
                            Thêm sản phẩm
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowConfirm(true)}
                            disabled={!receipt.items?.length}
                            className="flex items-center gap-2 rounded-xl border border-(--color-border) px-5 py-3 font-medium text-slate-700 transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Check size={18} />
                            Xác nhận
                        </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <InfoCard
                    label="Mã phiếu"
                    value={receipt.receiptNo}
                />

                <InfoCard
                    label="Kho"
                    value={receipt.warehouse || "—"}
                />

                <InfoCard
                    label="Ngày nhập"
                    value={formatDate(receipt.receiptDate) || "—"}
                />
            </div>

            <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">
                <table className="min-w-[900px] w-full">
                    <thead className="border-b border-pink-100">
                    <tr>
                        <th className="px-6 py-4 text-left font-semibold text-slate-700">
                            MÃ SẢN PHẨM
                        </th>

                        <th className="px-6 py-4 text-left font-semibold text-slate-700">
                            TÊN SẢN PHẨM
                        </th>

                        <th className="px-6 py-4 text-left font-semibold text-slate-700">
                            ĐVT
                        </th>

                        <th className="px-6 py-4 text-right font-semibold text-slate-700">
                            SỐ LƯỢNG
                        </th>

                        <th className="px-6 py-4 text-left font-semibold text-slate-700">
                            LÔ
                        </th>

                        <th className="px-6 py-4 text-left font-semibold text-slate-700">
                            HSD
                        </th>

                        {isDraft && (
                            <th className="px-6 py-4 text-center font-semibold text-slate-700">
                                THAO TÁC
                            </th>
                        )}
                    </tr>
                    </thead>

                    <tbody>
                    {!receipt.items?.length ? (
                        <tr>
                            <td colSpan={isDraft ? 7 : 6}>
                                <EmptyState
                                    title="Phiếu chưa có sản phẩm"
                                    description="Thêm sản phẩm để hoàn tất phiếu nhập."
                                />
                            </td>
                        </tr>
                    ) : (
                        receipt.items.map((item) => (
                            <tr
                                key={item.id}
                                className="border-t border-(--color-border) transition hover:bg-pink-50"
                            >
                                <td className="px-6 py-4 font-medium text-slate-800">
                                    {item.productCode}
                                </td>

                                <td className="px-6 py-4 text-sm text-slate-700">
                                    {item.productName}
                                </td>

                                <td className="px-6 py-4 text-sm text-slate-700">
                                    {item.unit || "—"}
                                </td>

                                <td className="px-6 py-4 text-right text-sm text-slate-700">
                                    {formatNumber(item.quantity)}
                                </td>

                                <td className="px-6 py-4 text-sm text-slate-700">
                                    {item.lotNumber || "—"}
                                </td>

                                <td className="px-6 py-4 text-sm text-slate-700">
                                    {formatDate(item.expirationDate) || "—"}
                                </td>

                                {isDraft && (
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedItem(item);
                                                    setShowItemForm(true);
                                                }}
                                                className="rounded-lg p-2 text-slate-500 transition hover:text-(--color-primary-hover)"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit size={18} />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setItemToDelete(item)}
                                                className="rounded-lg p-2 text-slate-500 transition hover:text-red-500"
                                                title="Xóa"
                                            >
                                                <Trash2 size={17} />
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

            {showItemForm && (
                <Modal
                    title={selectedItem ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
                    onClose={() => {
                        setShowItemForm(false);
                        setSelectedItem(null);
                    }}
                >
                    <ProductDocumentItemForm
                        transactionType="RECEIPT"
                        documentId={Number(id)}
                        item={selectedItem}
                        onSuccess={async () => {
                            setShowItemForm(false);
                            setSelectedItem(null);
                            await loadReceipt();
                        }}
                        onCancel={() => {
                            setShowItemForm(false);
                            setSelectedItem(null);
                        }}
                    />
                </Modal>
            )}

            {showConfirm && (
                <ConfirmDialog
                    title="Xác nhận phiếu nhập"
                    message="Xác nhận phiếu nhập sản phẩm? Tồn kho sẽ được cập nhật và phiếu không thể chỉnh sửa."
                    onConfirm={handleConfirm}
                    onCancel={() => setShowConfirm(false)}
                />
            )}

            {itemToDelete && (
                <ConfirmDialog
                    title="Xóa sản phẩm"
                    message={`Xóa "${itemToDelete.productName}" khỏi phiếu nhập?`}
                    danger
                    onConfirm={handleDeleteItem}
                    onCancel={() => setItemToDelete(null)}
                />
            )}
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

export default ProductReceiptDetailPage;
