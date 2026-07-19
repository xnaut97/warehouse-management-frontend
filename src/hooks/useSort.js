import { useState } from "react";

/**
 * useSort – manages sortField + sortDir state for paginated tables.
 *
 * @param {string} defaultField  – initial sort column (e.g. "createdAt")
 * @param {string} defaultDir    – "asc" | "desc"
 *
 * Returns:
 *   sortField  {string}   – active field
 *   sortDir    {string}   – "asc" | "desc"
 *   onSort     {fn}       – (field) => void  — pass to SortableHeader
 *   sortParam  {string}   – Spring Pageable "sort" param, e.g. "issueDate,desc"
 */
function useSort(defaultField = "id", defaultDir = "desc") {
    const [sortField, setSortField] = useState(defaultField);
    const [sortDir, setSortDir] = useState(defaultDir);

    const onSort = (field) => {
        if (field === sortField) {
            // Toggle direction on the same column
            setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            // New column — default to ascending
            setSortField(field);
            setSortDir("asc");
        }
    };

    // Spring Data REST / Pageable format: "field,direction"
    const sortParam = `${sortField},${sortDir}`;

    return { sortField, sortDir, onSort, sortParam };
}

export default useSort;
