import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import receiptApi from "../../api/receiptApi.js";
import { Check } from "lucide-react";

import ReceiptDetailCard from "../../components/receipts/ReceiptDetailCard";
import ReceiptItemTable from "./ReceiptItemTable.jsx";


function ReceiptDetail() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [receipt, setReceipt] = useState(null);

    const handleConfirm = async () => {

        const confirm = window.confirm(
            "Bạn có chắc muốn xác nhận phiếu nhập kho này?"
        );


        if (!confirm) return;


        try {

            await receiptApi.confirm(id);

            await loadReceipt();

        } catch (error) {

            console.error(error);

        }

    };

    useEffect(() => {

        loadReceipt();

    }, [id]);


    const loadReceipt = async () => {

        try {

            const res = await receiptApi.getDetail(id);

            setReceipt(res.data.data);

        } catch (error) {

            console.error(error);

        }

    };


    if (!receipt) {

        return (
            <div className="p-6">
                Đang tải...
            </div>
        );

    }


    return (

        <div className="p-6">

            <div className="mb-5 flex items-center justify-between">

                <button
                    onClick={() => navigate(-1)}
                    className="rounded bg-gray-100 px-4 py-2"
                >
                    Quay lại
                </button>


                {
                    receipt.status === "DRAFT" && (

                        <button
                            onClick={handleConfirm}
                            className="flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                        >
                            <Check size={18}/>
                            Xác nhận phiếu nhập
                        </button>

                    )
                }

            </div>


            <ReceiptDetailCard
                receipt={receipt}
            />


            <div className="mt-6 mb-3 flex justify-between">

                <h2 className="text-xl font-semibold">
                    Mặt hàng nhập kho
                </h2>


                {
                    receipt.status === "DRAFT" && (

                        <button
                            className="rounded bg-blue-600 px-4 py-2 text-white"
                        >
                            + Thêm mặt hàng
                        </button>

                    )
                }

            </div>


            <ReceiptItemTable

                items={receipt.items}

                status={receipt.status}

                onUpdate={(item) => console.log("update", item)}

                onDelete={(item) => console.log("delete", item)}

            />


        </div>

    );
}


export default ReceiptDetail;
