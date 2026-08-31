import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import productReceiptApi from "../../api/productReceiptApi.js";
import productIssueApi from "../../api/productIssueApi.js";
import warehouseApi from "../../api/warehouseApi";
import customerApi from "../../api/customerApi.js";

import Button from "../common/Button.jsx";
import Loading from "../common/Loading.jsx";

import { unwrapContent, unwrapData } from "../../utils/apiResponse.js";
import {
    PRODUCT_WAREHOUSE_CODE,
    filterWarehousesByCode
} from "../../utils/warehouses.js";

const today = () =>
    new Date().toISOString().split("T")[0];

function ProductDocumentForm({
                                 transactionType,
                                 document,
                                 onSuccess,
                                 onCancel,
                             }) {

    const isReceipt = transactionType === "RECEIPT";

    const api = isReceipt
        ? productReceiptApi
        : productIssueApi;

    const dateField = isReceipt
        ? "receiptDate"
        : "issueDate";

    const [warehouses, setWarehouses] = useState([]);

    const [customers, setCustomers] = useState([]);

    const [loading, setLoading] = useState(false);

    const [loadingData, setLoadingData] = useState(true);

    const [form, setForm] = useState({
        warehouseId: "",
        customerId: "",
        date: today(),
    });

    useEffect(() => {

        const requests = [warehouseApi.getAllWarehouses({ size: 100 })];

        if (!isReceipt) {
            requests.push(customerApi.getAllCustomers({ size: 1000 }));
        }

        Promise.all(requests)

            .then(([warehouseResponse, customerResponse]) => {

                setWarehouses(
                    filterWarehousesByCode(
                        unwrapContent(warehouseResponse),
                        PRODUCT_WAREHOUSE_CODE
                    )
                );

                if (customerResponse) {

                    setCustomers(
                        unwrapContent(customerResponse)
                            .filter((customer) => customer.enabled !== false)
                    );

                }

            })

            .catch((error) => {

                toast.error(
                    error.response?.data?.message ||
                    "Không thể tải dữ liệu kho"
                );

            })

            .finally(() => {

                setLoadingData(false);

            });

    }, [isReceipt]);

    useEffect(() => {

        if (!document) {
            return;
        }

        setForm({
            warehouseId: document.warehouseId ?? "",
            customerId: document.customerId ?? "",
            date: document[dateField] ?? today(),
        });

    }, [document, dateField]);

    const handleChange = (event) => {

        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!form.warehouseId) {
            toast.error("Vui lòng chọn kho");
            return;
        }

        if (!form.date) {
            toast.error(
                isReceipt
                    ? "Vui lòng chọn ngày nhập"
                    : "Vui lòng chọn ngày xuất"
            );
            return;
        }

        const payload = {
            warehouseId: Number(form.warehouseId),
            [dateField]: form.date,
        };

        if (!isReceipt) {

            payload.customerId = form.customerId
                ? Number(form.customerId)
                : null;

        }

        setLoading(true);

        try {

            if (document) {

                await api.update(document.id, payload);

                toast.success(
                    isReceipt
                        ? "Đã cập nhật phiếu nhập sản phẩm"
                        : "Đã cập nhật phiếu xuất sản phẩm"
                );

                onSuccess(document.id);

            } else {

                const response = await api.create(payload);

                const created = unwrapData(response);

                if (!created?.id) {

                    toast.error(
                        "Tạo phiếu thành công nhưng không nhận được mã phiếu"
                    );

                    return;

                }

                toast.success(
                    isReceipt
                        ? "Đã tạo phiếu nhập sản phẩm"
                        : "Đã tạo phiếu xuất sản phẩm"
                );

                onSuccess(created.id);

            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                (isReceipt
                    ? "Không thể tạo phiếu nhập sản phẩm"
                    : "Không thể tạo phiếu xuất sản phẩm")
            );

        } finally {

            setLoading(false);

        }

    };

    if (loadingData) {
        return <Loading rows={3} />;
    }

    return (

        <form onSubmit={handleSubmit} className="space-y-6">

            <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Kho
                    <span className="text-red-500"> *</span>
                </label>

                <select
                    name="warehouseId"
                    value={form.warehouseId}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-pink-100 disabled:bg-gray-50"
                >

                    <option value="">
                        Chọn kho
                    </option>

                    {warehouses.map((warehouse) => (

                        <option key={warehouse.id} value={warehouse.id}>
                            {warehouse.name}
                        </option>

                    ))}

                </select>

            </div>

            <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                    {isReceipt ? "Ngày nhập" : "Ngày xuất"}
                    <span className="text-red-500"> *</span>
                </label>

                <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-pink-100 disabled:bg-gray-50"
                />

            </div>

            {!isReceipt && (

                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Khách hàng
                    </label>

                    <select
                        name="customerId"
                        value={form.customerId}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-pink-100 disabled:bg-gray-50"
                    >

                        <option value="">
                            Không chọn khách hàng
                        </option>

                        {customers.map((customer) => (

                            <option key={customer.id} value={customer.id}>
                                {customer.name}
                            </option>

                        ))}

                    </select>

                </div>

            )}

            <div className="flex flex-col-reverse gap-3 border-t border-(--color-border) pt-6 sm:flex-row sm:justify-end">

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
                        : document
                            ? "Cập nhật phiếu"
                            : isReceipt
                                ? "Tạo phiếu nhập"
                                : "Tạo phiếu xuất"}
                </Button>

            </div>

        </form>

    );
}

export default ProductDocumentForm;
