function ReportFilters({ children }) {
    return (
        <div className="mb-6 rounded-2xl border border-(--color-border) bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {children}
            </div>
        </div>
    );
}

export function FilterField({ label, children }) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-600">
                {label}
            </span>
            {children}
        </label>
    );
}

export function FilterInput(props) {
    return (
        <input
            {...props}
            className="w-full rounded-xl border border-(--color-border) bg-white px-4 py-2.5 text-sm outline-none transition focus:border-(--color-primary)"
        />
    );
}

export function FilterSelect(props) {
    return (
        <select
            {...props}
            className="w-full rounded-xl border border-(--color-border) bg-white px-4 py-2.5 text-sm outline-none transition focus:border-(--color-primary)"
        />
    );
}

export default ReportFilters;
