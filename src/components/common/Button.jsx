import clsx from "clsx";

function Button({
                    children,
                    type = "button",
                    variant = "primary",
                    size = "md",
                    className,
                    disabled = false,
                    ...props
                }) {
    return (
        <button
            type={type}
            disabled={disabled}
            className={clsx(
                "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-pink-200",
                "disabled:cursor-not-allowed disabled:opacity-50",

                {
                    "bg-(--color-primary) text-white hover:bg-(--color-primary-hover)":
                        variant === "primary",

                    "border border-(--color-border) bg-white text-(--color-primary) hover:bg-pink-50":
                        variant === "secondary",

                    "bg-red-500 text-white hover:bg-red-600":
                        variant === "danger",

                    "bg-transparent text-[var(--color-text)] hover:bg-pink-50":
                        variant === "ghost",
                },

                {
                    "min-h-10 px-4 text-sm": size === "sm",
                    "min-h-11 px-5": size === "md",
                    "min-h-12 px-6 text-lg": size === "lg",
                },

                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
