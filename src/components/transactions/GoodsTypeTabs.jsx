function GoodsTypeTabs({ value, onChange }) {

    const tabs = [
        {
            value: "MATERIAL",
            label: "Nguyên vật liệu",
        },
        {
            value: "PRODUCT",
            label: "Sản phẩm",
        },
    ];

    return (
        <div className="flex overflow-x-auto border-b border-(--color-border)">
            {tabs.map((tab) => {
                const active = value === tab.value;

                return (
                    <button
                        key={tab.value}
                        type="button"
                        onClick={() => onChange(tab.value)}
                        className={`
                            relative shrink-0 px-5 py-3 text-sm font-semibold transition sm:text-base
                            ${
                            active
                                ? "text-(--color-primary-hover)"
                                : "text-slate-500 hover:text-slate-700"
                        }
                        `}
                    >
                        {tab.label}

                        {active && (
                            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-(--color-primary)" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export default GoodsTypeTabs;