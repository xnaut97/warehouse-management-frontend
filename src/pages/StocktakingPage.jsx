import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import stocktakingApi from "../api/stocktakingApi.js";
import useSort from "../hooks/useSort.js";

import PageHeader from "../components/common/PageHeader.jsx";
import TableToolbar from "../components/common/TableToolbar.jsx";
import Pagination from "../components/common/Pagination.jsx";
import Loading from "../components/common/Loading.jsx";
import Modal from "../components/common/Modal.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import { FilterSelect } from "../components/reports/ReportFilters.jsx";

import StocktakingTable from "../components/stocktaking/StocktakingTable.jsx";
import StocktakingForm from "../components/stocktaking/StocktakingForm.jsx";

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

    const [creating, setCreating] = useState(false);

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

    const handleBalance = async () => {

        const { stocktaking } = pendingAction;

        setPendingAction(null);

        try {

            await stocktakingApi.balance(stocktaking.id);

            toast.success("Đã kiểm kê và cân bằng kho.");

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
                actionLabel="Tạo phiếu kiểm kê"
                actionIcon={<Plus size={18} />}
                onAction={() => setCreating(true)}
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
                    onBalance={(stocktaking) =>
                        setPendingAction({ stocktaking })
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

            {creating && (

                <Modal
                    title="Tạo phiếu kiểm kê"
                    onClose={() => setCreating(false)}
                >

                    <StocktakingForm
                        onCancel={() => setCreating(false)}
                        onSuccess={(createdId) => {

                            setCreating(false);

                            if (createdId) {

                                navigate(`/stocktaking/${createdId}`);

                                return;

                            }

                            loadStocktakings();

                        }}
                    />

                </Modal>

            )}

            {pendingAction && (

                <ConfirmDialog
                    title="Kiểm kê và cân bằng kho"
                    message={`Kiểm kê phiếu ${pendingAction.stocktaking.stocktakingNo}? Hệ thống sẽ đối chiếu sổ sách với thực tế và cập nhật tồn kho theo số thực tế.`}
                    confirmText="Kiểm kê"
                    onConfirm={handleBalance}
                    onCancel={() => setPendingAction(null)}
                />

            )}

        </div>

    );

}

export default StocktakingPage;
