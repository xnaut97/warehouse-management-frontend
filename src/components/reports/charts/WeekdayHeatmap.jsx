import { WEEKDAY_LABELS } from "./chartTheme.js";
import { formatNumber, toNumber } from "../reportUtils.js";

const ROWS = [
    {
        key: "receiptCount",
        label: "Nhập kho",
        rgb: "236, 127, 169"
    },
    {
        key: "issueCount",
        label: "Xuất kho",
        rgb: "14, 165, 233"
    }
];

function WeekdayHeatmap({ data = [] }) {

    const maxValue = Math.max(
        1,
        ...data.flatMap((item) => [
            toNumber(item.receiptCount),
            toNumber(item.issueCount)
        ])
    );

    return (
        <div className="overflow-x-auto">
            <div className="min-w-[540px]">
                <div className="grid grid-cols-[96px_repeat(7,minmax(0,1fr))] gap-2">
                    <div />

                    {data.map((item) => (
                        <div
                            key={`head-${item.dayOfWeek}`}
                            className="text-center text-xs font-medium text-gray-500"
                        >
                            {WEEKDAY_LABELS[item.dayCode] ?? item.dayCode}
                        </div>
                    ))}

                    {ROWS.map((row) => (
                        <div
                            key={row.key}
                            className="contents"
                        >
                            <div className="flex items-center text-sm font-medium text-gray-700">
                                {row.label}
                            </div>

                            {data.map((item) => {
                                const value = toNumber(item[row.key]);
                                const intensity = value / maxValue;

                                return (
                                    <div
                                        key={`${row.key}-${item.dayOfWeek}`}
                                        title={`${WEEKDAY_LABELS[item.dayCode] ?? item.dayCode} - ${row.label}: ${formatNumber(value)} phiếu`}
                                        className="flex h-16 items-center justify-center rounded-xl border border-(--color-border) text-sm font-semibold"
                                        style={{
                                            backgroundColor: `rgba(${row.rgb}, ${value === 0 ? 0.04 : 0.15 + intensity * 0.75})`,
                                            color: intensity > 0.55
                                                ? "#ffffff"
                                                : "#374151"
                                        }}
                                    >
                                        {formatNumber(value)}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default WeekdayHeatmap;
