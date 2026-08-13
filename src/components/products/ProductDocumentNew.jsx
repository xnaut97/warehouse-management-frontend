import { ArrowDownToLine, ArrowLeft, ArrowUpFromLine } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ProductDocumentForm from "./ProductDocumentForm.jsx";

function ProductDocumentNew({ transactionType }) {

    const navigate = useNavigate();

    const isReceipt = transactionType === "RECEIPT";

    const handleSuccess = (id) => {

        navigate(
            isReceipt
                ? `/product-receipts/${id}`
                : `/product-issues/${id}`
        );

    };

    return (

        <div className="min-h-full bg-(--color-background) px-4 py-6 sm:px-6 lg:px-12 lg:py-10">

            <div className="mx-auto max-w-4xl space-y-6">

                <button
                    type="button"
                    onClick={() => navigate("/receipts-issues")}
                    className="group flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-(--color-primary-hover) sm:text-base"
                >
                    <ArrowLeft
                        size={18}
                        className="transition group-hover:-translate-x-1"
                    />
                    Quay lại phiếu nhập xuất
                </button>

                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-100 text-(--color-primary)">
                        {isReceipt ? (
                            <ArrowDownToLine size={21} />
                        ) : (
                            <ArrowUpFromLine size={21} />
                        )}
                    </div>

                    <div>

                        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                            {isReceipt
                                ? "Tạo phiếu nhập sản phẩm"
                                : "Tạo phiếu xuất sản phẩm"}
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Tạo thông tin phiếu trước khi thêm các sản phẩm theo lô.
                        </p>

                    </div>

                </div>

                <div className="rounded-2xl border border-(--color-border) bg-white p-5 shadow-sm sm:p-8">

                    <div className="mb-6">

                        <h2 className="text-lg font-semibold text-slate-800">
                            {isReceipt
                                ? "Thông tin phiếu nhập"
                                : "Thông tin phiếu xuất"}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Các trường có dấu
                            <span className="text-red-500"> *</span>
                            {" "}là bắt buộc.
                        </p>

                    </div>

                    <ProductDocumentForm
                        transactionType={transactionType}
                        document={null}
                        onSuccess={handleSuccess}
                        onCancel={() => navigate("/receipts-issues")}
                    />

                </div>

            </div>

        </div>

    );
}

export default ProductDocumentNew;
