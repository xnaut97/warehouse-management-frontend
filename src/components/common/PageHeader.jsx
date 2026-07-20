import Button from "./Button.jsx";

function PageHeader({
                        title,
                        description,
                        actionLabel,
                        actionIcon,
                        onAction,
                    }) {
    return (
        <div className="mb-6 flex flex-col items-stretch justify-between gap-4 sm:mb-8 sm:flex-row sm:items-start">
            <div className="min-w-0">
                <h1 className="text-2xl font-bold text-(--color-text) sm:text-3xl">
                    {title}
                </h1>

                {description && (
                    <p className="mt-2 text-sm text-(--color-text-secondary) sm:text-[15px]">
                        {description}
                    </p>
                )}
            </div>

            {actionLabel && (
                <Button
                    onClick={onAction}
                    className="rounded-xl bg-(--color-primary-hover) px-6 py-3 font-medium text-white transition
                    hover:bg-(--color-primary) disabled:opacity-50"
                >
                    {actionIcon}
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}

export default PageHeader;
