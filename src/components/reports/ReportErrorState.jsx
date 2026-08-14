import { TriangleAlert } from "lucide-react";

import Button from "../common/Button.jsx";

function ReportErrorState({ message, onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-(--color-border) bg-white py-16 text-center shadow-sm">
            <TriangleAlert
                size={48}
                className="mb-4 text-red-400"
            />

            <h3 className="text-lg font-semibold text-gray-800">
                Không tải được báo cáo
            </h3>

            <p className="mt-2 max-w-md px-6 text-sm text-gray-500">
                {message}
            </p>

            {onRetry && (
                <Button
                    onClick={onRetry}
                    className="mt-6 rounded-xl bg-(--color-primary-hover) px-6 py-2.5 font-medium text-white transition hover:bg-(--color-primary)"
                >
                    Thử lại
                </Button>
            )}
        </div>
    );
}

export default ReportErrorState;
