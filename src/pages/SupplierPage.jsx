import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import supplierApi from "../api/supplierApi.js";
import useSort from "../hooks/useSort.js";

import PageHeader from "../components/common/PageHeader.jsx";
import TableToolbar from "../components/common/TableToolbar.jsx";
import Pagination from "../components/common/Pagination.jsx";
import SupplierTable from "../components/suppliers/SupplierTable.jsx";
import Modal from "../components/common/Modal.jsx";
import SupplierForm from "../components/suppliers/SupplierForm.jsx";

function SupplierPage() {

    const [showForm, setShowForm] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [suppliers, setSuppliers] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [pageSize] = useState(8);
    const [totalPages, setTotalPages] = useState(0);

    const { sortField, sortDir, onSort, sortParam } = useSort("name", "asc");

    const loadSuppliers = async () => {
        try {
            const response = await supplierApi.getAllSuppliers({
                page,
                size: pageSize,
                sort: sortParam,
            });
            const data = response.data.data;
            setSuppliers(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => { setPage(0); }, [sortParam]);

    useEffect(() => {
        loadSuppliers();
    }, [page, pageSize, sortParam]);

    const filteredSuppliers = suppliers.filter((supplier) => {
        const keyword = search.toLowerCase();
        return (
            supplier.name.toLowerCase().includes(keyword) ||
            supplier.code.toLowerCase().includes(keyword) ||
            supplier.contactPerson.toLowerCase().includes(keyword)
        );
    });

    return (
        <div>

            <PageHeader
                title="Nhà cung cấp"
                description="Quản lý thông tin nhà cung cấp."
                actionLabel="Thêm nhà cung cấp"
                actionIcon={<Plus size={18} />}
                onAction={() => {
                    setSelectedSupplier(null);
                    setShowForm(true);
                }}
            />

            <TableToolbar search={search} setSearch={setSearch} />

            <SupplierTable
                suppliers={filteredSuppliers}
                onEdit={(supplier) => {
                    setSelectedSupplier(supplier);
                    setShowForm(true);
                }}
                onRefresh={loadSuppliers}
                sortField={sortField}
                sortDir={sortDir}
                onSort={onSort}
            />

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

            {showForm && (
                <Modal
                    title={selectedSupplier ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp"}
                    onClose={() => setShowForm(false)}
                >
                    <SupplierForm
                        supplier={selectedSupplier}
                        onCancel={() => setShowForm(false)}
                        onSuccess={() => {
                            setShowForm(false);
                            loadSuppliers();
                        }}
                    />
                </Modal>
            )}

        </div>
    );
}

export default SupplierPage;
