import { useState } from "react";

function CreateTransactionModal({
                                    open,
                                    onClose,
                                    onNavigate,
                                }) {
    const [goodsType, setGoodsType] = useState("MATERIAL");

    if (!open) {
        return null;
    }

    const handleCreate = (transactionType) => {
        if (goodsType === "PRODUCT") {
            onNavigate(
                transactionType === "RECEIPT"
                    ? "/product-receipts/new"
                    : "/product-issues/new"
            );

            onClose();
            return;
        }

        onNavigate(
            transactionType === "RECEIPT"
                ? "/receipts/new"
                : "/issues/new"
        );

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-slate-800">
                        Thêm phiếu nhập / xuất
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Chọn loại hàng hóa và loại phiếu.
                    </p>
                </div>

                <div className="mb-6">
                    <label className="mb-3 block font-medium text-slate-700">
                        Loại hàng hóa
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setGoodsType("MATERIAL")}
                            className={`rounded-xl border px-4 py-3 font-medium transition ${
                                goodsType === "MATERIAL"
                                    ? "border-(--color-primary) bg-pink-50 text-(--color-primary)"
                                    : "border-(--color-border) text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                            Nguyên vật liệu
                        </button>

                        <button
                            type="button"
                            onClick={() => setGoodsType("PRODUCT")}
                            className={`rounded-xl border px-4 py-3 font-medium transition ${
                                goodsType === "PRODUCT"
                                    ? "border-(--color-primary) bg-pink-50 text-(--color-primary)"
                                    : "border-(--color-border) text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                            Sản phẩm
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        type="button"
                        onClick={() => handleCreate("RECEIPT")}
                        className="w-full rounded-xl bg-(--color-primary-hover) px-5 py-3 font-medium text-white transition hover:bg-(--color-primary)"
                    >
                        Tạo phiếu nhập
                    </button>

                    <button
                        type="button"
                        onClick={() => handleCreate("ISSUE")}
                        className="w-full rounded-xl border border-(--color-border) px-5 py-3 font-medium text-slate-700 transition hover:bg-pink-50"
                    >
                        Tạo phiếu xuất
                    </button>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="mt-4 w-full rounded-xl px-5 py-3 font-medium text-slate-500 transition hover:bg-slate-50"
                >
                    Hủy
                </button>
            </div>
        </div>
    );
}

export default CreateTransactionModal;