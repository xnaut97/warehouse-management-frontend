import { useState } from "react";
import { ArrowDownToLine, ArrowLeft, ArrowUpFromLine, Box, Package } from "lucide-react";

import Modal from "../common/Modal.jsx";
import Button from "../common/Button.jsx";

const CREATE_ROUTES = {
    MATERIAL: {
        RECEIPT: "/receipts/new?type=MATERIAL",
        ISSUE: "/issues/new?type=MATERIAL",
    },
    PRODUCT: {
        RECEIPT: "/product-receipts/new",
        ISSUE: "/product-issues/new",
    },
};

const GOODS_LABEL = {
    MATERIAL: "Nguyên vật liệu",
    PRODUCT: "Sản phẩm",
};

function ChoiceButton({ icon, title, description, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center gap-4 rounded-xl border border-(--color-border) px-5 py-4 text-left transition hover:border-(--color-primary) hover:bg-pink-50"
        >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-(--color-primary)">
                {icon}
            </span>

            <span className="min-w-0">
                <span className="block font-semibold text-slate-800">
                    {title}
                </span>

                <span className="mt-0.5 block text-sm text-slate-500">
                    {description}
                </span>
            </span>
        </button>
    );
}

function CreateTransactionModal({
                                    open,
                                    onClose,
                                    onNavigate,
                                }) {

    const [goodsType, setGoodsType] = useState(null);

    if (!open) {
        return null;
    }

    const handleClose = () => {
        setGoodsType(null);
        onClose();
    };

    const handleSelectTransactionType = (transactionType) => {
        onNavigate(CREATE_ROUTES[goodsType][transactionType]);
        setGoodsType(null);
        onClose();
    };

    return (
        <Modal
            title={
                goodsType
                    ? `Thêm phiếu — ${GOODS_LABEL[goodsType]}`
                    : "Thêm phiếu nhập / xuất"
            }
            onClose={handleClose}
        >
            {!goodsType ? (
                <div className="space-y-4">
                    <p className="text-sm text-slate-500">
                        Bước 1: Chọn loại hàng hóa.
                    </p>

                    <div className="space-y-3">
                        <ChoiceButton
                            icon={<Box size={20} />}
                            title="Nguyên vật liệu"
                            description="Phiếu nhập / xuất nguyên vật liệu"
                            onClick={() => setGoodsType("MATERIAL")}
                        />

                        <ChoiceButton
                            icon={<Package size={20} />}
                            title="Sản phẩm"
                            description="Phiếu nhập / xuất sản phẩm theo lô"
                            onClick={() => setGoodsType("PRODUCT")}
                        />
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-sm text-slate-500">
                        Bước 2: Chọn loại phiếu.
                    </p>

                    <div className="space-y-3">
                        <ChoiceButton
                            icon={<ArrowDownToLine size={20} />}
                            title="Phiếu nhập"
                            description={`Nhập kho ${GOODS_LABEL[goodsType].toLowerCase()}`}
                            onClick={() => handleSelectTransactionType("RECEIPT")}
                        />

                        <ChoiceButton
                            icon={<ArrowUpFromLine size={20} />}
                            title="Phiếu xuất"
                            description={`Xuất kho ${GOODS_LABEL[goodsType].toLowerCase()}`}
                            onClick={() => handleSelectTransactionType("ISSUE")}
                        />
                    </div>

                    <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => setGoodsType(null)}
                    >
                        <ArrowLeft size={18} />
                        Chọn lại loại hàng hóa
                    </Button>
                </div>
            )}
        </Modal>
    );
}

export default CreateTransactionModal;
