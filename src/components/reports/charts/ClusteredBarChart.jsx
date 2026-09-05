import { AXIS_COLOR, LABEL_COLOR } from "./chartTheme.js";
import { formatNumber, toNumber } from "../reportUtils.js";

const PADDING_LEFT = 64;
const PADDING_RIGHT = 24;
const PLOT_TOP = 20;
const PLOT_HEIGHT = 190;
const BAR_WIDTH = 16;

function ClusteredBarChart({
                               data = [],
                               series = [],
                               formatValue = formatNumber,
                               formatTooltip = formatNumber
                           }) {

    const maxValue = Math.max(
        1,
        ...data.flatMap((item) =>
            series.map((entry) => Math.abs(toNumber(item[entry.key])))
        )
    );

    const groupWidth = Math.max(
        160,
        series.length * (BAR_WIDTH + 4) + 48
    );


    const plotWidth = Math.max(420, data.length * groupWidth);
    const width = plotWidth + PADDING_LEFT + PADDING_RIGHT;
    const height = PLOT_TOP + PLOT_HEIGHT + 72;
    const baseline = PLOT_TOP + PLOT_HEIGHT;
    const step = plotWidth / Math.max(data.length, 1);

    return (
        <div className="overflow-x-auto">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-72 min-w-full"
                role="img"
                aria-label="Biểu đồ cột nhóm"
            >
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                    const y = baseline - ratio * PLOT_HEIGHT;

                    return (
                        <g key={ratio}>
                            <line
                                x1={PADDING_LEFT}
                                x2={width - PADDING_RIGHT}
                                y1={y}
                                y2={y}
                                stroke={AXIS_COLOR}
                            />
                            <text
                                x={PADDING_LEFT - 8}
                                y={y + 4}
                                textAnchor="end"
                                fill={LABEL_COLOR}
                                fontSize="11"
                            >
                                {formatValue(maxValue * ratio)}
                            </text>
                        </g>
                    );
                })}

                {data.map((item, index) => {
                    const groupCenter = PADDING_LEFT + step * index + step / 2;
                    const totalWidth = series.length * (BAR_WIDTH + 4) - 4;
                    const startX = groupCenter - totalWidth / 2;
                    const labelLines = splitLabel(item.label);

                    return (
                        <g key={item.label ?? index}>
                            {series.map((entry, entryIndex) => {
                                const value = Math.abs(toNumber(item[entry.key]));
                                const barHeight = (value / maxValue) * PLOT_HEIGHT;
                                const x = startX + entryIndex * (BAR_WIDTH + 4);

                                return (
                                    <g key={entry.key}>
                                        <rect
                                            x={x}
                                            y={baseline - barHeight}
                                            width={BAR_WIDTH}
                                            height={Math.max(barHeight, value > 0 ? 2 : 0)}
                                            rx="4"
                                            fill={entry.color}
                                        >
                                            <title>
                                                {`${item.label} - ${entry.label}: ${formatTooltip(item[entry.key])}`}
                                            </title>
                                        </rect>
                                    </g>
                                );
                            })}

                            <text
                                x={groupCenter}
                                y={baseline + 18}
                                textAnchor="middle"
                                fill={LABEL_COLOR}
                                fontSize="12"
                            >
                                {labelLines.map((line, lineIndex) => (
                                    <tspan
                                        key={lineIndex}
                                        x={groupCenter}
                                        dy={lineIndex === 0 ? 0 : 16}
                                    >
                                        {line}
                                    </tspan>
                                ))}
                            </text>

                            {item.subLabel && (
                                <text
                                    x={groupCenter}
                                    y={baseline + 54}
                                    textAnchor="middle"
                                    fill="#9ca3af"
                                    fontSize="10"
                                >
                                    {item.subLabel}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );

    function splitLabel(label, maxLength = 20) {
        if (label.length <= maxLength) {
            return [label];
        }

        const words = label.split(" ");
        const lines = [];
        let currentLine = "";

        words.forEach((word) => {
            const nextLine = currentLine
                ? `${currentLine} ${word}`
                : word;

            if (nextLine.length <= maxLength) {
                currentLine = nextLine;
            } else {
                if (currentLine) {
                    lines.push(currentLine);
                }
                currentLine = word;
            }
        });

        if (currentLine) {
            lines.push(currentLine);
        }

        return lines.slice(0, 2);
    }
}

export default ClusteredBarChart;
