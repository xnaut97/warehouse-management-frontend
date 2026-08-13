import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import PageHeader from "../components/common/PageHeader.jsx";
import TableToolbar from "../components/common/TableToolbar.jsx";
import Pagination from "../components/common/Pagination.jsx";

import TransactionTypeTabs from "../components/transactions/TransactionTypeTabs.jsx";
import GoodsTypeTabs from "../components/transactions/GoodsTypeTabs.jsx";
import CreateTransactionModal from "../components/transactions/CreateTransactionModal.jsx";

import ReceiptTable from "../components/receipts/ReceiptTable.jsx";
import IssueTable from "../components/issues/IssueTable.jsx";

import materialReceiptApi from "../api/materialReceiptApi.js";
import materialIssueApi from "../api/materialIssueApi.js";

import productReceiptApi from "../api/productReceiptApi.js";
import productIssueApi from "../api/productIssueApi.js";

import ProductReceiptTable from "../components/products/ProductReceiptTable.jsx";
import ProductIssueTable from "../components/products/ProductIssueTable.jsx";

function ReceiptsIssuesPage() {

    const navigate = useNavigate();

    const [transactionType, setTransactionType] =
        useState("RECEIPT");

    const [goodsType, setGoodsType] =
        useState("MATERIAL");

    const [transactions, setTransactions] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [page, setPage] =
        useState(0);

    const [pageSize] =
        useState(8);

    const [totalPages, setTotalPages] =
        useState(0);

    const [loading, setLoading] =
        useState(false);

    const [showCreateModal, setShowCreateModal] =
        useState(false);


    /*
     * Reset pagination whenever
     * transaction/goods type changes.
     */
    useEffect(() => {
        setPage(0);
        setSearch("");
    }, [
        transactionType,
        goodsType,
    ]);


    /*
     * Load transactions.
     *
     * Currently backend supports MATERIAL only.
     */
    useEffect(() => {

        const loadTransactions = async () => {

            setLoading(true);

            try {

                let response;

                if (
                    goodsType === "MATERIAL" &&
                    transactionType === "RECEIPT"
                ) {

                    response =
                        await materialReceiptApi.getAll({
                            page,
                            size: pageSize,
                        });

                }

                if (
                    goodsType === "MATERIAL" &&
                    transactionType === "ISSUE"
                ) {

                    response =
                        await materialIssueApi.getAll({
                            page,
                            size: pageSize,
                        });

                }

                if (
                    goodsType === "PRODUCT" &&
                    transactionType === "RECEIPT"
                ) {
                    response = await productReceiptApi.getAll({
                        page,
                        size: pageSize,
                    });
                }

                if (
                    goodsType === "PRODUCT" &&
                    transactionType === "ISSUE"
                ) {
                    response = await productIssueApi.getAll({
                        page,
                        size: pageSize,
                    });
                }

                if (!response) {

                    setTransactions([]);
                    setTotalPages(0);
                    return;

                }

                const data =
                    response.data?.data;

                setTransactions(
                    data?.content ?? []
                );

                setTotalPages(
                    data?.totalPages ?? 0
                );

            } catch (error) {

                console.error(
                    "Failed to load transactions:",
                    error
                );

                setTransactions([]);
                setTotalPages(0);

            } finally {

                setLoading(false);

            }

        };

        loadTransactions();

    }, [
        transactionType,
        goodsType,
        page,
        pageSize,
    ]);


    const filteredTransactions = transactions.filter((transaction) => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) {
            return true;
        }

        const receiptNo =
            transaction.receiptNo?.toLowerCase() || "";

        const issueNo =
            transaction.issueNo?.toLowerCase() || "";

        const supplier =
            transaction.supplier?.toLowerCase() || "";

        const customer =
            transaction.customer?.toLowerCase() || "";

        const warehouse =
            transaction.warehouse?.toLowerCase() || "";

        return (
            receiptNo.includes(keyword) ||
            issueNo.includes(keyword) ||
            supplier.includes(keyword) ||
            customer.includes(keyword) ||
            warehouse.includes(keyword)
        );
    });


    const handleCreateNavigate = (path) => {
        navigate(path);
    };


    const renderTable = () => {


        if (loading) {

            return (
                <div className="
                    flex min-h-[320px]
                    items-center justify-center
                    rounded-2xl border border-(--color-border)
                    bg-white shadow-sm
                ">
                    <div className="text-sm text-slate-500">
                        Đang tải dữ liệu...
                    </div>
                </div>
            );

        }

        if (
            goodsType === "PRODUCT" &&
            transactionType === "RECEIPT"
        ) {
            return (
                <ProductReceiptTable
                    receipts={filteredTransactions}
                    onView={(id) =>
                        navigate(`/product-receipts/${id}`)
                    }
                />
            );
        }

        if (
            goodsType === "PRODUCT" &&
            transactionType === "ISSUE"
        ) {
            return (
                <ProductIssueTable
                    issues={filteredTransactions}
                    onView={(id) =>
                        navigate(`/product-issues/${id}`)
                    }
                />
            );
        }


        if (transactionType === "RECEIPT") {

            return (
                <ReceiptTable
                    receipts={filteredTransactions}
                    onView={(id) =>
                        navigate(`/receipts/${id}`)
                    }
                />
            );

        }


        return (
            <IssueTable
                issues={filteredTransactions}
                onView={(id) =>
                    navigate(`/issues/${id}`)
                }
            />
        );

    };


    return (

        <div className="
            min-h-full
            bg-(--color-background)
            px-4 py-6
            sm:px-6
            lg:px-10 lg:py-8
        ">

            <div className="space-y-6">

                <PageHeader
                    title="Phiếu nhập xuất"
                    description="
                        Quản lý phiếu nhập kho và phiếu xuất kho
                        theo từng loại hàng hóa.
                    "
                    actionLabel="Thêm phiếu"
                    actionIcon={
                        <Plus size={18} />
                    }
                    onAction={() =>
                        setShowCreateModal(true)
                    }
                />


                {/* Main transaction transactions */}

                <TransactionTypeTabs
                    value={transactionType}
                    onChange={setTransactionType}
                />


                {/* Goods transactions + content */}

                <div className="
                    rounded-2xl border border-(--color-border)
                    bg-white shadow-sm
                ">

                    <GoodsTypeTabs
                        value={goodsType}
                        onChange={setGoodsType}
                    />

                    <div className="p-4 sm:p-6">

                        <div className="mb-5">

                            <TableToolbar
                                search={search}
                                setSearch={setSearch}
                            />

                        </div>


                        {renderTable()}

                    </div>

                </div>


                {totalPages > 0 && (
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                )}


            </div>


            <CreateTransactionModal
                open={showCreateModal}
                onClose={() =>
                    setShowCreateModal(false)
                }
                onNavigate={
                    handleCreateNavigate
                }
            />

        </div>

    );
}

export default ReceiptsIssuesPage;