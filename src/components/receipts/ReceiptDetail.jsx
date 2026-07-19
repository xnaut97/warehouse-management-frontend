import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {ArrowLeft, Check, Plus} from "lucide-react";
import toast from "react-hot-toast";

import receiptApi from "../../api/receiptApi.js";

import ReceiptDetailCard from "./ReceiptDetailCard.jsx";
import ReceiptItemTable from "./ReceiptItemTable.jsx";
import ReceiptItemForm from "./ReceiptItemForm.jsx";
import ConfirmDialog from "../common/ConfirmDialog.jsx";
import Modal from "../common/Modal.jsx";

function ReceiptDetail() {

    const {id} = useParams();
    const navigate = useNavigate();

    const [receipt, setReceipt] = useState(null);

    // Confirm-receipt dialog
    const [showConfirm, setShowConfirm] = useState(false);

    // Add / edit item modal
    const [showItemForm, setShowItemForm] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Delete item confirm dialog
    const [showDeleteItem, setShowDeleteItem] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const loadReceipt = async () => {
        try {
            const response = await receiptApi.getDetail(id);
            setReceipt(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadReceipt();
    }, [id]);


    /* ── Confirm receipt ── */
    const handleConfirm = async () => {
        try {
            await receiptApi.confirm(id);
            await loadReceipt();
            toast.success("Đã xác nhận phiếu nhập");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Xác nhận thất bại"
            );
        }
    };


    /* ── Add item ── */
    const handleOpenAddItem = () => {
        setSelectedItem(null);
        setShowItemForm(true);
    };


    /* ── Edit item ── */
    const handleOpenEditItem = (item) => {
        setSelectedItem(item);
        setShowItemForm(true);
    };


    /* ── Delete item ── */
    const handleOpenDeleteItem = (item) => {
        setItemToDelete(item);
        setShowDeleteItem(true);
    };

    const handleDeleteItem = async () => {
        try {
            await receiptApi.deleteItem(id, itemToDelete.id);
            toast.success("Đã xóa mặt hàng");
            await loadReceipt();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Xóa thất bại"
            );
        } finally {
            setShowDeleteItem(false);
            setItemToDelete(null);
        }
    };


    /* ── Loading state ── */
    if (!receipt) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-slate-500">Đang tải dữ liệu...</div>
            </div>
        );
    }


    const statusStyle = {
        DRAFT: "bg-yellow-100 text-yellow-700",
        CONFIRMED: "bg-green-100 text-green-700",
        CANCELLED: "bg-red-100 text-red-700",
    };

    const statusText = {
        DRAFT: "Nháp",
        CONFIRMED: "Đã xác nhận",
        CANCELLED: "Đã hủy",
    };


    return (

        <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-12 lg:py-10">

            {/* Back */}
            <button
                onClick={() => navigate("/receipts")}
                className="group flex items-center gap-2 text-base font-medium text-slate-600 transition hover:text-(--color-primary-hover) sm:text-lg"
            >
                <ArrowLeft size={18} className="transition group-hover:-translate-x-1"/>
                Quay lại danh sách phiếu nhập
            </button>


            {/* Header card */}
            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">

                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                    <div className="space-y-2">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                                Phiếu nhập {receipt.receiptNo}
                            </h1>
                            <span
                                className={`rounded-full px-3 py-1 text-sm font-medium ${statusStyle[receipt.status]}`}
                            >
                                {statusText[receipt.status]}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500">
                            Chi tiết thông tin phiếu nhập kho
                        </p>
                    </div>

                    {receipt.status === "DRAFT" && (
                        <div className="flex flex-col gap-3 sm:flex-row">

                            <button
                                onClick={handleOpenAddItem}
                                className="flex items-center justify-center gap-2 rounded-lg border border-blue-600 px-5 py-3 font-medium text-blue-600 transition hover:bg-blue-50"
                            >
                                <Plus size={18}/>
                                Thêm mặt hàng
                            </button>

                            <button
                                onClick={() => setShowConfirm(true)}
                                className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-700"
                            >
                                <Check size={18}/>
                                Xác nhận phiếu
                            </button>

                        </div>
                    )}

                </div>

            </div>


            <ReceiptDetailCard receipt={receipt}/>

            <ReceiptItemTable
                items={receipt.items ?? []}
                status={receipt.status}
                onUpdate={handleOpenEditItem}
                onDelete={handleOpenDeleteItem}
            />


            {/* Add / Edit item modal */}
            {showItemForm && (
                <Modal
                    title={selectedItem ? "Cập nhật mặt hàng" : "Thêm mặt hàng"}
                    onClose={() => {
                        setShowItemForm(false);
                        setSelectedItem(null);
                    }}
                >
                    <ReceiptItemForm
                        receiptId={Number(id)}
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


            {/* Confirm receipt dialog */}
            {showConfirm && (
                <ConfirmDialog
                    title="Xác nhận phiếu nhập"
                    message="Bạn có chắc chắn muốn xác nhận phiếu nhập kho? Hành động này không thể hoàn tác."
                    onConfirm={async () => {
                        await handleConfirm();
                        setShowConfirm(false);
                    }}
                    onCancel={() => setShowConfirm(false)}
                />
            )}


            {/* Delete item dialog */}
            {showDeleteItem && (
                <ConfirmDialog
                    title="Xóa mặt hàng"
                    message={`Bạn có chắc muốn xóa "${itemToDelete?.materialName}" khỏi phiếu nhập?`}
                    onConfirm={handleDeleteItem}
                    onCancel={() => {
                        setShowDeleteItem(false);
                        setItemToDelete(null);
                    }}
                />
            )}

        </div>

    );

}

export default ReceiptDetail;
