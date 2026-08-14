function ReportKpiCard({
                           title,
                           value,
                           description,
                           icon,
                           tone = "default",
                           rows = [],
                           unavailable = false,
                           unavailableMessage
                       }) {

    const toneClass = {
        default: "text-gray-800",
        positive: "text-emerald-600",
        negative: "text-red-600",
        muted: "text-gray-400"
    }[unavailable ? "muted" : tone];

    return (
        <div className="flex h-full flex-col rounded-2xl border border-(--color-border) bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
                <h3 className="text-sm text-gray-500">
                    {title}
                </h3>

                {icon && (
                    <span className="shrink-0 text-(--color-primary)">
                        {icon}
                    </span>
                )}
            </div>

            {unavailable ? (
                <p className="text-base font-medium text-gray-400">
                    Không đủ dữ liệu
                </p>
            ) : (
                <p className={`text-2xl font-bold break-words sm:text-3xl ${toneClass}`}>
                    {value}
                </p>
            )}

            {rows.length > 0 && !unavailable && (
                <dl className="mt-4 space-y-2">
                    {rows.map((row) => (
                        <div
                            key={row.label}
                            className="flex items-baseline justify-between gap-3 text-sm"
                        >
                            <dt className="text-gray-500">
                                {row.label}
                            </dt>
                            <dd className="font-semibold text-gray-700">
                                {row.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            )}

            {(unavailable ? unavailableMessage : description) && (
                <p className="mt-4 text-xs text-gray-400">
                    {unavailable ? unavailableMessage : description}
                </p>
            )}
        </div>
    );
}

export default ReportKpiCard;
