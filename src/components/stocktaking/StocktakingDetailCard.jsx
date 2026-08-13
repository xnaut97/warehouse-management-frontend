import Card from "../common/Card.jsx";

import StocktakingStatusBadge from "./StocktakingStatusBadge.jsx";

import { formatDate } from "../reports/reportUtils.js";

import {
    stockGroupLabel,
    stocktakingTypeLabel
} from "./stocktakingLabels.js";

function Field({ label, children }) {

    return (

        <div>

            <p className="text-sm text-slate-500">
                {label}
            </p>

            <div className="mt-1 font-semibold text-slate-800">
                {children}
            </div>

        </div>

    );

}

function StocktakingDetailCard({ stocktaking }) {

    return (

        <Card className="p-5 sm:p-6">

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">

                <Field label="Mã phiếu">
                    {stocktaking.stocktakingNo || "-"}
                </Field>

                <Field label="Ngày kiểm kê">
                    {formatDate(stocktaking.stocktakingDate) || "-"}
                </Field>

                <Field label="Kho kiểm kê">
                    {stockGroupLabel[stocktaking.warehouseGroup] || "-"}
                </Field>

                <Field label="Loại kiểm kê">
                    {stocktakingTypeLabel[stocktaking.type] || "-"}
                </Field>

                <Field label="Người kiểm kê">
                    {stocktaking.stocktaker || "-"}
                </Field>

                <Field label="Trạng thái">
                    <StocktakingStatusBadge status={stocktaking.status} />
                </Field>

            </div>

        </Card>

    );

}

export default StocktakingDetailCard;
