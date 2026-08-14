import Card from "../../common/Card.jsx";

function ChartCard({
                       title,
                       description,
                       legend,
                       isEmpty,
                       emptyMessage = "Chưa có dữ liệu cho khoảng thời gian đã chọn.",
                       footer,
                       children
                   }) {
    return (
        <Card className="overflow-hidden p-5 sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <h3 className="text-base font-semibold text-gray-800 sm:text-lg">
                        {title}
                    </h3>

                    {description && (
                        <p className="mt-1 text-sm text-gray-500">
                            {description}
                        </p>
                    )}
                </div>

                {legend && legend.length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
                        {legend.map((item) => (
                            <span
                                key={item.label}
                                className="flex items-center gap-2"
                            >
                                <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                {item.label}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {isEmpty ? (
                <p className="py-14 text-center text-sm text-gray-500">
                    {emptyMessage}
                </p>
            ) : (
                children
            )}

            {footer && !isEmpty && (
                <p className="mt-4 text-xs text-gray-400">
                    {footer}
                </p>
            )}
        </Card>
    );
}

export default ChartCard;
