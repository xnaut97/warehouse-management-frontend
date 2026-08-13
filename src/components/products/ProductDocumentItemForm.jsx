import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import productApi from "../../api/productApi.js";
import productReceiptApi from "../../api/productReceiptApi.js";
import productIssueApi from "../../api/productIssueApi.js";

import Button from "../common/Button.jsx";

import { unwrapContent } from "../../utils/apiResponse.js";

function ProductDocumentItemForm({
                                     transactionType,
                                     documentId,
                                     item,
                                     onSuccess,
                                     onCancel,
                                 }) {

    const isReceipt = transactionType === "RECEIPT";

    const api = isReceipt
        ? productReceiptApi
        : productIssueApi;

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(false);

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

    const handleChange = (event) => {

        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

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

        const payload = {
            quantity: Number(form.quantity),
            lotNumber: form.lotNumber || null,
            expirationDate: form.expirationDate || null,
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
                        onChange={handleChange}
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
                    placeholder="Nhập số lượng"
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-pink-100"
                />

            </div>

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
                    disabled={loading}
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
