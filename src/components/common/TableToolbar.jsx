import SearchInput from "./SearchInput.jsx";

function TableToolbar({
                          search,
                          setSearch,
                          children,
                      }) {
    return (
        <div className="mb-6 flex flex-col items-stretch justify-between gap-4 md:flex-row md:items-center">
            <div className="w-full md:w-96">
                <SearchInput
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm kiếm..."
                />
            </div>

            {children && (
                <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap md:w-auto md:justify-end">
                    {children}
                </div>
            )}
        </div>
    );
}

export default TableToolbar;
