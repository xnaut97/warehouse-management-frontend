import Badge from "../common/Badge.jsx";
import Card from "../common/Card.jsx";
import { formatNumber } from "../../utils/dashboardUtils.js";

function ReorderSuggestionCard({ items = [] }) {

    const visibleItems = items.slice(0, 6);

    return (
        <Card className="p-6">
            <div className="mb-5">
                <h3 className="text-lg font-semibold text-gray-800">
                    Đề xuất nhập thêm
                </h3>
                <p className="text-sm text-gray-500">
                    Số lượng đề xuất dựa trên mức tồn tối thiểu
                </p>
            </div>

            {visibleItems.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500">
                    Chưa có đề xuất nhập thêm nguyên vật liệu.
                </p>
            ) : (
                <div className="space-y-4">
                    {visibleItems.map((item) => (
                        <div
                            key={`${item.code}-${item.name}`}
                            className="flex items-center justify-between gap-4 rounded-xl bg-pink-50 p-4"
                        >
                            <div>
                                <p className="font-semibold text-gray-800">
                                    {item.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {item.code}
                                </p>
                            </div>
                            <Badge color="pink">
                                Nhập {formatNumber(item.recommendedPurchaseQuantity)}
                            </Badge>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );

}

export default ReorderSuggestionCard;
