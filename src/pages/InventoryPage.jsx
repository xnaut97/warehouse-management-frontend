import { useEffect, useState } from "react";

import inventoryApi from "../api/inventoryApi.js";

import PageHeader from "../components/common/PageHeader";
import TableToolbar from "../components/common/TableToolbar";
import Pagination from "../components/common/Pagination.jsx";

import InventoryTable from "../components/inventory/InventoryTable";
import InventoryStats from "../components/inventory/InventoryStats.jsx";

function InventoryPage() {

    const [inventories, setInventories] = useState([]);

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(0);

    const [pageSize, setPageSize] = useState(8);

    const [totalPages, setTotalPages] = useState(0);

    const loadInventories = async () => {

        try {

            const response = await inventoryApi.getAll({
                page,
                size: pageSize,
            });

            const data = response.data.data;

            setInventories(data.content);

            setTotalPages(data.totalPages);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        loadInventories();

    }, [page, pageSize]);

    const filteredInventories = inventories.filter((inventory) => {

        const keyword = search.toLowerCase();

        return (

            inventory.materialCode.toLowerCase().includes(keyword) ||

            inventory.materialName.toLowerCase().includes(keyword) ||

            inventory.warehouse.toLowerCase().includes(keyword)

        );

    });

    return (

        <div>

            <PageHeader
                title="Tồn kho"
                description="Theo dõi số lượng tồn kho của nguyên vật liệu tại các kho."
            />

            <InventoryStats
                inventories={filteredInventories}
            />

            <TableToolbar
                search={search}
                setSearch={setSearch}
            />

            <InventoryTable
                inventories={filteredInventories}
            />

            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

        </div>

    );

}

export default InventoryPage;
