import {
    Boxes,
    Package,
    Warehouse,
    TriangleAlert
} from "lucide-react";

import StatCard from "../common/StatCard.jsx";

function InventoryStats({ inventories }) {

    const warehouseCount = new Set(

        inventories.map(item => item.warehouse)

    ).size;

    const materialCount = inventories.filter(

        item => item.itemGroup === "MATERIAL"

    ).length;

    const productCount = inventories.filter(

        item => item.itemGroup === "PRODUCT"

    ).length;

    const totalQuantity = inventories.reduce(

        (sum, item) =>

            sum + Number(item.quantity ?? 0),

        0

    );

    const lowStockCount = inventories.filter(

        item => Number(item.quantity ?? 0) <= 0

    ).length;

    return (

        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">

            <StatCard
                title="Kho"
                value={warehouseCount}
                icon={<Warehouse size={24}/>}
                color="bg-blue-100"
            />

            <StatCard
                title="Nguyên vật liệu"
                value={materialCount}
                icon={<Boxes size={24}/>}
                color="bg-green-100"
            />

            <StatCard
                title="Sản phẩm"
                value={productCount}
                icon={<Package size={24}/>}
                color="bg-pink-100"
            />

            <StatCard
                title="Tổng tồn kho"
                value={totalQuantity}
                icon={<Boxes size={24}/>}
                color="bg-purple-100"
            />

            <StatCard
                title="Hết hàng"
                value={lowStockCount}
                icon={<TriangleAlert size={24}/>}
                color="bg-red-100"
            />

        </div>

    );

}

export default InventoryStats;
