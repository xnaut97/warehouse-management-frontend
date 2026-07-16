import {
    ArrowDownToLine,
    ArrowUpFromLine,
    Boxes,
    Package
} from "lucide-react";

import StatCard from "../common/StatCard.jsx";
import { formatNumber } from "../../utils/dashboardUtils.js";
import InventoryMovementChart from "./InventoryMovementChart.jsx";
import InventoryValueChart from "./InventoryValueChart.jsx";
import {useNavigate} from "react-router-dom";

function InventoryAnalysis({ analysis, trend }) {

    const navigate = useNavigate();

    return (
        <section>
            <div className="mb-5">
                <h2 className="text-2xl font-bold text-gray-800">
                    Phân tích tồn kho
                </h2>
                <p className="text-md text-gray-500">
                    Theo dõi cơ cấu hàng hóa, biến động nhập xuất và tồn cuối.
                </p>
            </div>

            <div className="mb-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Tồn kho nguyên vật liệu"
                    value={formatNumber(analysis?.rawMaterialInventory)}
                    icon={<Boxes size={24} className="text-pink-600" />}
                    onClick={() => navigate("/materials")}
                />

                <StatCard
                    title="Tồn kho thành phẩm"
                    value={formatNumber(analysis?.finishedProductInventory)}
                    icon={<Package size={24} className="text-sky-600" />}
                    onClick={() => navigate("/products")}
                />

                <StatCard
                    title="Nhập kho"
                    value={formatNumber(analysis?.stockIn)}
                    icon={<ArrowDownToLine size={24} className="text-emerald-600" />}
                    onClick={() => navigate("/receipts")}
                />

                <StatCard
                    title="Xuất kho"
                    value={formatNumber(analysis?.stockOut)}
                    icon={<ArrowUpFromLine size={24} className="text-orange-600" />}
                    onClick={() => navigate("/issues")}
                />
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]">
                <InventoryMovementChart data={trend} />
                <InventoryValueChart data={analysis} />
            </div>
        </section>
    );

}

export default InventoryAnalysis;
