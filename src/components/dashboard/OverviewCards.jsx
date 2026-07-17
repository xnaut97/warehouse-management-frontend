import {
    ArrowDownToLine,
    ArrowUpFromLine,
    Boxes,
    CircleDollarSign,
    Factory,
    Package
} from "lucide-react";

import StatCard from "../common/StatCard.jsx";
import { formatCurrency, formatNumber } from "../../utils/dashboardUtils.js";
import {useNavigate} from "react-router-dom";

function OverviewCards({ data }) {

    const navigate = useNavigate();

    const cards = [
        {
            title: "Tổng nguyên vật liệu",
            value: formatNumber(data?.totalRawMaterials),
            icon: <Boxes size={24} className="text-pink-600" />,
            path: "/materials"
        },
        {
            title: "Tổng sản phẩm",
            value: formatNumber(data?.totalFinishedProducts),
            icon: <Package size={24} className="text-sky-600" />,
            path: "/products",
        },
        {
            title: "Tổng giá trị tồn kho",
            value: formatCurrency(data?.totalInventoryValue),
            icon: <CircleDollarSign size={24} className="text-emerald-600" />,
            path: "/inventories",
        },
        {
            title: "Tổng phiếu nhập",
            value: formatNumber(data?.totalGoodsReceived),
            icon: <ArrowDownToLine size={24} className="text-emerald-600" />,
            path: "/receipts",
        },
        {
            title: "Tổng phiếu xuất",
            value: formatNumber(data?.totalGoodsIssued),
            icon: <ArrowUpFromLine size={24} className="text-orange-600" />,
            path: "/issues",
        },
        {
            title: "Tồn kho hiện tại",
            value: formatNumber(data?.currentInventoryQuantity),
            icon: <Factory size={24} className="text-indigo-600" />,
            path: "/inventories",
        }
    ];

    return (
        <section>
            <div className="mb-5 space-y-1">
                <h2 className="text-2xl font-bold text-gray-800">
                    Tổng quan
                </h2>
                <p className="text-md text-gray-500">
                    Các chỉ số vận hành chính của hệ thống kho.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {cards.map((card) => (
                    <StatCard
                        key={card.title}
                        title={card.title}
                        value={card.value}
                        icon={card.icon}
                        onClick={card.path ? () => navigate(card.path) : undefined}
                    />
                ))}
            </div>
        </section>
    );

}

export default OverviewCards;
