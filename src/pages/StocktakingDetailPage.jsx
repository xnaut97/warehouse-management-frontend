import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCheck, Scale } from "lucide-react";
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
    isEditable
} from "../components/stocktaking/stocktakingLabels.js";

function StocktakingDetailPage() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [stocktaking, setStocktaking] = useState(null);

    const [loading, setLoading] = useState(true);

    const [pendingAction, setPendingAction] = useState(null);

    const loadStocktaking = () =>

        stocktakingApi.getDetail(id)

            .then((response) => {

                setStocktaking(response.data.data);

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

    const applyItem = (updatedItem) => {

        setStocktaking((current) => ({
            ...current,
            items: current.items.map((item) =>
                item.id === updatedItem.id
                    ? updatedItem
                    : item
            )
        }));

    };

    const handleSaveItem = async (item, payload) => {

        try {

            const response = await stocktakingApi.updateItem(
                item.id,
                payload
            );

            applyItem(response.data.data);

            toast.success("Đã cập nhật số thực tế.");

            return true;

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Cập nhật số thực tế thất bại."
            );

            return false;

        }

    };

    const handleSaveBatch = async (batch, payload) => {

        try {

            const response = await stocktakingApi.updateBatch(
                batch.id,
                payload
            );

            applyItem(response.data.data);

            toast.success("Đã cập nhật số thực tế của lô.");

            return true;

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Cập nhật số thực tế của lô thất bại."
            );

            return false;

        }

    };

    const handleConfirmAction = async () => {

        const type = pendingAction;

        setPendingAction(null);

        try {

            if (type === "confirm") {

                await stocktakingApi.confirm(id);

                toast.success("Đã chốt số liệu kiểm kê.");

            } else {

                await stocktakingApi.balance(id);

                toast.success("Đã cân bằng kho theo số liệu kiểm kê.");

            }

            await loadStocktaking();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Thao tác không thành công."
            );

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

                        {canConfirm(stocktaking.status) && (

                            <Button
                                onClick={() => setPendingAction("confirm")}
                            >
                                <CheckCheck size={18} />
                                Chốt số liệu
                            </Button>

                        )}

                        {canBalance(stocktaking.status) && (

                            <Button
                                onClick={() => setPendingAction("balance")}
                            >
                                <Scale size={18} />
                                Cân bằng kho
                            </Button>

                        )}

                    </div>

                </div>

            </div>

            <StocktakingDetailCard stocktaking={stocktaking} />

            <StocktakingItemTable
                items={stocktaking.items ?? []}
                editable={isEditable(stocktaking.status)}
                onSaveItem={handleSaveItem}
                onSaveBatch={handleSaveBatch}
            />

            {pendingAction && (

                <ConfirmDialog
                    title={
                        pendingAction === "confirm"
                            ? "Chốt số liệu kiểm kê"
                            : "Cân bằng kho"
                    }
                    message={
                        pendingAction === "confirm"
                            ? `Chốt số liệu phiếu ${stocktaking.stocktakingNo}? Sau khi chốt, số thực tế không thể chỉnh sửa.`
                            : `Cân bằng kho theo phiếu ${stocktaking.stocktakingNo}? Tồn kho sẽ được cập nhật theo số thực tế.`
                    }
                    confirmText={
                        pendingAction === "confirm"
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

export default StocktakingDetailPage;
