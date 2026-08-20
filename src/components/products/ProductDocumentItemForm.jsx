import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import productApi from "../../api/productApi.js";
import productReceiptApi from "../../api/productReceiptApi.js";
import productIssueApi from "../../api/productIssueApi.js";
import inventoryApi from "../../api/inventoryApi.js";

import Button from "../common/Button.jsx";

import { unwrapContent } from "../../utils/apiResponse.js";
import { formatDate, formatNumber } from "../reports/reportUtils.js";

const NO_LOT_LABEL = "Không có lô";

const lotKeyOf = (lot) => String(lot.inventoryId);

const lotLabel = (lot) => {

    const name = lot.lotNumber || NO_LOT_LABEL;

    const expiration = lot.expirationDate
        ? ` · HSD ${formatDate(lot.expirationDate)}`
        : "";

    return `${name} · Tồn ${formatNumber(lot.quantity)}${expiration}`;

};

function ProductDocumentItemForm({
                                     transactionType,
                                     documentId,
                                     warehouseId,
                                     item,
                                     onSuccess,
                                     onCancel,
                                 }) {

    const isReceipt = transactionType === "RECEIPT";

    const api = isReceipt
        ? productReceiptApi
        : productIssueApi;

    const [products, setProducts] = useState([]);

    const [lots, setLots] = useState([]);

    // Product the lot list in state belongs to, so loading can be derived.
    const [lotsLoadedFor, setLotsLoadedFor] = useState(null);

    const [loading, setLoading] = useState(false);

    // Explicit lot pick of the user, null while nothing has been picked yet.
    const [lotChoice, setLotChoice] = useState(null);

    const [form, setForm] = useState({
        productId: "",
        quantity: "",
        lotNumber: "",
        expirationDate: "",
        unitPrice: "",
    });

    useEffect(() => {

        productApi.getProducts({ size: 1000 })

            .then((response) => {

                setProducts(
                    unwrapContent(response)
                        .filter((product) => product.enabled !== false)
                );

            })

            .catch((error) => {

                toast.error(
                    error.response?.data?.message ||
                    "Không thể tải danh sách sản phẩm"
                );

            });

    }, []);

    useEffect(() => {

        if (!item) {
            return;
        }

        setForm({
            productId: item.productId ?? "",
            quantity: item.quantity ?? "",
            lotNumber: item.lotNumber ?? "",
            expirationDate: item.expirationDate ?? "",
            unitPrice: item.unitPrice ?? "",
        });

    }, [item]);

    const selectedProductId = item
        ? item.productId
        : form.productId;

    useEffect(() => {

        if (isReceipt || !warehouseId || !selectedProductId) {
            return;
        }

        let active = true;

        inventoryApi.getProductLots({
            warehouseId,
            productId: selectedProductId,
        })

            .then((response) => {

                if (!active) {
                    return;
                }

                setLots(unwrapContent(response));

                setLotsLoadedFor(selectedProductId);

            })

            .catch((error) => {

                if (!active) {
                    return;
                }

                setLots([]);

                setLotsLoadedFor(selectedProductId);

                toast.error(
                    error.response?.data?.message ||
                    "Không thể tải tồn kho theo lô"
                );

            });

        return () => {
            active = false;
        };

    }, [isReceipt, warehouseId, selectedProductId]);

    const loadingLots =
        !isReceipt &&
        Boolean(warehouseId) &&
        Boolean(selectedProductId) &&
        String(lotsLoadedFor) !== String(selectedProductId);

    // A new line never starts with a lot picked. An existing line shows the
    // lot it was saved with until the user picks another one.
    const selectedLot = useMemo(() => {

        if (isReceipt) {
            return null;
        }

        if (lotChoice !== null) {

            return lots.find(
                (lot) => lotKeyOf(lot) === lotChoice
            ) ?? null;

        }

        if (item) {

            return lots.find(
                (lot) => (lot.lotNumber ?? "") === (item.lotNumber ?? "")
            ) ?? null;

        }

        return null;

    }, [isReceipt, lots, lotChoice, item]);

    const availableQuantity = selectedLot
        ? Number(selectedLot.quantity ?? 0)
        : null;

    const issueExpirationDate = selectedLot?.expirationDate ?? "";

    const quantityError = useMemo(() => {

        if (form.quantity === "") {
            return "";
        }

        const quantity = Number(form.quantity);

        if (Number.isNaN(quantity) || quantity <= 0) {
            return "Số lượng phải lớn hơn 0";
        }

        if (isReceipt || availableQuantity === null) {
            return "";
        }

        if (quantity > availableQuantity) {
            return `Số lượng vượt quá tồn kho khả dụng (${formatNumber(availableQuantity)}).`;
        }

        return "";

    }, [form.quantity, isReceipt, availableQuantity]);

    const noLotAvailable =
        !isReceipt &&
        Boolean(warehouseId) &&
        Boolean(selectedProductId) &&
        !loadingLots &&
        lots.length === 0;

    const blockSubmit =
        loading ||
        Boolean(quantityError) ||
        noLotAvailable ||
        (!isReceipt && Boolean(selectedProductId) && !selectedLot);

    const handleChange = (event) => {

        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

    };

    const handleProductChange = (event) => {

        const { value } = event.target;

        setLots([]);

        setLotsLoadedFor(null);

        setLotChoice(null);

        setForm((previous) => ({
            ...previous,
            productId: value,
            lotNumber: "",
            expirationDate: "",
        }));

    };

    const handleLotChange = (event) => {

        setLotChoice(event.target.value);

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!item && !form.productId) {
            toast.error("Vui lòng chọn sản phẩm");
            return;
        }

        if (!form.quantity || Number(form.quantity) <= 0) {
            toast.error("Số lượng phải lớn hơn 0");
            return;
        }

        if (!isReceipt && !selectedLot) {
            toast.error("Vui lòng chọn lô xuất");
            return;
        }

        if (quantityError) {
            toast.error(quantityError);
            return;
        }

        const payload = {
            quantity: Number(form.quantity),
            lotNumber: isReceipt
                ? form.lotNumber || null
                : selectedLot?.lotNumber || null,
            expirationDate: isReceipt
                ? form.expirationDate || null
                : selectedLot?.expirationDate || null,
        };

        if (!isReceipt) {

            payload.unitPrice = form.unitPrice === ""
                ? null
                : Number(form.unitPrice);

        }

        setLoading(true);

        try {

            if (item) {

                await api.updateItem(documentId, item.id, payload);

                toast.success("Đã cập nhật sản phẩm");

            } else {

                await api.addItem(documentId, {
                    ...payload,
                    productId: Number(form.productId),
                });

                toast.success("Đã thêm sản phẩm");

            }

            onSuccess();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Thao tác thất bại"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <form onSubmit={handleSubmit} className="space-y-5">

            {!item ? (

                <div>

                    <label className="mb-2 block font-medium text-slate-700">
                        Sản phẩm
                        <span className="text-red-500"> *</span>
                    </label>

                    <select
                        name="productId"
                        value={form.productId}
                        onChange={handleProductChange}
                        required
                        disabled={loading}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-pink-100"
                    >

                        <option value="">
                            Chọn sản phẩm
                        </option>

                        {products.map((product) => (

                            <option key={product.id} value={product.id}>
                                [{product.code}] {product.name}
                            </option>

                        ))}

                    </select>

                </div>

            ) : (

                <div>

                    <label className="mb-2 block font-medium text-slate-700">
                        Sản phẩm
                    </label>

                    <div className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-slate-600">
                        [{item.productCode}] {item.productName}
                    </div>

                </div>

            )}

            {!isReceipt && (

                <div>

                    <label className="mb-2 block font-medium text-slate-700">
                        Lô
                        <span className="text-red-500"> *</span>
                    </label>

                    <select
                        name="lotKey"
                        value={selectedLot ? lotKeyOf(selectedLot) : ""}
                        onChange={handleLotChange}
                        disabled={
                            loading ||
                            loadingLots ||
                            !selectedProductId ||
                            lots.length === 0
                        }
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-pink-100 disabled:bg-gray-50"
                    >

                        <option value="">
                            {!selectedProductId
                                ? "Chọn sản phẩm trước"
                                : loadingLots
                                    ? "Đang tải lô..."
                                    : lots.length === 0
                                        ? "Không có lô còn tồn kho"
                                        : "Chọn lô"}
                        </option>

                        {lots.map((lot) => (

                            <option key={lotKeyOf(lot)} value={lotKeyOf(lot)}>
                                {lotLabel(lot)}
                            </option>

                        ))}

                    </select>

                    {noLotAvailable && (

                        <p className="mt-2 text-sm text-red-500">
                            Sản phẩm không còn tồn kho trong kho của phiếu này.
                        </p>

                    )}

                    {!noLotAvailable && item && !selectedLot && !loadingLots && (

                        <p className="mt-2 text-sm text-amber-600">
                            Lô đã lưu trên dòng phiếu không còn tồn kho, vui lòng chọn lô khác.
                        </p>

                    )}

                </div>

            )}

            <div>

                <label className="mb-2 block font-medium text-slate-700">
                    Số lượng
                    <span className="text-red-500"> *</span>
                </label>

                <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    step="any"
                    min="0"
                    max={
                        !isReceipt && availableQuantity !== null
                            ? availableQuantity
                            : undefined
                    }
                    placeholder="Nhập số lượng"
                    disabled={loading}
                    aria-invalid={Boolean(quantityError)}
                    className={
                        quantityError
                            ? "w-full rounded-xl border border-red-400 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                            : "w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-pink-100"
                    }
                />

                {quantityError ? (

                    <p className="mt-2 text-sm text-red-500">
                        {quantityError}
                    </p>

                ) : (

                    !isReceipt && availableQuantity !== null && (

                        <p className="mt-2 text-sm text-slate-500">
                            Tồn kho khả dụng: {formatNumber(availableQuantity)}
                            {item?.unit ? ` ${item.unit}` : ""}
                        </p>

                    )

                )}

            </div>

            {isReceipt ? (

                <div className="grid gap-5 sm:grid-cols-2">

                    <div>

                        <label className="mb-2 block font-medium text-slate-700">
                            Lô
                        </label>

                        <input
                            type="text"
                            name="lotNumber"
                            value={form.lotNumber}
                            onChange={handleChange}
                            placeholder="Số lô"
                            disabled={loading}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-pink-100"
                        />

                    </div>

                    <div>

                        <label className="mb-2 block font-medium text-slate-700">
                            HSD
                        </label>

                        <input
                            type="date"
                            name="expirationDate"
                            value={form.expirationDate}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-pink-100"
                        />

                    </div>

                </div>

            ) : (

                <div>

                    <label className="mb-2 block font-medium text-slate-700">
                        HSD
                    </label>

                    <div className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-slate-600">
                        {issueExpirationDate
                            ? formatDate(issueExpirationDate)
                            : "—"}
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                        HSD được lấy tự động từ lô đã chọn.
                    </p>

                </div>

            )}

            {!isReceipt && (

                <div>

                    <label className="mb-2 block font-medium text-slate-700">
                        Đơn giá xuất
                    </label>

                    <input
                        type="number"
                        name="unitPrice"
                        value={form.unitPrice}
                        onChange={handleChange}
                        step="any"
                        min="0"
                        placeholder="Nhập đơn giá xuất"
                        disabled={loading}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-pink-100"
                    />

                </div>

            )}

            <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">

                <Button
                    variant="secondary"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Hủy
                </Button>

                <Button
                    type="submit"
                    disabled={blockSubmit}
                >
                    {loading
                        ? "Đang xử lý..."
                        : item
                            ? "Cập nhật sản phẩm"
                            : "Thêm sản phẩm"}
                </Button>

            </div>

        </form>

    );
}

export default ProductDocumentItemForm;
