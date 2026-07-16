import ReceiptStatusBadge from "./ReceiptStatusBadge.jsx";


function ReceiptDetailCard({
                               receipt
                           }) {

    return (
        <div className="rounded-xl bg-white p-6 shadow">

            <div className="mb-5 flex justify-between">

                <h2 className="text-xl font-semibold">
                    Thông tin phiếu nhập
                </h2>

                <ReceiptStatusBadge
                    status={receipt.status}
                />

            </div>


            <div className="grid grid-cols-2 gap-4 text-sm">

                <div>
                    <p className="text-gray-500">
                        Số phiếu nhập
                    </p>

                    <p className="font-medium">
                        {receipt.receiptNo}
                    </p>
                </div>


                <div>
                    <p className="text-gray-500">
                        Nhà cung cấp
                    </p>

                    <p className="font-medium">
                        {receipt.supplier}
                    </p>
                </div>


                <div>
                    <p className="text-gray-500">
                        Kho
                    </p>

                    <p className="font-medium">
                        {receipt.warehouse}
                    </p>
                </div>


                <div>
                    <p className="text-gray-500">
                        Ngày nhập
                    </p>

                    <p className="font-medium">
                        {receipt.receiptDate}
                    </p>
                </div>


                <div>
                    <p className="text-gray-500">
                        Tổng tiền
                    </p>

                    <p className="font-medium">
                        {receipt.totalAmount}
                    </p>
                </div>

            </div>

        </div>
    );
}

export default ReceiptDetailCard;
