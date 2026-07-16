import { Search } from "lucide-react";

import Input from "./Input";

function SearchInput(props) {
    return (
        <div className="relative">
            <Search
                size={18}
                className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
            />

            <Input
                className="pl-11"
                placeholder="Tìm kiếm..."
                {...props}
            />
        </div>
    );
}

export default SearchInput;
