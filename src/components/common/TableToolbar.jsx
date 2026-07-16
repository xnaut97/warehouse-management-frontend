import SearchInput from "./SearchInput.jsx";

function TableToolbar({
                          search,
                          setSearch,
                          children,
                      }) {
    return (
        <div className="mb-6 flex items-center justify-between gap-4">
            <div className="w-96">
                <SearchInput
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm kiếm..."
                />
            </div>

            {children}
        </div>
    );
}

export default TableToolbar;
