import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import ReceiptForm from "./ReceiptForm.jsx";

function ReceiptNew() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const type = searchParams.get("type");

    /*
     * /receipts/new hiện tại chỉ dành cho
     * luồng nhập nguyên vật liệu.
     */
    if (type !== "MATERIAL") {
        return (
            <div className="px-4 py-6 sm:px-6 lg:px-12 lg:py-10">

                <div className="
                    rounded-2xl border border-(--color-border)
                    bg-white p-8 text-center shadow-sm
                ">

                    <h1 className="text-xl font-semibold text-slate-800">
                        Loại hàng không hợp lệ
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Trang này hiện chỉ hỗ trợ tạo phiếu nhập
                        nguyên vật liệu.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/receipts-issues")}
                        className="
                            mt-6 rounded-xl
                            bg-(--color-primary)
                            px-5 py-3
                            font-medium text-white
                            transition
                            hover:bg-(--color-primary-hover)
                        "
                    >
                        Quay lại
                    </button>

                </div>

            </div>
        );
    }


    const handleSuccess = (receiptId) => {

        /*
         * Sau khi tạo header thành công,
         * đi thẳng tới detail để thêm NVL.
         */
        navigate(`/receipts/${receiptId}`);

    };


    return (

        <div className="
            min-h-full
            bg-(--color-background)
            px-4 py-6
            sm:px-6
            lg:px-12 lg:py-10
        ">

            <div className="mx-auto max-w-4xl space-y-6">

                {/* Back */}

                <button
                    type="button"
                    onClick={() => navigate("/receipts-issues")}
                    className="
                        group flex items-center gap-2
                        text-sm font-medium text-slate-600
                        transition
                        hover:text-(--color-primary-hover)
                        sm:text-base
                    "
                >
                    <ArrowLeft
                        size={18}
                        className="
                            transition
                            group-hover:-translate-x-1
                        "
                    />

                    Quay lại phiếu nhập xuất
                </button>


                {/* Header */}

                <div>

                    <div className="flex items-center gap-3">

                        <div className="
                            flex h-11 w-11
                            items-center justify-center
                            rounded-xl
                            bg-pink-100
                            text-(--color-primary)
                        ">
                            ↓
                        </div>

                        <div>

                            <h1 className="
                                text-2xl font-bold text-slate-800
                                sm:text-3xl
                            ">
                                Tạo phiếu nhập NVL
                            </h1>

                            <p className="
                                mt-1 text-sm text-slate-500
                            ">
                                Tạo thông tin phiếu nhập nguyên vật liệu
                                trước khi thêm các mặt hàng.
                            </p>

                        </div>

                    </div>

                </div>


                {/* Form */}

                <div className="
                    rounded-2xl
                    border border-(--color-border)
                    bg-white
                    p-5
                    shadow-sm
                    sm:p-8
                ">

                    <div className="mb-6">

                        <h2 className="
                            text-lg font-semibold text-slate-800
                        ">
                            Thông tin phiếu nhập
                        </h2>

                        <p className="
                            mt-1 text-sm text-slate-500
                        ">
                            Các trường có dấu
                            <span className="text-red-500"> *</span>
                            {" "}là bắt buộc.
                        </p>

                    </div>


                    <ReceiptForm
                        receipt={null}
                        onSuccess={handleSuccess}
                        onCancel={() =>
                            navigate("/receipts-issues")
                        }
                    />

                </div>

            </div>

        </div>

    );
}

export default ReceiptNew;