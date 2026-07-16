import clsx from "clsx";

function Input({
                   label,
                   error,
                   className,
                   ...props
               }) {
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="text-sm font-medium text-[var(--color-text)]">
                    {label}
                </label>
            )}

            <input
                className={clsx(
                    "h-11 rounded-xl border border-[var(--color-border)] bg-white px-4",
                    "outline-none transition-all duration-200",
                    "focus:border-[var(--color-primary)] focus:ring-2 focus:ring-pink-100",
                    error && "border-red-500",
                    className
                )}
                {...props}
            />

            {error && (
                <span className="text-sm text-red-500">
                    {error}
                </span>
            )}
        </div>
    );
}

export default Input;