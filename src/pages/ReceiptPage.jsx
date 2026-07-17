import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import receiptApi from "../api/receiptApi.js";

import PageHeader from "../components/common/PageHeader.jsx";
import TableToolbar from "../components/common/TableToolbar.jsx";

import ReceiptTable from "../components/receipts/ReceiptTable.jsx";
import {useNavigate} from "react-router-dom";
import Pagination from "../components/common/Pagination.jsx";


function ReceiptPage() {

    const [receipts, setReceipts] = useState([]);

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(0);

    const [pageSize, setPageSize] = useState(8);

    const [totalPages, setTotalPages] = useState(0);

    const navigate = useNavigate();

    const loadReceipts = async () => {

        try {

            const response = await receiptApi.getAll({
                page,
                size: pageSize,
            });

            const data = response.data.data;

            setReceipts(data.content);

            setTotalPages(data.totalPages);

        } catch (error) {

            console.log(error);

        }

    };


    useEffect(() => {

        loadReceipts();

    }, [page, pageSize]);


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
                    navigate(`/receipts/${id}`);
                }}

            />

            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

        </div>

    );

}

export default ReceiptPage;
