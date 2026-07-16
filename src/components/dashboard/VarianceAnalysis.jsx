import {
    ClipboardCheck,
    CircleDollarSign,
    Scale
} from "lucide-react";

import StatCard from "../common/StatCard.jsx";
import { formatCurrency, formatNumber } from "../../utils/dashboardUtils.js";
import VarianceChart from "./VarianceChart.jsx";

function VarianceAnalysis({ data }) {

    return (
        <section>
            <div className="mb-5">
                <h2 className="text-2xl font-bold text-gray-800">
                    Phân tích chênh lệch kiểm kê
                </h2>
                <p className="text-md text-gray-500">
                    Tổng hợp sai lệch phát sinh khi kiểm kê hàng tồn.
                </p>
            </div>

            <div className="mb-6 grid gap-6 md:grid-cols-3">
                <StatCard
                    title="Tổng số phiếu kiểm kê"
                    value={formatNumber(data?.totalStocktakingRecords)}
                    icon={<ClipboardCheck size={24} className="text-pink-600" />}
                />

                <StatCard
                    title="Tổng số lượng chênh lệch"
                    value={formatNumber(data?.totalVarianceQuantity)}
                    icon={<Scale size={24} className="text-orange-600" />}
                />

                <StatCard
                    title="Tổng giá trị chênh lệch"
                    value={formatCurrency(data?.totalVarianceValue)}
                    icon={<CircleDollarSign size={24} className="text-emerald-600" />}
                />
            </div>

            <VarianceChart items={data?.topVarianceItems ?? []} />
        </section>
    );

}

export default VarianceAnalysis;
