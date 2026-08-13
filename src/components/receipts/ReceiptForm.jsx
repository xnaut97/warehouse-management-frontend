import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import materialReceiptApi from "../../api/materialReceiptApi.js";
import warehouseApi from "../../api/warehouseApi";
import supplierApi from "../../api/supplierApi";

function ReceiptForm({ receipt, onSuccess, onCancel }) {

    const [warehouses, setWarehouses] =
        useState([]);

    const [suppliers, setSuppliers] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [loadingData, setLoadingData] =
        useState(true);


    const [form, setForm] = useState({
        supplierId: "",
        warehouseId: "",
        receiptDate:
            new Date()
                .toISOString()
                .split("T")[0],
    });


    /*
     * Load suppliers + warehouses.
     */
    useEffect(() => {

        const loadData = async () => {

            setLoadingData(true);

            try {

                const [
                    warehouseResponse,
                    supplierResponse,
                ] = await Promise.all([
                    warehouseApi.getAllWarehouses(),
                    supplierApi.getAllSuppliers(),
                ]);


                const warehouseData =
                    warehouseResponse.data?.data;

                const warehouseList =
                    Array.isArray(warehouseData)
                        ? warehouseData
                        : warehouseData?.content ?? [];


                const supplierData =
                    supplierResponse.data?.data;

                const supplierList =
                    Array.isArray(supplierData)
                        ? supplierData
                        : supplierData?.content ?? [];


                setWarehouses(
                    warehouseList.filter(
                        (warehouse) =>
                            warehouse.enabled
                    )
                );


                setSuppliers(
                    supplierList.filter(
                        (supplier) =>
                            supplier.enabled !== false
                    )
                );

            } catch (error) {

                console.error(error);

                toast.error(
                    "Không thể tải dữ liệu kho và nhà cung cấp"
                );

            } finally {

                setLoadingData(false);

            }

        };


        loadData();

    }, []);


    /*
     * Edit mode.
     */
    useEffect(() => {

        if (!receipt) {
            return;
        }

        setForm({
            supplierId:
                receipt.supplierId ?? "",

            warehouseId:
                receipt.warehouseId ?? "",

            receiptDate:
                receipt.receiptDate ??
                new Date()
                    .toISOString()
                    .split("T")[0],
        });

    }, [receipt]);


    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

    };


    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!form.supplierId) {

            toast.error(
                "Vui lòng chọn nhà cung cấp"
            );

            return;
        }


        if (!form.warehouseId) {

            toast.error(
                "Vui lòng chọn kho"
            );

            return;
        }


        if (!form.receiptDate) {

            toast.error(
                "Vui lòng chọn ngày nhập"
            );

            return;
        }


        setLoading(true);

        try {

            const payload = {
                supplierId: form.supplierId
                    ? Number(form.supplierId)
                    : null,

                warehouseId: Number(form.warehouseId),

                receiptDate: form.receiptDate,
            };


            if (receipt) {

                await materialReceiptApi.update(
                    receipt.id,
                    payload
                );

                toast.success(
                    "Đã cập nhật phiếu nhập"
                );

                onSuccess(
                    receipt.id
                );

            } else {

                const response =
                    await materialReceiptApi.create(
                        payload
                    );

                /*
                 * Expected:
                 *
                 * response.data.data.id
                 */
                const createdReceipt =
                    response.data?.data;

                const receiptId =
                    createdReceipt?.id;


                if (!receiptId) {

                    toast.error(
                        "Tạo phiếu thành công nhưng không nhận được mã phiếu"
                    );

                    return;
                }


                toast.success(
                    "Đã tạo phiếu nhập"
                );

                onSuccess(
                    receiptId
                );

            }

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Không thể tạo phiếu nhập"
            );

        } finally {

            setLoading(false);

        }

    };


    if (loadingData) {

        return (
            <div className="
                flex min-h-[220px]
                items-center justify-center
            ">
                <div className="
                    text-sm text-slate-500
                ">
                    Đang tải dữ liệu...
                </div>
            </div>
        );

    }


    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >


            <div>

                <label className="
                    mb-2 block text-sm font-medium
                    text-slate-700
                ">
                    Nhà cung cấp
                </label>

                <select
                    name="supplierId"
                    value={form.supplierId}
                    onChange={handleChange}
                    disabled={loading}
                    className="
                        w-full rounded-xl
                        border border-gray-300
                        bg-white px-4 py-3
                        text-slate-700
                        outline-none
                        transition
                        focus:border-(--color-primary)
                        focus:ring-2
                        focus:ring-pink-100
                        disabled:bg-gray-50
                    "
                >

                    <option value="">
                        Chọn nhà cung cấp
                    </option>

                    {suppliers.map((supplier) => (

                        <option
                            key={supplier.id}
                            value={supplier.id}
                        >
                            {supplier.name}
                        </option>

                    ))}

                </select>

            </div>


            {/* Kho */}

            <div>

                <label className="
                    mb-2 block text-sm font-medium
                    text-slate-700
                ">
                    Kho
                    <span className="text-red-500">
                        {" "}*
                    </span>
                </label>

                <select
                    name="warehouseId"
                    value={form.warehouseId}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="
                        w-full rounded-xl
                        border border-gray-300
                        bg-white px-4 py-3
                        text-slate-700
                        outline-none
                        transition
                        focus:border-(--color-primary)
                        focus:ring-2
                        focus:ring-pink-100
                        disabled:bg-gray-50
                    "
                >

                    <option value="">
                        Chọn kho
                    </option>

                    {warehouses.map((warehouse) => (

                        <option
                            key={warehouse.id}
                            value={warehouse.id}
                        >
                            {warehouse.name}
                        </option>

                    ))}

                </select>

            </div>


            {/* Ngày nhập */}

            <div>

                <label className="
                    mb-2 block text-sm font-medium
                    text-slate-700
                ">
                    Ngày nhập kho
                    <span className="text-red-500">
                        {" "}*
                    </span>
                </label>

                <input
                    type="date"
                    name="receiptDate"
                    value={form.receiptDate}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="
                        w-full rounded-xl
                        border border-gray-300
                        bg-white px-4 py-3
                        text-slate-700
                        outline-none
                        transition
                        focus:border-(--color-primary)
                        focus:ring-2
                        focus:ring-pink-100
                        disabled:bg-gray-50
                    "
                />

            </div>


            {/* Actions */}

            <div className="
                flex flex-col-reverse gap-3
                border-t border-(--color-border)
                pt-6
                sm:flex-row sm:justify-end
            ">

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="
                        rounded-xl
                        border border-(--color-border)
                        px-6 py-3
                        font-medium
                        text-(--color-primary-hover)
                        transition
                        hover:bg-pink-50
                        disabled:opacity-50
                    "
                >
                    Hủy
                </button>


                <button
                    type="submit"
                    disabled={loading}
                    className="
                        rounded-xl
                        bg-(--color-primary)
                        px-6 py-3
                        font-medium
                        text-white
                        transition
                        hover:bg-(--color-primary-hover)
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    {loading
                        ? "Đang tạo..."
                        : receipt
                            ? "Cập nhật phiếu nhập"
                            : "Tạo phiếu nhập"}
                </button>

            </div>

        </form>

    );
}

export default ReceiptForm;