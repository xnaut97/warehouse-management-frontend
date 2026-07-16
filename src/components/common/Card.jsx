import clsx from "clsx";

function Card({ children, className }) {
    return (
        <div
            className={clsx(
                "rounded-2xl border border-[var(--color-border)] bg-white shadow-sm",
                className
            )}
        >
            {children}
        </div>
    );
}

export default Card;