import { useEffect, useState } from "react";
import { ArrowLeft, Check, Plus, Printer } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import materialIssueApi from "../../api/materialIssueApi.js";

import IssueDetailCard from "./IssueDetailCard.jsx";
import IssueItemTable from "./IssueItemTable.jsx";
import IssueItemForm from "./IssueItemForm.jsx";
import ConfirmDialog from "../common/ConfirmDialog.jsx";
import Modal from "../common/Modal.jsx";
import IssueStatusBadge from "./IssueStatusBadge.jsx";

import { printTransactionDocument } from "../transactions/documentPrint.js";

function IssueDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [issue, setIssue] = useState(null);

    const [showConfirm, setShowConfirm] = useState(false);
    const [showItemForm, setShowItemForm] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [showDeleteItem, setShowDeleteItem] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const loadIssue = async () => {
        try {
            const response = await materialIssueApi.getDetail(id);
            setIssue(response.data?.data);
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Không thể tải phiếu xuất"
            );
        }
    };

    useEffect(() => {
        loadIssue();
    }, [id]);

    const handleConfirm = async () => {
        try {
            await materialIssueApi.confirm(id);
            await loadIssue();

            toast.success("Đã xác nhận phiếu xuất");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Xác nhận thất bại"
            );
        }
    };

    const handleDeleteItem = async () => {
        if (!itemToDelete) {
            return;
        }

        try {
            await materialIssueApi.deleteItem(id, itemToDelete.id);

            toast.success("Đã xóa mặt hàng");
            await loadIssue();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Xóa thất bại"
            );
        } finally {
            setShowDeleteItem(false);
            setItemToDelete(null);
        }
    };

    if (!issue) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-slate-500">
                    Đang tải dữ liệu...
                </div>
            </div>
        );
    }

    const editable = issue.status === "DRAFT";

    return (
        <div className="space-y-6 bg-(--color-background) px-4 py-6 sm:px-6 lg:px-12 lg:py-10">
            <button
                type="button"
                onClick={() => navigate("/receipts-issues")}
                className="group flex items-center gap-2 text-base font-medium text-slate-600 transition hover:text-(--color-primary-hover)"
            >
                <ArrowLeft
                    size={18}
                    className="transition group-hover:-translate-x-1"
                />
                Quay lại danh sách phiếu nhập xuất
            </button>

            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                                Phiếu xuất {issue.issueNo}
                            </h1>

                            <IssueStatusBadge status={issue.status} />
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                            Chi tiết thông tin phiếu xuất kho
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={() =>
                                printTransactionDocument(
                                    "MATERIAL_ISSUE",
                                    issue
                                )
                            }
                            className="flex items-center justify-center gap-2 rounded-lg border border-(--color-border) px-5 py-3 font-medium text-slate-700 transition hover:bg-pink-100 hover:text-(--color-primary-hover)"
                        >
                            <Printer size={18} />
                            In phiếu
                        </button>

                        {editable && (
                            <>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedItem(null);
                                    setShowItemForm(true);
                                }}
                                className="flex items-center justify-center gap-2 rounded-lg border border-(--color-border) px-5 py-3 font-medium text-(--color-primary) transition hover:bg-pink-100 hover:text-(--color-primary-hover)"
                            >
                                <Plus size={18} />
                                Thêm mặt hàng
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowConfirm(true)}
                                disabled={!issue.items?.length}
                                className="flex items-center justify-center gap-2 rounded-lg bg-(--color-primary) px-5 py-3 font-medium text-white transition hover:bg-(--color-primary-hover) disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Check size={18} />
                                Xác nhận phiếu
                            </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <IssueDetailCard issue={issue} />

            <IssueItemTable
                items={issue.items ?? []}
                status={issue.status}
                onUpdate={(item) => {
                    setSelectedItem(item);
                    setShowItemForm(true);
                }}
                onDelete={(item) => {
                    setItemToDelete(item);
                    setShowDeleteItem(true);
                }}
            />

            {showItemForm && (
                <Modal
                    title={
                        selectedItem
                            ? "Cập nhật mặt hàng"
                            : "Thêm mặt hàng"
                    }
                    onClose={() => {
                        setShowItemForm(false);
                        setSelectedItem(null);
                    }}
                >
                    <IssueItemForm
                        issueId={Number(id)}
                        warehouseId={issue.warehouseId}
                        item={selectedItem}
                        existingItems={issue.items ?? []}
                        onSuccess={async () => {
                            setShowItemForm(false);
                            setSelectedItem(null);
                            await loadIssue();
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
                    title="Xác nhận phiếu xuất"
                    message="Bạn có chắc chắn muốn xác nhận phiếu xuất kho? Hành động này không thể hoàn tác."
                    onConfirm={async () => {
                        await handleConfirm();
                        setShowConfirm(false);
                    }}
                    onCancel={() => setShowConfirm(false)}
                />
            )}

            {showDeleteItem && (
                <ConfirmDialog
                    title="Xóa mặt hàng"
                    message={`Bạn có chắc muốn xóa "${itemToDelete?.materialName}" khỏi phiếu xuất?`}
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

export default IssueDetail;