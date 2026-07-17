import { useState } from "react";

import customerApi from "../../api/customerApi.js";


function CustomerForm({
                          customer,
                          onCancel,
                          onSuccess
                      }) {


    const [form, setForm] = useState({

        code: customer?.code || "",
        name: customer?.name || "",
        contactName: customer?.contactName || "",
        phone: customer?.phone || "",
        email: customer?.email || "",
        address: customer?.address || ""

    });



    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };



    const handleSubmit = async (e) => {

        e.preventDefault();


        if (customer) {

            await customerApi.updateCustomer(
                customer.id,
                form
            );

        } else {

            await customerApi.createCustomer(form);

        }


        onSuccess();

    };



    return (

            <form
                onSubmit={handleSubmit}
                className="w-full space-y-4"
            >


                <h2 className="mb-5 text-xl font-semibold text-slate-800">

                    {
                        customer
                            ? "Cập nhật khách hàng"
                            : "Thêm khách hàng"
                    }

                </h2>



                {
                    [
                        ["code","Mã khách hàng"],
                        ["name","Tên khách hàng"],
                        ["contactName","Người liên hệ"],
                        ["phone","Số điện thoại"],
                        ["email","Email"],
                        ["address","Địa chỉ"]
                    ].map(([name,label]) => (

                        <div key={name}>

                            <label className="mb-1 block text-sm text-slate-600">
                                {label}
                            </label>

                            <input
                                name={name}
                                value={form[name]}
                                onChange={handleChange}
                                className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
                            />

                        </div>

                    ))
                }



                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">


                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border px-5 py-2.5 text-slate-600"
                    >
                        Hủy
                    </button>



                    <button
                        className="rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-white"
                    >
                        Lưu
                    </button>


                </div>


            </form>

    );

}


export default CustomerForm;
