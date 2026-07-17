import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import warehouseApi from "../api/warehouseApi.js";

import PageHeader from "../components/common/PageHeader.jsx";
import TableToolbar from "../components/common/TableToolbar.jsx";
import Modal from "../components/common/Modal.jsx";
import Pagination from "../components/common/Pagination.jsx";

import WarehouseTable from "../components/warehouses/WarehouseTable.jsx";
import WarehouseForm from "../components/warehouses/WarehouseForm.jsx";

function WarehousePage() {

    const [warehouses, setWarehouses] = useState([]);

    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [selectedWarehouse, setSelectedWarehouse] = useState(null);

    const [page, setPage] = useState(0);

    const [pageSize, setPageSize] = useState(8);

    const [totalPages, setTotalPages] = useState(0);

    const loadWarehouses = async () => {

        try {

            const response =
                await warehouseApi.getAllWarehouses({
                    page,
                    size: pageSize,
                });

            const data = response.data.data;

            setWarehouses(data.content);

            setTotalPages(data.totalPages);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        loadWarehouses();

    }, [page, pageSize]);

    const filteredWarehouses = warehouses.filter((warehouse) => {

        const keyword = search.toLowerCase();

        return (

            warehouse.name.toLowerCase().includes(keyword) ||

            warehouse.code.toLowerCase().includes(keyword) ||

            (warehouse.address || "")
                .toLowerCase()
                .includes(keyword) ||

            (warehouse.managerName || "")
                .toLowerCase()
                .includes(keyword)

        );

    });

    return (

        <div>

            <PageHeader

                title="Kho"

                description="Quản lý thông tin kho."

                actionLabel="Thêm kho"

                actionIcon={<Plus size={18}/>}

                onAction={() => {

                    setSelectedWarehouse(null);

                    setShowForm(true);

                }}

            />

            <TableToolbar

                search={search}

                setSearch={setSearch}

            />

            <WarehouseTable

                warehouses={filteredWarehouses}

                onEdit={(warehouse) => {

                    setSelectedWarehouse(warehouse);

                    setShowForm(true);

                }}

                onRefresh={loadWarehouses}

            />

            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

            {

                showForm &&

                <Modal

                    title={

                        selectedWarehouse

                            ? "Chỉnh sửa kho"

                            : "Thêm kho"

                    }

                    onClose={() =>

                        setShowForm(false)

                    }

                >

                    <WarehouseForm

                        warehouse={selectedWarehouse}

                        onCancel={() =>

                            setShowForm(false)

                        }

                        onSuccess={() => {

                            setShowForm(false);

                            loadWarehouses();

                        }}

                    />

                </Modal>

            }

        </div>

    );

}

export default WarehousePage;
