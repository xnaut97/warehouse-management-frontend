import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import issueApi from "../api/issueApi.js";
import useSort from "../hooks/useSort.js";

import PageHeader from "../components/common/PageHeader.jsx";
import TableToolbar from "../components/common/TableToolbar.jsx";
import IssueTable from "../components/issues/IssueTable.jsx";
import IssueForm from "../components/issues/IssueForm.jsx";
import Modal from "../components/common/Modal.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import Pagination from "../components/common/Pagination.jsx";

function IssuePage() {

    const navigate = useNavigate();

    const [issues, setIssues] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [pageSize] = useState(8);
    const [totalPages, setTotalPages] = useState(0);

    // Sort state — default: newest first
    const { sortField, sortDir, onSort, sortParam } = useSort("issueDate", "desc");

    // Create modal
    const [showForm, setShowForm] = useState(false);

    // Delete confirm dialog
    const [showDelete, setShowDelete] = useState(false);
    const [issueToDelete, setIssueToDelete] = useState(null);

    const loadIssues = async () => {
        try {
            const response = await issueApi.getAll({
                page,
                size: pageSize,
                sort: sortParam,
            });
            const data = response.data.data;
            setIssues(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error(error);
        }
    };

    // Reset to page 0 when sort changes, otherwise just reload
    useEffect(() => {
        setPage(0);
    }, [sortParam]);

    useEffect(() => {
        loadIssues();
    }, [page, pageSize, sortParam]);

    const filteredIssues = issues.filter((issue) => {
        const keyword = search.toLowerCase();
        return (
            issue.issueNo?.toLowerCase().includes(keyword) ||
            issue.customer?.toLowerCase().includes(keyword) ||
            issue.warehouse?.toLowerCase().includes(keyword)
        );
    });

    /* ── Delete ── */
    const handleOpenDelete = (issue) => {
        setIssueToDelete(issue);
        setShowDelete(true);
    };

    const handleDelete = async () => {
        try {
            await issueApi.delete(issueToDelete.id);
            toast.success("Đã xóa phiếu xuất");
            await loadIssues();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Xóa thất bại"
            );
        } finally {
            setShowDelete(false);
            setIssueToDelete(null);
        }
    };

    return (
        <div>

            <PageHeader
                title="Phiếu xuất"
                description="Quản lý phiếu xuất kho."
                actionLabel="Thêm phiếu xuất"
                actionIcon={<Plus size={18} />}
                onAction={() => setShowForm(true)}
            />

            <TableToolbar
                search={search}
                setSearch={setSearch}
            />

            <IssueTable
                issues={filteredIssues}
                onView={(id) => navigate(`/issues/${id}`)}
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

            {/* Create issue modal */}
            {showForm && (
                <Modal
                    title="Tạo phiếu xuất"
                    onClose={() => setShowForm(false)}
                >
                    <IssueForm
                        onSuccess={async () => {
                            setShowForm(false);
                            await loadIssues();
                        }}
                        onCancel={() => setShowForm(false)}
                    />
                </Modal>
            )}

            {/* Delete confirm dialog */}
            {showDelete && (
                <ConfirmDialog
                    title="Xóa phiếu xuất"
                    message={`Bạn có chắc muốn xóa phiếu xuất "${issueToDelete?.issueNo}"? Hành động này không thể hoàn tác.`}
                    onConfirm={handleDelete}
                    onCancel={() => {
                        setShowDelete(false);
                        setIssueToDelete(null);
                    }}
                />
            )}

        </div>
    );
}

export default IssuePage;