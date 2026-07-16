import Button from "./Button.jsx";

function PageHeader({
                        title,
                        description,
                        actionLabel,
                        actionIcon,
                        onAction,
                    }) {
    return (
        <div className="mb-8 flex items-start justify-between">
            <div>
                <h1 className="text-3xl font-bold text-(--color-text)">
                    {title}
                </h1>

                {description && (
                    <p className="mt-2 text-[15px] text-(--color-text-secondary)">
                        {description}
                    </p>
                )}
            </div>

            {actionLabel && (
                <Button onClick={onAction}>
                    {actionIcon}
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}

export default PageHeader;