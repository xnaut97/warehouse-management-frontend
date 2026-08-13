import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import stocktakingApi from "../api/stocktakingApi.js";
import useSort from "../hooks/useSort.js";

import PageHeader from "../components/common/PageHeader.jsx";
import TableToolbar from "../components/common/TableToolbar.jsx";
import Pagination from "../components/common/Pagination.jsx";
import Loading from "../components/common/Loading.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import { FilterSelect } from "../components/reports/ReportFilters.jsx";

import StocktakingTable from "../components/stocktaking/StocktakingTable.jsx";

import {
    STOCKTAKING_STATUS,
    stocktakingStatusLabel
} from "../components/stocktaking/stocktakingLabels.js";

function StocktakingPage() {

    const navigate = useNavigate();

    const [stocktakings, setStocktakings] = useState([]);

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("");

    const [page, setPage] = useState(0);

    const [pageSize] = useState(8);

    const [totalPages, setTotalPages] = useState(0);

    const [loading, setLoading] = useState(true);

    const [pendingAction, setPendingAction] = useState(null);

    const { sortField, sortDir, onSort, sortParam } =
        useSort("stocktakingDate", "desc");

    const loadStocktakings = async () => {

        setLoading(true);

        try {

            const response = await stocktakingApi.getAll({
                page,
                size: pageSize,
                sort: sortParam,
                keyword: search.trim() || undefined,
                status: status || undefined
            });

            const data = response.data.data;

            setStocktakings(data?.content ?? []);

            setTotalPages(data?.totalPages ?? 0);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Không thể tải danh sách phiếu kiểm kê."
            );

            setStocktakings([]);

            setTotalPages(0);

        } finally {

            setLoading(false);

        }

    };

    const handleSearch = (value) => {

        setSearch(value);

        setPage(0);

    };

    const handleStatus = (value) => {

        setStatus(value);

        setPage(0);

    };

    const handleSort = (field) => {

        onSort(field);

        setPage(0);

    };

    useEffect(() => {

        const timer = setTimeout(loadStocktakings, 300);

        return () => clearTimeout(timer);

    }, [page, pageSize, sortParam, search, status]);

    const handleConfirmAction = async () => {

        const { type, stocktaking } = pendingAction;

        setPendingAction(null);

        try {

            if (type === "confirm") {

                await stocktakingApi.confirm(stocktaking.id);

                toast.success("Đã chốt số liệu kiểm kê.");

            } else {

                await stocktakingApi.balance(stocktaking.id);

                toast.success("Đã cân bằng kho theo số liệu kiểm kê.");

            }

            await loadStocktakings();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Thao tác không thành công."
            );

        }

    };

    return (

        <div>

            <PageHeader
                title="Kiểm kê"
                description="Quản lý phiếu kiểm kê, chốt số liệu và cân bằng kho."
            />

            <TableToolbar
                search={search}
                setSearch={handleSearch}
            >

                <FilterSelect
                    value={status}
                    onChange={(event) => handleStatus(event.target.value)}
                >

                    <option value="">
                        Tất cả trạng thái
                    </option>

                    {Object.values(STOCKTAKING_STATUS).map((value) => (

                        <option key={value} value={value}>
                            {stocktakingStatusLabel[value]}
                        </option>

                    ))}

                </FilterSelect>

            </TableToolbar>

            {loading ? (

                <Loading rows={6} />

            ) : (

                <StocktakingTable
                    stocktakings={stocktakings}
                    onView={(id) => navigate(`/stocktaking/${id}`)}
                    onEdit={(id) => navigate(`/stocktaking/${id}`)}
                    onConfirm={(stocktaking) =>
                        setPendingAction({
                            type: "confirm",
                            stocktaking
                        })
                    }
                    onBalance={(stocktaking) =>
                        setPendingAction({
                            type: "balance",
                            stocktaking
                        })
                    }
                    sortField={sortField}
                    sortDir={sortDir}
                    onSort={handleSort}
                />

            )}

            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

            {pendingAction && (

                <ConfirmDialog
                    title={
                        pendingAction.type === "confirm"
                            ? "Chốt số liệu kiểm kê"
                            : "Cân bằng kho"
                    }
                    message={
                        pendingAction.type === "confirm"
                            ? `Chốt số liệu phiếu ${pendingAction.stocktaking.stocktakingNo}? Sau khi chốt, số thực tế không thể chỉnh sửa.`
                            : `Cân bằng kho theo phiếu ${pendingAction.stocktaking.stocktakingNo}? Tồn kho sẽ được cập nhật theo số thực tế.`
                    }
                    confirmText={
                        pendingAction.type === "confirm"
                            ? "Chốt số liệu"
                            : "Cân bằng kho"
                    }
                    onConfirm={handleConfirmAction}
                    onCancel={() => setPendingAction(null)}
                />

            )}

        </div>

    );

}

export default StocktakingPage;
