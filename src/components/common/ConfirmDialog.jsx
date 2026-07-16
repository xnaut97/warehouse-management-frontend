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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">

            <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-xl">

                <h2 className="text-xl font-semibold text-[var(--color-text)]">
                    {title}
                </h2>


                <p className="mt-3 text-[var(--color-text-secondary)]">
                    {message}
                </p>


                <div className="mt-8 flex justify-end gap-3">

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
