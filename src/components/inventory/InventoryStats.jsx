import {
    Boxes,
    Package,
    CircleDollarSign,
    TriangleAlert,
    Hourglass
} from "lucide-react";

import StatCard from "../common/StatCard.jsx";

import {
    formatCompactCurrency,
    toNumber
} from "../reports/reportUtils.js";

function InventoryStats({ materials = [], products = [] }) {

    const totalValue = [...materials, ...products].reduce(

        (sum, item) => sum + toNumber(item.inventoryValue),

        0

    );

    const thresholdAlertCount = materials.filter(

        item => item.thresholdStatus && item.thresholdStatus !== "NORMAL"

    ).length;

    const fefoCount = products.filter(

        item => item.expiryStatus === "FEFO"

    ).length;

    return (

        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">

            <StatCard
                title="Nguyên vật liệu"
                value={materials.length}
                icon={<Boxes size={24}/>}
                color="bg-green-100"
            />

            <StatCard
                title="Sản phẩm"
                value={products.length}
                icon={<Package size={24}/>}
                color="bg-pink-100"
            />

            <StatCard
                title="Tổng vốn tồn"
                value={formatCompactCurrency(totalValue)}
                icon={<CircleDollarSign size={24}/>}
                color="bg-purple-100"
            />

            <StatCard
                title="Cảnh báo min/max"
                value={thresholdAlertCount}
                icon={<TriangleAlert size={24}/>}
                color="bg-red-100"
            />

            <StatCard
                title="Sản phẩm cần FEFO"
                value={fefoCount}
                icon={<Hourglass size={24}/>}
                color="bg-yellow-100"
            />

        </div>

    );

}

export default InventoryStats;
