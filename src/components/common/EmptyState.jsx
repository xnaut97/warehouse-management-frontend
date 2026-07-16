import { PackageOpen } from "lucide-react";

function EmptyState({
                        title,
                        description
                    }) {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <PackageOpen
                size={56}
                className="mb-5 text-pink-300"
            />

            <h3 className="text-lg font-semibold">
                {title}
            </h3>

            <p className="mt-2 text-gray-500">
                {description}
            </p>
        </div>
    );
}

export default EmptyState;