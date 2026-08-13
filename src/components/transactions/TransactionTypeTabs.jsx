import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

function TransactionTypeTabs({ value, onChange }) {

    const tabs = [
        {
            value: "RECEIPT",
            label: "Nhập kho",
            icon: ArrowDownToLine,
        },
        {
            value: "ISSUE",
            label: "Xuất kho",
            icon: ArrowUpFromLine,
        },
    ];

    return (
        <div className="rounded-2xl border border-(--color-border) bg-white p-1.5 shadow-sm">
            <div className="grid grid-cols-2 gap-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const active = value === tab.value;

                    return (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => onChange(tab.value)}
                            className={`
                                flex items-center justify-center gap-2 rounded-xl px-4 py-3
                                text-sm font-semibold transition sm:text-base
                                ${
                                active
                                    ? "bg-(--color-primary) text-white shadow-sm"
                                    : "text-slate-600 hover:bg-pink-50 hover:text-(--color-primary-hover)"
                            }
                            `}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default TransactionTypeTabs;