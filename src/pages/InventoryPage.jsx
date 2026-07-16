import { useEffect, useState } from "react";

import inventoryApi from "../api/inventoryApi.js";

import PageHeader from "../components/common/PageHeader";
import TableToolbar from "../components/common/TableToolbar";

import InventoryTable from "../components/inventory/InventoryTable";
import InventoryStats from "../components/inventory/InventoryStats.jsx";

function InventoryPage() {

    const [inventories, setInventories] = useState([]);

    const [search, setSearch] = useState("");

    const loadInventories = async () => {

        try {

            const response = await inventoryApi.getAll({
                page: 0,
                size: 20,
                keyword: search
            });

            setInventories(response.data.data.content);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        loadInventories();

    }, []);

    useEffect(() => {

        const timeout = setTimeout(() => {

            loadInventories();

        }, 300);

        return () => clearTimeout(timeout);

    }, [search]);

    return (

        <div>

            <PageHeader
                title="Tồn kho"
                description="Theo dõi số lượng tồn kho của nguyên vật liệu tại các kho."
            />

            <InventoryStats
                inventories={inventories}
            />

            <TableToolbar
                search={search}
                setSearch={setSearch}
            />

            <InventoryTable
                inventories={inventories}
            />

        </div>

    );

}

export default InventoryPage;