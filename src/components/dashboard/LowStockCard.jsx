import Badge from "../common/Badge.jsx";
import Card from "../common/Card.jsx";
import { formatNumber } from "../../utils/dashboardUtils.js";

function LowStockCard({ items = [] }) {

    const visibleItems = items.slice(0, 6);

    return (
        <Card className="p-6">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        Cảnh báo tồn tối thiểu
                    </h3>
                    <p className="text-sm text-gray-500">
                        Nguyên vật liệu cần xử lý sớm
                    </p>
                </div>
                <Badge color={items.length > 0 ? "red" : "green"}>
                    {items.length} cảnh báo
                </Badge>
            </div>

            {visibleItems.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500">
                    Không có nguyên vật liệu dưới mức tồn tối thiểu.
                </p>
            ) : (
                <div className="space-y-4">
                    {visibleItems.map((item) => (
                        <div
                            key={`${item.code}-${item.name}`}
                            className="rounded-xl border border-gray-100 p-4"
                        >
                            <div className="mb-3 flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {item.code}
                                    </p>
                                </div>
                                <Badge color="red">
                                    Thiếu {formatNumber(item.shortage)}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-gray-500">
                                        Hiện tại
                                    </p>
                                    <p className="font-semibold text-gray-800">
                                        {formatNumber(item.currentQuantity)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500">
                                        Tối thiểu
                                    </p>
                                    <p className="font-semibold text-gray-800">
                                        {formatNumber(item.minimumStock)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );

}

export default LowStockCard;
