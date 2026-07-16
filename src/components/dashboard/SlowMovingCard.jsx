import Badge from "../common/Badge.jsx";
import Card from "../common/Card.jsx";
import { formatNumber } from "../../utils/dashboardUtils.js";

function formatDate(value) {
    if (!value) return "Chưa xuất";

    return new Intl.DateTimeFormat("vi-VN").format(new Date(value));
}

function SlowMovingCard({ items = [], title, description, valueKey = "currentQuantity" }) {

    const visibleItems = items.slice(0, 6);

    return (
        <Card className="p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {description}
                    </p>
                </div>
                <Badge color={items.length > 0 ? "yellow" : "green"}>
                    {items.length}
                </Badge>
            </div>

            {visibleItems.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500">
                    Chưa có dữ liệu cần cảnh báo.
                </p>
            ) : (
                <div className="space-y-4">
                    {visibleItems.map((item) => (
                        <div
                            key={`${item.code ?? item.materialCode}-${item.name ?? item.materialName}`}
                            className="rounded-xl border border-gray-100 p-4"
                        >
                            <div className="mb-2 flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {item.name ?? item.materialName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {item.code ?? item.materialCode}
                                    </p>
                                </div>
                                <p className="text-right text-sm font-semibold text-gray-800">
                                    {formatNumber(item[valueKey])}
                                </p>
                            </div>
                            {item.lastIssueDate !== undefined && (
                                <p className="text-xs text-gray-500">
                                    Lần xuất cuối: {formatDate(item.lastIssueDate)}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );

}

export default SlowMovingCard;
