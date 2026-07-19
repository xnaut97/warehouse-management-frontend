import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

/**
 * Reusable sortable table header cell.
 *
 * Props:
 *  - field      {string}  – the sort key sent to the backend (e.g. "issueDate")
 *  - label      {string}  – the displayed column text
 *  - sortField  {string}  – currently active sort field (from useSort)
 *  - sortDir    {string}  – "asc" | "desc"  (from useSort)
 *  - onSort     {fn}      – (field) => void  (from useSort)
 *  - className  {string}  – optional extra classes for the <th>
 */
function SortableHeader({
    field,
    label,
    sortField,
    sortDir,
    onSort,
    className = "",
}) {
    const isActive = sortField === field;

    const Icon = isActive
        ? sortDir === "asc"
            ? ArrowUp
            : ArrowDown
        : ArrowUpDown;

    return (
        <th
            className={`px-6 py-4 font-semibold text-slate-700 select-none ${className}`}
        >
            <button
                type="button"
                onClick={() => onSort(field)}
                className={`group flex items-center gap-1.5 transition ${
                    isActive ? "text-pink-600" : "text-slate-700 hover:text-pink-500"
                }`}
            >
                {label}
                <Icon
                    size={14}
                    className={`shrink-0 transition ${
                        isActive ? "opacity-100" : "opacity-30 group-hover:opacity-60"
                    }`}
                />
            </button>
        </th>
    );
}

export default SortableHeader;
