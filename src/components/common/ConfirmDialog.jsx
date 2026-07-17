import Button from "./Button";

function ConfirmDialog({
                           title,
                           message,
                           confirmText = "Xác nhận",
                           cancelText = "Hủy",
                           onConfirm,
                           onCancel,
                           danger = false,
                       }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">

            <div className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-xl sm:p-6">

                <h2 className="text-xl font-semibold text-[var(--color-text)]">
                    {title}
                </h2>


                <p className="mt-3 text-[var(--color-text-secondary)]">
                    {message}
                </p>


                <div className="mt-8 flex flex-col-reverse justify-end gap-3 sm:flex-row">

                    <Button
                        variant="secondary"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </Button>


                    <Button
                        variant={danger ? "danger" : "primary"}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </Button>

                </div>

            </div>

        </div>
    );
}

export default ConfirmDialog;
