import { useEffect, useState } from "react";
import { Printer } from "lucide-react";
import toast from "react-hot-toast";

import Modal from "../common/Modal.jsx";
import Button from "../common/Button.jsx";

const getTodayStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const getSevenDaysAgoStr = () => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

function PrintTransactionSummaryModal({
    open,
    onClose,
    transactionType,
    onSubmit
}) {
    const [fromDate, setFromDate] = useState(getSevenDaysAgoStr());
    const [toDate, setToDate] = useState(getTodayStr());
    const [includeMaterial, setIncludeMaterial] = useState(true);
    const [includeProduct, setIncludeProduct] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setFromDate(getSevenDaysAgoStr());
            setToDate(getTodayStr());
            setIncludeMaterial(true);
            setIncludeProduct(true);
            setLoading(false);
        }
    }, [open]);

    if (!open) return null;

    const isReceipt = transactionType === "RECEIPT";
    const typeLabel = isReceipt ? "Nhập kho" : "Xuất kho";

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fromDate || !toDate) {
            toast.error("Vui lòng chọn đầy đủ khoảng thời gian (Từ ngày và Đến ngày)");
            return;
        }

        if (new Date(fromDate) > new Date(toDate)) {
            toast.error("Từ ngày không thể lớn hơn Đến ngày");
            return;
        }

        if (!includeMaterial && !includeProduct) {
            toast.error("Vui lòng chọn ít nhất một loại (Nguyên vật liệu hoặc Sản phẩm)");
            return;
        }

        setLoading(true);
        try {
            await onSubmit({
                fromDate,
                toDate,
                includeMaterial,
                includeProduct
            });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={`In phiếu ${typeLabel}`}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Khoảng thời gian <span className="text-red-500">*</span>
                    </label>
                    <p className="mb-3 text-xs text-slate-500">
                        Chọn {isReceipt ? "Ngày nhập" : "Ngày xuất"} để giới hạn các bản ghi được hiển thị trong phiếu in.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600">
                                Từ ngày <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-pink-100 disabled:bg-gray-50"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600">
                                Đến ngày <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-pink-100 disabled:bg-gray-50"
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                        Loại {typeLabel}
                    </label>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={includeMaterial}
                                onChange={(e) => setIncludeMaterial(e.target.checked)}
                                disabled={loading}
                                className="h-4 w-4 rounded border-gray-300 text-(--color-primary) focus:ring-pink-200"
                            />
                            <span className="font-medium">Nguyên vật liệu</span>
                        </label>

                        <label className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={includeProduct}
                                onChange={(e) => setIncludeProduct(e.target.checked)}
                                disabled={loading}
                                className="h-4 w-4 rounded border-gray-300 text-(--color-primary) focus:ring-pink-200"
                            />
                            <span className="font-medium">Sản phẩm</span>
                        </label>
                    </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-(--color-border) pt-5 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl border border-(--color-border) px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        Hủy
                    </Button>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 rounded-xl bg-(--color-primary) px-6 py-2.5 text-sm font-medium text-white transition hover:bg-(--color-primary-hover) disabled:opacity-50"
                    >
                        <Printer size={16} />
                        {loading ? "Đang xử lý..." : "In phiếu"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default PrintTransactionSummaryModal;
