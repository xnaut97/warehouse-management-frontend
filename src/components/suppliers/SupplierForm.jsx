import { useEffect, useState } from "react";
import supplierApi from "../../api/supplierApi.js";
import { toast } from "react-hot-toast";

import {
    DEFAULT_SUPPLIER_GROUP,
    SUPPLIER_GROUPS,
    SUPPLIER_GROUP_LABELS
} from "./supplierConstants.js";

function SupplierForm({

                          supplier,

                          onSuccess,

                          onCancel

                      }) {

    const [form, setForm] = useState({

        code: "",

        name: "",

        address: "",

        supplierGroup: DEFAULT_SUPPLIER_GROUP,

        contactPerson: "",

        phone: "",

        email: "",

        note: ""

    });

    useEffect(() => {

        if (supplier) {

            setForm({

                code: supplier.code,

                name: supplier.name,

                address: supplier.address || "",

                supplierGroup: supplier.supplierGroup || DEFAULT_SUPPLIER_GROUP,

                contactPerson: supplier.contactPerson || "",

                phone: supplier.phone || "",

                email: supplier.email || "",

                note: supplier.note || ""

            });

        }

    }, [supplier]);

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (supplier) {

                await supplierApi.updateSupplier(

                    supplier.id,

                    form

                );

                toast.success(
                    "Đã cập nhật nhà cung cấp thành công"
                );

            } else {

                await supplierApi.createSupplier(form);

                toast.success(
                    "Đã thêm nhà cung cấp thành công"
                );

            }

            onSuccess();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Thao tác thất bại"
            );

        }

    };

    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >

            <div>

                <label className="block mb-2 text-sm font-medium">

                    Mã nhà cung cấp

                </label>

                <input
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-pink-400 focus:outline-none"
                    required
                />

            </div>

            <div>

                <label className="block mb-2 text-sm font-medium">

                    Tên nhà cung cấp

                </label>

                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-pink-400 focus:outline-none"
                    required
                />

            </div>

            <div>

                <label className="block mb-2 text-sm font-medium">

                    Địa chỉ

                </label>

                <textarea
                    rows="3"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-pink-400 focus:outline-none resize-none"
                />

            </div>

            <div>

                <label className="block mb-2 text-sm font-medium">

                    Nhóm cung cấp

                </label>

                <select
                    name="supplierGroup"
                    value={form.supplierGroup}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-pink-400 focus:outline-none"
                    required
                >

                    {SUPPLIER_GROUPS.map((group) => (

                        <option key={group} value={group}>

                            {SUPPLIER_GROUP_LABELS[group]}

                        </option>

                    ))}

                </select>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

                <div>

                    <label className="block mb-2 text-sm font-medium">

                        Người liên hệ

                    </label>

                    <input
                        name="contactPerson"
                        value={form.contactPerson}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-pink-400 focus:outline-none"
                    />

                </div>

                <div>

                    <label className="block mb-2 text-sm font-medium">

                        Số điện thoại

                    </label>

                    <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-pink-400 focus:outline-none"
                    />

                </div>

            </div>

            <div>

                <label className="block mb-2 text-sm font-medium">

                    Email

                </label>

                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-pink-400 focus:outline-none"
                />

            </div>

            <div>

                <label className="block mb-2 text-sm font-medium">

                    Ghi chú

                </label>

                <textarea
                    rows="3"
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-pink-400 focus:outline-none resize-none"
                />

            </div>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">

                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl text-(--color-primary-hover) border border-(--color-border) px-6 py-3 font-medium
                    transition hover:bg-pink-50 hover:text-(--color-primary) disabled:opacity-50"
                >

                    Hủy

                </button>

                <button
                    type="submit"
                    className="rounded-xl bg-(--color-primary-hover) px-6 py-3 font-medium text-white transition
                    hover:bg-(--color-primary) disabled:opacity-50"
                >

                    {
                        supplier
                            ? "Cập nhật"
                            : "Thêm"
                    }

                </button>

            </div>

        </form>

    );

}

export default SupplierForm;
