import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import customerApi from "../api/customerApi.js";
import useSort from "../hooks/useSort.js";

import PageHeader from "../components/common/PageHeader.jsx";
import TableToolbar from "../components/common/TableToolbar.jsx";
import Modal from "../components/common/Modal.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import Pagination from "../components/common/Pagination.jsx";
import CustomerForm from "../components/customers/CustomerForm.jsx";
import CustomerTable from "../components/customers/CustomerTable.jsx";


function CustomerPage() {

    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [confirmCustomer, setConfirmCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [pageSize] = useState(8);
    const [totalPages, setTotalPages] = useState(0);

    const { sortField, sortDir, onSort, sortParam } = useSort("name", "asc");

    const loadCustomers = async () => {
        try {
            setLoading(true);
            const response = await customerApi.getAllCustomers({
                page,
                size: pageSize,
                sort: sortParam,
            });
            const data = response.data.data;
            setCustomers(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách khách hàng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { setPage(0); }, [sortParam]);

    useEffect(() => {
        loadCustomers();
    }, [page, pageSize, sortParam]);


    const handleToggleStatus = (customer) => {
        setConfirmCustomer(customer);
    };

    const confirmToggleStatus = async () => {
        try {
            if (confirmCustomer.enabled) {
                await customerApi.disableCustomer(confirmCustomer.id);
                toast.success("Đã khóa khách hàng thành công");
            } else {
                await customerApi.enableCustomer(confirmCustomer.id);
                toast.success("Đã mở khóa khách hàng thành công");
            }
            setConfirmCustomer(null);
            loadCustomers();
        } catch (error) {
            toast.error("Cập nhật trạng thái khách hàng thất bại");
        }
    };

    const handleDelete = (customer) => {
        setConfirmCustomer({ ...customer, deleteAction: true });
    };

    const confirmDelete = async () => {
        try {
            await customerApi.deleteCustomer(confirmCustomer.id);
            toast.success("Đã xóa khách hàng thành công");
            setConfirmCustomer(null);
            loadCustomers();
        } catch (error) {
            toast.error("Xóa khách hàng thất bại");
        }
    };

    const filteredCustomers = customers.filter((customer) => {
        const keyword = search.toLowerCase();
        return (
            customer.name.toLowerCase().includes(keyword) ||
            customer.phone?.toLowerCase().includes(keyword)
        );
    });

    return (
        <div>

            <PageHeader
                title="Khách hàng"
                description="Quản lý thông tin khách hàng."
                actionLabel="Thêm khách hàng"
                actionIcon={<Plus size={18}/>}
                onAction={() => {
                    setSelectedCustomer(null);
                    setShowForm(true);
                }}
            />

            <TableToolbar search={search} setSearch={setSearch} />

            <CustomerTable
                customers={filteredCustomers}
                onEdit={(customer) => {
                    setSelectedCustomer(customer);
                    setShowForm(true);
                }}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
                sortField={sortField}
                sortDir={sortDir}
                onSort={onSort}
            />

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

            {showForm && (
                <Modal
                    title={selectedCustomer ? "Chỉnh sửa khách hàng" : "Thêm khách hàng"}
                    onClose={() => setShowForm(false)}
                >
                    <CustomerForm
                        customer={selectedCustomer}
                        onCancel={() => setShowForm(false)}
                        onSuccess={() => {
                            setShowForm(false);
                            loadCustomers();
                        }}
                    />
                </Modal>
            )}

            {confirmCustomer && (
                <ConfirmDialog
                    title={
                        confirmCustomer.deleteAction
                            ? "Xóa khách hàng?"
                            : confirmCustomer.enabled
                                ? "Khóa khách hàng?"
                                : "Mở khóa khách hàng?"
                    }
                    message={
                        confirmCustomer.deleteAction
                            ? "Bạn có chắc chắn muốn xóa khách hàng này?"
                            : confirmCustomer.enabled
                                ? "Khách hàng sẽ bị khóa và không còn hoạt động."
                                : "Khách hàng sẽ được kích hoạt lại."
                    }
                    confirmText={
                        confirmCustomer.deleteAction
                            ? "Xóa"
                            : confirmCustomer.enabled
                                ? "Khóa"
                                : "Mở khóa"
                    }
                    danger={confirmCustomer.deleteAction || confirmCustomer.enabled}
                    onCancel={() => setConfirmCustomer(null)}
                    onConfirm={confirmCustomer.deleteAction ? confirmDelete : confirmToggleStatus}
                />
            )}

        </div>
    );
}

export default CustomerPage;
