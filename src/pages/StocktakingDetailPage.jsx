import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    ClipboardCheck,
    FileSpreadsheet,
    Printer,
    Save
} from "lucide-react";
import toast from "react-hot-toast";

import stocktakingApi from "../api/stocktakingApi.js";

import Button from "../components/common/Button.jsx";
import Loading from "../components/common/Loading.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";

import StocktakingDetailCard from "../components/stocktaking/StocktakingDetailCard.jsx";
import StocktakingItemTable from "../components/stocktaking/StocktakingItemTable.jsx";

import {
    canBalance,
    canConfirm,
    isBalanced,
    isEditable
} from "../components/stocktaking/stocktakingLabels.js";

import {
    buildCountPayload,
    buildDraft,
    collectInvalidQuantities
} from "../components/stocktaking/stocktakingDraft.js";

import {
    exportStocktakingToExcel,
    printStocktaking
} from "../components/stocktaking/stocktakingExport.js";

function StocktakingDetailPage() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [stocktaking, setStocktaking] = useState(null);

    const [draft, setDraft] = useState({ items: {}, batches: {} });

    const [loading, setLoading] = useState(true);

    const [submitting, setSubmitting] = useState(false);

    const [pendingAction, setPendingAction] = useState(null);

    const loadStocktaking = () =>

        stocktakingApi.getDetail(id)

            .then((response) => {

                const data = response.data.data;

                setStocktaking(data);

                setDraft(buildDraft(data?.items));

            })

            .catch((error) => {

                toast.error(
                    error.response?.data?.message ||
                    "Không thể tải phiếu kiểm kê."
                );

                setStocktaking(null);

            })

            .finally(() => {

                setLoading(false);

            });

    useEffect(() => {

        loadStocktaking();

    }, [id]);

    const handleChangeItem = (itemId, field, value) => {

        setDraft((current) => ({
            ...current,
            items: {
                ...current.items,
                [itemId]: {
                    ...current.items[itemId],
                    [field]: value
                }
            }
        }));

    };

    const handleChangeBatch = (batchId, field, value) => {

        setDraft((current) => ({
            ...current,
            batches: {
                ...current.batches,
                [batchId]: {
                    ...current.batches[batchId],
                    [field]: value
                }
            }
        }));

    };

    const handleExportExcel = () => {

        try {

            exportStocktakingToExcel(
                stocktaking,
                draft,
                isEditable(stocktaking.status)
            );

            toast.success("Đã xuất file Excel.");

        } catch {

            toast.error("Không thể xuất file Excel.");

        }

    };

    const handlePrint = () => {

        try {

            printStocktaking(
                stocktaking,
                draft,
                isEditable(stocktaking.status)
            );

        } catch {

            toast.error("Không thể mở bản in.");

        }

    };

    const handleSave = () => {

        const items = stocktaking.items ?? [];

        if (items.length === 0) {

            toast.error("Phiếu kiểm kê chưa có dòng hàng nào.");

            return;

        }

        const invalid = collectInvalidQuantities(items, draft);

        if (invalid.length > 0) {

            toast.error(
                `Vui lòng nhập số thực tế hợp lệ cho: ${invalid.slice(0, 3).join(", ")}` +
                (invalid.length > 3 ? ` và ${invalid.length - 3} dòng khác.` : ".")
            );

            return;

        }

        setPendingAction("save");

    };

    const handleConfirmAction = async () => {

        const type = pendingAction;

        setPendingAction(null);

        setSubmitting(true);

        try {

            if (type === "save") {

                await stocktakingApi.confirm(
                    id,
                    buildCountPayload(stocktaking.items ?? [], draft)
                );

                toast.success("Đã lưu số thực tế và chốt số liệu.");

            } else {

                await stocktakingApi.balance(id);

                toast.success("Đã kiểm kê và cân bằng kho.");

            }

            await loadStocktaking();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Thao tác không thành công."
            );

        } finally {

            setSubmitting(false);

        }

    };

    if (loading) {

        return (

            <div className="space-y-6">

                <Loading rows={6} />

            </div>

        );

    }

    if (!stocktaking) {

        return (

            <EmptyState
                title="Không tìm thấy phiếu kiểm kê"
                description="Phiếu kiểm kê không tồn tại hoặc đã bị xóa."
            />

        );

    }

    const editable = isEditable(stocktaking.status);

    return (

        <div className="space-y-6">

            <div>

                <button
                    type="button"
                    onClick={() => navigate("/stocktaking")}
                    className="mb-3 flex items-center gap-2 text-sm text-slate-500 transition hover:text-(--color-primary-hover)"
                >

                    <ArrowLeft size={16} />

                    Quay lại

                </button>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h1 className="text-2xl font-bold text-(--color-text) sm:text-3xl">
                            Chi tiết phiếu kiểm kê
                        </h1>

                        <p className="mt-2 text-sm text-(--color-text-secondary)">
                            {stocktaking.stocktakingNo}
                        </p>

                    </div>

                    <div className="flex flex-wrap gap-3">

                        <Button
                            variant="secondary"
                            onClick={handleExportExcel}
                        >
                            <FileSpreadsheet size={18} />
                            Xuất Excel
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={handlePrint}
                        >
                            <Printer size={18} />
                            In
                        </Button>

                        {canConfirm(stocktaking.status) && (

                            <Button
                                onClick={handleSave}
                                disabled={submitting}
                            >
                                <Save size={18} />
                                Lưu
                            </Button>

                        )}

                        {canBalance(stocktaking.status) && (

                            <Button
                                onClick={() => setPendingAction("balance")}
                                disabled={submitting}
                            >
                                <ClipboardCheck size={18} />
                                Kiểm kê
                            </Button>

                        )}

                    </div>

                </div>

            </div>

            <StocktakingDetailCard stocktaking={stocktaking} />

            {editable && (

                <p className="text-sm text-(--color-text-secondary)">
                    Nhập số lượng thực tế đếm được tại kho, sau đó bấm “Lưu” để chốt số liệu.
                </p>

            )}

            {canBalance(stocktaking.status) && (

                <p className="text-sm text-(--color-text-secondary)">
                    Số liệu đã được chốt. Bấm “Kiểm kê” để đối chiếu sổ sách với thực tế và cân bằng kho.
                </p>

            )}

            {isBalanced(stocktaking.status) && (

                <p className="text-sm text-(--color-text-secondary)">
                    Kho đã được cân bằng theo số liệu kiểm kê. Phiếu này không thể chỉnh sửa hoặc kiểm kê lại.
                </p>

            )}

            <StocktakingItemTable
                items={stocktaking.items ?? []}
                editable={editable}
                draft={draft}
                onChangeItem={handleChangeItem}
                onChangeBatch={handleChangeBatch}
            />

            {pendingAction && (

                <ConfirmDialog
                    title={
                        pendingAction === "save"
                            ? "Lưu và chốt số liệu"
                            : "Kiểm kê và cân bằng kho"
                    }
                    message={
                        pendingAction === "save"
                            ? `Lưu số thực tế của phiếu ${stocktaking.stocktakingNo}? Sau khi lưu, phiếu chuyển sang “Đã chốt số liệu” và số thực tế không thể chỉnh sửa.`
                            : `Kiểm kê phiếu ${stocktaking.stocktakingNo}? Hệ thống sẽ đối chiếu sổ sách với thực tế và cập nhật tồn kho theo số thực tế.`
                    }
                    confirmText={
                        pendingAction === "save"
                            ? "Lưu"
                            : "Kiểm kê"
                    }
                    onConfirm={handleConfirmAction}
                    onCancel={() => setPendingAction(null)}
                />

            )}

        </div>

    );

}

export default StocktakingDetailPage;
