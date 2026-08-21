import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import customerApi from "../../api/customerApi.js";

import {
    CUSTOMER_GROUPS,
    CUSTOMER_GROUP_LABELS,
    DEFAULT_CUSTOMER_GROUP
} from "./customerConstants.js";


function CustomerForm({
                          customer,
                          onCancel,
                          onSuccess
                      }) {


    const [form, setForm] = useState({

        code: "",

        name: "",

        address: "",

        customerGroup: DEFAULT_CUSTOMER_GROUP,

        receiverName: "",

        phone: "",

        email: "",

        note: ""

    });


    useEffect(() => {

        if (customer) {

            setForm({

                code: customer.code || "",

                name: customer.name || "",

                address: customer.address || "",

                customerGroup: customer.customerGroup || DEFAULT_CUSTOMER_GROUP,

                receiverName: customer.receiverName || "",

                phone: customer.phone || "",

                email: customer.email || "",

                note: customer.note || ""

            });

        }

    }, [customer]);


    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (customer) {

                await customerApi.updateCustomer(
                    customer.id,
                    form
                );

                toast.success(
                    "Đã cập nhật khách hàng thành công"
                );

            } else {

                await customerApi.createCustomer(form);

                toast.success(
                    "Đã thêm khách hàng thành công"
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

                <label className="mb-2 block text-sm font-medium">

                    Mã KH

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

                <label className="mb-2 block text-sm font-medium">

                    Tên KH

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

                <label className="mb-2 block text-sm font-medium">

                    Địa chỉ

                </label>

                <textarea
                    rows="3"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 focus:border-pink-400 focus:outline-none"
                />

            </div>

            <div>

                <label className="mb-2 block text-sm font-medium">

                    Nhóm khách hàng

                </label>

                <select
                    name="customerGroup"
                    value={form.customerGroup}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-pink-400 focus:outline-none"
                    required
                >

                    {CUSTOMER_GROUPS.map((group) => (

                        <option key={group} value={group}>

                            {CUSTOMER_GROUP_LABELS[group]}

                        </option>

                    ))}

                </select>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

                <div>

                    <label className="mb-2 block text-sm font-medium">

                        Người nhận hàng

                    </label>

                    <input
                        name="receiverName"
                        value={form.receiverName}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-pink-400 focus:outline-none"
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">

                        SĐT

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

                <label className="mb-2 block text-sm font-medium">

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

                <label className="mb-2 block text-sm font-medium">

                    Ghi chú

                </label>

                <textarea
                    rows="3"
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 focus:border-pink-400 focus:outline-none"
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
                        customer
                            ? "Cập nhật"
                            : "Thêm"
                    }

                </button>

            </div>

        </form>

    );

}


export default CustomerForm;
