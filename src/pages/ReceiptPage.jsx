import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import receiptApi from "../api/receiptApi.js";
import useSort from "../hooks/useSort.js";

import PageHeader from "../components/common/PageHeader.jsx";
import TableToolbar from "../components/common/TableToolbar.jsx";
import ReceiptTable from "../components/receipts/ReceiptTable.jsx";
import ReceiptForm from "../components/receipts/ReceiptForm.jsx";
import Modal from "../components/common/Modal.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import Pagination from "../components/common/Pagination.jsx";

function ReceiptPage() {

    const navigate = useNavigate();

    const [receipts, setReceipts] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [pageSize] = useState(8);
    const [totalPages, setTotalPages] = useState(0);

    // Sort state — default: newest first
    const { sortField, sortDir, onSort, sortParam } = useSort("receiptDate", "desc");

    // Create modal
    const [showForm, setShowForm] = useState(false);

    // Delete confirm dialog
    const [showDelete, setShowDelete] = useState(false);
    const [receiptToDelete, setReceiptToDelete] = useState(null);

    const loadReceipts = async () => {
        try {
            const response = await receiptApi.getAll({
                page,
                size: pageSize,
                sort: sortParam,
            });
            const data = response.data.data;
            setReceipts(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error(error);
        }
    };

    // Reset to page 0 when sort changes
    useEffect(() => {
        setPage(0);
    }, [sortParam]);

    useEffect(() => {
        loadReceipts();
    }, [page, pageSize, sortParam]);

    const filteredReceipts = receipts.filter((receipt) => {
        const keyword = search.toLowerCase();
        return (
            receipt.receiptNo?.toLowerCase().includes(keyword) ||
            receipt.supplier?.toLowerCase().includes(keyword) ||
            receipt.warehouse?.toLowerCase().includes(keyword)
        );
    });

    /* ── Delete ── */
    const handleOpenDelete = (receipt) => {
        setReceiptToDelete(receipt);
        setShowDelete(true);
    };

    const handleDelete = async () => {
        try {
            await receiptApi.delete(receiptToDelete.id);
            toast.success("Đã xóa phiếu nhập");
            await loadReceipts();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Xóa thất bại"
            );
        } finally {
            setShowDelete(false);
            setReceiptToDelete(null);
        }
    };

    return (
        <div>

            <PageHeader
                title="Phiếu nhập kho"
                description="Quản lý nhập nguyên vật liệu vào kho."
                actionLabel="Thêm phiếu nhập"
                actionIcon={<Plus size={18} />}
                onAction={() => setShowForm(true)}
            />

            <TableToolbar
                search={search}
                setSearch={setSearch}
            />

            <ReceiptTable
                receipts={filteredReceipts}
                onView={(id) => navigate(`/receipts/${id}`)}
                onDelete={handleOpenDelete}
                sortField={sortField}
                sortDir={sortDir}
                onSort={onSort}
            />

            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

            {/* Create receipt modal */}
            {showForm && (
                <Modal
                    title="Tạo phiếu nhập"
                    onClose={() => setShowForm(false)}
                >
                    <ReceiptForm
                        onSuccess={async () => {
                            setShowForm(false);
                            await loadReceipts();
                        }}
                        onCancel={() => setShowForm(false)}
                    />
                </Modal>
            )}

            {/* Delete confirm dialog */}
            {showDelete && (
                <ConfirmDialog
                    title="Xóa phiếu nhập"
                    message={`Bạn có chắc muốn xóa phiếu nhập "${receiptToDelete?.receiptNo}"? Hành động này không thể hoàn tác.`}
                    onConfirm={handleDelete}
                    onCancel={() => {
                        setShowDelete(false);
                        setReceiptToDelete(null);
                    }}
                />
            )}

        </div>
    );

}

export default ReceiptPage;
