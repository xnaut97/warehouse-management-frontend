import LowStockCard from "./LowStockCard.jsx";
import ReorderSuggestionCard from "./ReorderSuggestionCard.jsx";
import SlowMovingCard from "./SlowMovingCard.jsx";
import TrendChart from "./TrendChart.jsx";

function DecisionSupport({ data }) {

    const trend = data?.inventoryTrend ?? [];

    return (
        <section>
            <div className="mb-5">
                <h2 className="text-2xl font-bold text-gray-800">
                    Hỗ trợ ra quyết định
                </h2>
                <p className="text-md text-gray-500">
                    Cảnh báo tự động và xu hướng giúp ưu tiên hành động vận hành kho.
                </p>
            </div>

            <div className="mb-6 grid gap-6 xl:grid-cols-2">
                <LowStockCard items={data?.lowStockMaterials ?? []} />
                <ReorderSuggestionCard items={data?.replenishmentRecommendations ?? []} />
            </div>

            <div className="mb-6 grid gap-6 xl:grid-cols-2">
                <SlowMovingCard
                    title="Sản phẩm bán chậm"
                    description="Mặt hàng không phát sinh xuất kho trong 90 ngày"
                    items={data?.slowMovingMaterials ?? []}
                />

                <SlowMovingCard
                    title="Tỷ lệ chênh lệch cao"
                    description="Mặt hàng có chênh lệch kiểm kê cần rà soát"
                    items={data?.highVarianceMaterials ?? []}
                    valueKey="varianceQuantity"
                />
            </div>

            <TrendChart data={trend} />
        </section>
    );

}

export default DecisionSupport;
