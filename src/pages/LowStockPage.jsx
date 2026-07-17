import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import inventoryApi from "../api/inventoryApi";

import PageHeader from "../components/common/PageHeader";

import LowStockTable from "../components/inventory/LowStockTable";

function LowStockPage() {

    const [items, setItems] = useState([]);

    const loadLowStock = async () => {

        try {

            const response = await inventoryApi.getLowStock();

            setItems(response.data.data);

        } catch (error) {

            toast.error("Không thể tải danh sách cảnh báo tồn kho.");

        }

    };

    useEffect(() => {

        loadLowStock();

    }, []);

    return (

        <div className="px-4 py-6 sm:px-6 lg:p-12">

            <PageHeader
                title="Cảnh báo tồn kho"
                description="Danh sách nguyên vật liệu có số lượng tồn kho dưới mức tối thiểu."
            />

            <LowStockTable
                items={items}
            />

        </div>

    );

}

export default LowStockPage;
