import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {ArrowLeft, Check, Plus} from "lucide-react";
import toast from "react-hot-toast";

import issueApi from "../../api/issueApi.js";

import IssueDetailCard from "./IssueDetailCard.jsx";
import IssueItemTable from "./IssueItemTable.jsx";
import IssueItemForm from "./IssueItemForm.jsx";
import ConfirmDialog from "../common/ConfirmDialog.jsx";
import Modal from "../common/Modal.jsx";

function IssueDetail() {

    const {id} = useParams();
    const navigate = useNavigate();

    const [issue, setIssue] = useState(null);

    // Confirm-issue dialog
    const [showConfirm, setShowConfirm] = useState(false);

    // Add / edit item modal
    const [showItemForm, setShowItemForm] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Delete item confirm dialog
    const [showDeleteItem, setShowDeleteItem] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const loadIssue = async () => {
        try {
            const response = await issueApi.getDetail(id);
            setIssue(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadIssue();
    }, [id]);


    /* ── Confirm issue ── */
    const handleConfirm = async () => {
        try {
            await issueApi.confirm(id);
            await loadIssue();
            toast.success("Đã xác nhận phiếu xuất");
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
            await issueApi.deleteItem(id, itemToDelete.id);
            toast.success("Đã xóa hàng hóa");
            await loadIssue();
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
    if (!issue) {
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
                onClick={() => navigate("/issues")}
                className="group flex items-center gap-2 text-base font-medium text-slate-600 transition hover:text-blue-600 sm:text-lg"
            >
                <ArrowLeft size={18} className="transition group-hover:-translate-x-1"/>
                Quay lại danh sách phiếu xuất
            </button>


            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">

                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                    <div className="space-y-2">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                                Phiếu xuất {issue.issueNo}
                            </h1>
                            <span
                                className={`rounded-full px-3 py-1 text-sm font-medium ${statusStyle[issue.status]}`}
                            >
                                {statusText[issue.status]}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500">
                            Chi tiết thông tin phiếu xuất kho
                        </p>
                    </div>

                    {issue.status === "DRAFT" && (
                        <div className="flex flex-col gap-3 sm:flex-row">

                            <button
                                onClick={handleOpenAddItem}
                                className="flex items-center justify-center gap-2 rounded-lg border border-(--color-border) px-5 py-3 font-medium
                                 text-(--color-primary) transition hover:bg-pink-50 hover:text-(--color-primary-hover)"
                            >
                                <Plus size={18}/>
                                Thêm hàng hóa
                            </button>

                            <button
                                onClick={() => setShowConfirm(true)}
                                className="flex items-center justify-center gap-2 rounded-lg bg-(--color-primary-hover) px-5 py-3 font-medium
                                 text-white transition hover:bg-(--color-primary)"
                            >
                                <Check size={18}/>
                                Xác nhận phiếu
                            </button>

                        </div>
                    )}

                </div>

            </div>


            <IssueDetailCard issue={issue}/>

            <IssueItemTable
                items={issue.items ?? []}
                status={issue.status}
                onUpdate={handleOpenEditItem}
                onDelete={handleOpenDeleteItem}
            />


            {showItemForm && (
                <Modal
                    title={selectedItem ? "Cập nhật hàng hóa" : "Thêm hàng hóa"}
                    onClose={() => {
                        setShowItemForm(false);
                        setSelectedItem(null);
                    }}
                >
                    <IssueItemForm
                        issueId={Number(id)}
                        item={selectedItem}
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


            {/* Confirm issue dialog */}
            {showConfirm && (
                <ConfirmDialog
                    title="Xác nhận phiếu xuất"
                    message="Bạn có chắc chắn muốn xác nhận phiếu xuất? Hành động này không thể hoàn tác."
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
                    title="Xóa hàng hóa"
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
