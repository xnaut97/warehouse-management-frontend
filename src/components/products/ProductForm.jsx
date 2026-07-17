import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import productApi from "../../api/productApi.js";

function ProductForm({

                         product,

                         onSuccess,

                         onCancel

                     }) {

    const [form, setForm] = useState({

        code: "",
        name: "",
        specification: "",
        unit: "",
        sellingPrice: "",
        enabled: true

    });


    useEffect(() => {

        console.log(product);
        if (!product) {

            return;

        }

        setForm({

            code: product.code || "",

            name: product.name,

            specification: product.specification || "",

            unit: product.unit || "",

            sellingPrice: product.sellingPrice || "",

            enabled: product.enabled

        });

    }, [product]);


    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;


        setForm({

            ...form,

            [name]:

                type === "checkbox"

                    ? checked

                    : value

        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();


        try {

            if (product) {

                await productApi.updateProduct(

                    product.id,

                    {

                        name: form.name,

                        specification: form.specification,

                        unit: form.unit,

                        sellingPrice: form.sellingPrice,

                        enabled: form.enabled

                    }

                );


                toast.success(
                    "Đã cập nhật sản phẩm thành công"
                );


            } else {

                await productApi.createProduct({

                    code: form.code,

                    name: form.name,

                    specification: form.specification,

                    unit: form.unit,

                    sellingPrice: form.sellingPrice

                });


                toast.success(
                    "Đã thêm sản phẩm thành công"
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

            {
                !product &&

                <div>

                    <label className="mb-2 block font-medium">

                        Mã sản phẩm

                    </label>


                    <input

                        type="text"

                        name="code"

                        value={form.code}

                        onChange={handleChange}

                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"

                    />

                </div>

            }


            <div>

                <label className="mb-2 block font-medium">

                    Tên sản phẩm

                </label>


                <input

                    type="text"

                    name="name"

                    value={form.name}

                    onChange={handleChange}

                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"

                />

            </div>


            <div>

                <label className="mb-2 block font-medium">

                    Quy cách

                </label>


                <input

                    type="text"

                    name="specification"

                    value={form.specification}

                    onChange={handleChange}

                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"

                />

            </div>


            <div>

                <label className="mb-2 block font-medium">

                    Đơn vị tính

                </label>


                <input

                    type="text"

                    name="unit"

                    value={form.unit}

                    onChange={handleChange}

                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"

                />

            </div>


            <div>

                <label className="mb-2 block font-medium">

                    Giá bán

                </label>


                <input

                    type="number"

                    name="sellingPrice"

                    value={form.sellingPrice}

                    onChange={handleChange}

                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"

                />

            </div>


            {
                product &&

                <div className="flex items-center gap-3">

                    <input

                        type="checkbox"

                        name="enabled"

                        checked={form.enabled}

                        onChange={handleChange}

                        className="h-5 w-5 accent-pink-500"

                    />


                    <span>

                        Sản phẩm đang hoạt động

                    </span>

                </div>

            }


            <div className="flex justify-end gap-3 pt-4">


                <button

                    type="button"

                    onClick={onCancel}

                    className="rounded-xl border px-6 py-3 transition hover:bg-gray-100"

                >

                    Hủy

                </button>


                <button

                    type="submit"

                    className="rounded-xl bg-pink-500 px-6 py-3 font-medium text-white transition hover:bg-pink-600"

                >

                    {
                        product

                            ? "Cập nhật sản phẩm"

                            : "Thêm sản phẩm"
                    }

                </button>


            </div>


        </form>

    );

}


export default ProductForm;