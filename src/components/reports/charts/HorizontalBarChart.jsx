import { colorAt } from "./chartTheme.js";
import { formatNumber, toNumber } from "../reportUtils.js";

function HorizontalBarChart({
                                data = [],
                                formatValue = formatNumber,
                                secondaryLabel
                            }) {

    const maxValue = Math.max(
        1,
        ...data.map((item) => Math.abs(toNumber(item.value)))
    );

    return (
        <div className="space-y-4">
            {data.map((item, index) => {
                const value = Math.abs(toNumber(item.value));
                const percent = (value / maxValue) * 100;

                return (
                    <div key={item.label ?? index}>
                        <div className="mb-2 flex items-start justify-between gap-4 text-sm">
                            <p className="min-w-0 break-words font-medium text-gray-800">
                                {item.label}
                            </p>

                            <div className="shrink-0 text-right">
                                <p className="font-semibold text-gray-800">
                                    {formatValue(item.value)}
                                </p>

                                {secondaryLabel && (
                                    <p className="text-xs text-gray-500">
                                        {secondaryLabel(item)}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                            <div
                                className="h-full rounded-full"
                                style={{
                                    width: `${Math.max(percent, value > 0 ? 2 : 0)}%`,
                                    backgroundColor: item.color ?? colorAt(index)
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default HorizontalBarChart;
