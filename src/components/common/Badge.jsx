import clsx from "clsx";

function Badge({
                   children,
                   color = "gray"
               }) {
    return (
        <span
            className={clsx(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",

                {
                    "bg-green-100 text-green-700": color === "green",
                    "bg-red-100 text-red-700": color === "red",
                    "bg-yellow-100 text-yellow-700": color === "yellow",
                    "bg-pink-100 text-pink-700": color === "pink",
                    "bg-gray-100 text-gray-700": color === "gray",
                }
            )}
        >
            {children}
        </span>
    );
}

export default Badge;