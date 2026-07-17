import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {ArrowLeft, Check, Plus} from "lucide-react";

import receiptApi from "../../api/receiptApi.js";

import ReceiptDetailCard from "../../components/receipts/ReceiptDetailCard.jsx";
import ReceiptItemTable from "./ReceiptItemTable.jsx";
import ConfirmDialog from "../common/ConfirmDialog.jsx";

function ReceiptDetail() {

    const {id} = useParams();

    const navigate = useNavigate();

    const [receipt, setReceipt] = useState(null);

    const [showConfirm, setShowConfirm] = useState(false);

    const loadReceipt = async () => {

        try {

            const response = await receiptApi.getDetail(id);

            setReceipt(response.data.data);

        } catch (error) {

            console.error(error);

        }

    };

    useEffect(() => {

        loadReceipt();

    }, [id]);


    const handleConfirm = async () => {

        try {

            await receiptApi.confirm(id);

            await loadReceipt();

        } catch (error) {

            console.error(error);

        }

    };


    if (!receipt) {

        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-slate-500">
                    Đang tải dữ liệu...
                </div>
            </div>
        );

    }


    const statusStyle = {
        DRAFT: "bg-yellow-100 text-yellow-700",
        CONFIRMED: "bg-green-100 text-green-700",
        CANCELLED: "bg-red-100 text-red-700",
    };


    const statusText = {
        DRAFT: "Nháp",
        CONFIRMED: "Đã xác nhận",
        CANCELLED: "Đã hủy",
    };


    return (

        <div className="space-y-6 pt-10 pb-10 pl-12 pr-12">

            <button
                onClick={() => navigate("/receipts")}
                className="group flex items-center gap-2 text-lg font-medium text-slate-600 transition hover:text-(--color-primary-hover)"
            >

                <ArrowLeft
                    size={18}
                    className="transition group-hover:-translate-x-1"
                />

                Quay lại danh sách phiếu nhập

            </button>


            <div className="rounded-xl bg-white p-6 shadow-sm">

                <div className="flex items-start justify-between">

                    <div className="space-y-2">

                        <div className="flex items-center gap-3">

                            <h1 className="text-3xl font-bold text-slate-800">
                                Phiếu nhập {receipt.receiptNo}
                            </h1>

                            <span
                                className={`rounded-full px-3 py-1 text-sm font-medium ${statusStyle[receipt.status]}`}
                            >
                                {statusText[receipt.status]}
                            </span>

                        </div>

                        <p className="text-sm text-slate-500">
                            Chi tiết thông tin phiếu nhập kho
                        </p>

                    </div>


                    {
                        receipt.status === "DRAFT" && (

                            <div className="flex gap-3">

                                <button
                                    className="flex items-center gap-2 rounded-lg border border-blue-600 px-5 py-3 font-medium text-blue-600 transition hover:bg-blue-50"
                                >

                                    <Plus size={18}/>

                                    Thêm mặt hàng

                                </button>


                                <button
                                    onClick={() => setShowConfirm(true)}
                                    className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-700"
                                >

                                    <Check size={18}/>

                                    Xác nhận phiếu

                                </button>

                            </div>

                        )
                    }

                </div>

            </div>


            <ReceiptDetailCard
                receipt={receipt}
            />


            <ReceiptItemTable
                items={receipt.items}
                status={receipt.status}
                onUpdate={(item) => console.log("update", item)}
                onDelete={(item) => console.log("delete", item)}
            />


            {
                showConfirm && (

                    <ConfirmDialog
                        title="Xác nhận phiếu nhập"
                        message="Bạn có chắc chắn muốn xác nhận phiếu nhập kho?"
                        onConfirm={async () => {

                            await handleConfirm();

                            setShowConfirm(false);

                        }}
                        onCancel={() => setShowConfirm(false)}
                    />

                )
            }

        </div>

    );

}

export default ReceiptDetail;