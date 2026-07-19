import Badge from "../common/Badge.jsx";
import { formatCurrency, formatDate, formatNumber, toNumber } from "./reportUtils.js";

function StocktakingReportTable({ records = [], variances = [], mode = "records" }) {
    const isVariance = mode === "variances";

    return (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">
            <table className="min-w-[980px] w-full">
                <thead className="border-b border-pink-100">
                {isVariance ? (
                    <tr>
                        <th className="px-6 py-4 text-left">Mã phiếu</th>
                        <th className="px-6 py-4 text-left">Mã vật tư</th>
                        <th className="px-6 py-4 text-left">Tên vật tư</th>
                        <th className="px-6 py-4 text-left">Sổ sách</th>
                        <th className="px-6 py-4 text-left">Thực tế</th>
                        <th className="px-6 py-4 text-left">Chênh lệch</th>
                        <th className="px-6 py-4 text-left">Giá trị</th>
                    </tr>
                ) : (
                    <tr>
                        <th className="px-6 py-4 text-left">Mã phiếu</th>
                        <th className="px-6 py-4 text-left">Kho</th>
                        <th className="px-6 py-4 text-left">Ngày kiểm kê</th>
                        <th className="px-6 py-4 text-left">Người kiểm kê</th>
                        <th className="px-6 py-4 text-center">Trạng thái</th>
                    </tr>
                )}
                </thead>
                <tbody>
                {isVariance ? (
                    variances.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                                Không có dữ liệu chênh lệch kiểm kê
                            </td>
                        </tr>
                    ) : variances.map((item) => {
                        const largeVariance = Math.abs(toNumber(item.varianceQuantity)) >= 10;
                        return (
                            <tr
                                key={`${item.stocktakingNo}-${item.materialCode}`}
                                className="border-b border-pink-100 transition hover:bg-pink-50"
                            >
                                <td className="px-6 py-4 text-sm text-slate-700">{item.stocktakingNo}</td>
                                <td className="px-6 py-4 text-sm text-slate-700">{item.materialCode}</td>
                                <td className="px-6 py-4 text-sm text-slate-700">{item.materialName}</td>
                                <td className="px-6 py-4 text-sm text-slate-700">{formatNumber(item.systemQuantity)}</td>
                                <td className="px-6 py-4 text-sm text-slate-700">{formatNumber(item.physicalQuantity)}</td>
                                <td className="px-6 py-4 text-sm font-semibold">
                                    <span className={largeVariance ? "text-red-600" : "text-slate-700"}>
                                        {formatNumber(item.varianceQuantity)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-slate-700">{formatCurrency(item.varianceValue)}</td>
                            </tr>
                        );
                    })
                ) : (
                    records.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                                Không có dữ liệu phiếu kiểm kê
                            </td>
                        </tr>
                    ) : records.map((item) => (
                        <tr key={item.stocktakingNo} className="border-b border-pink-100 transition hover:bg-pink-50">
                            <td className="px-6 py-4 text-sm text-slate-700">{item.stocktakingNo}</td>
                            <td className="px-6 py-4 text-sm text-slate-700">{item.warehouse}</td>
                            <td className="px-6 py-4 text-sm text-slate-700">{formatDate(item.stocktakingDate)}</td>
                            <td className="px-6 py-4 text-sm text-slate-700">{item.createdBy}</td>
                            <td className="px-6 py-4 text-center">
                                <Badge color={item.status === "CONFIRMED" ? "green" : "yellow"}>
                                    {item.status === "CONFIRMED" ? "Đã xác nhận" : "Đang xử lý"}
                                </Badge>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}

export default StocktakingReportTable;
