import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import receiptApi from "../api/receiptApi.js";

import PageHeader from "../components/common/PageHeader.jsx";
import TableToolbar from "../components/common/TableToolbar.jsx";

import ReceiptTable from "../components/receipts/ReceiptTable.jsx";


function ReceiptPage() {

    const [receipts, setReceipts] = useState([]);

    const [search, setSearch] = useState("");


    const loadReceipts = async () => {

        try {

            const response = await receiptApi.getAll({
                page: 0,
                size: 10
            });

            setReceipts(response.data.data.content);

        } catch (error) {

            console.log(error);

        }

    };


    useEffect(() => {

        loadReceipts();

    }, []);


    const filteredReceipts = receipts.filter((receipt) => {

        const keyword = search.toLowerCase();


        return (

            receipt.receiptNo
                .toLowerCase()
                .includes(keyword) ||

            receipt.supplier
                .toLowerCase()
                .includes(keyword) ||

            receipt.warehouse
                .toLowerCase()
                .includes(keyword)

        );

    });


    return (

        <div>

            <PageHeader
                title="Phiếu nhập kho"
                description="Quản lý nhập nguyên vật liệu vào kho."
                actionLabel="Thêm phiếu nhập"
                actionIcon={<Plus size={18} />}
                onAction={() => {

                    // open create receipt modal later

                }}
            />


            <TableToolbar
                search={search}
                setSearch={setSearch}
            />


            <ReceiptTable

                receipts={filteredReceipts}

                onRefresh={loadReceipts}

                onView={(id) => {

                    console.log("View receipt:", id);

                }}

            />

        </div>

    );

}

export default ReceiptPage;
