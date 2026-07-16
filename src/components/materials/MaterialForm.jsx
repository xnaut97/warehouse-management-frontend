import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import materialApi from "../../api/materialApi.js";
import supplierApi from "../../api/supplierApi.js";

function MaterialForm({

                          material,

                          onSuccess,

                          onCancel

                      }) {

    const [suppliers, setSuppliers] = useState([]);

    const [form, setForm] = useState({

        code: "",

        name: "",

        unit: "",

        unitPrice: "",

        minimumStock: "",

        supplierId: ""

    });

    useEffect(() => {

        loadSuppliers();

    }, []);

    useEffect(() => {

        if (material) {

            setForm({

                code: material.code,

                name: material.name,

                unit: material.unit,

                unitPrice: material.unitPrice,

                minimumStock: material.minimumStock,

                supplierId: material.supplierId

            });

        }

    }, [material]);

    const loadSuppliers = async () => {

        try {

            const response =
                await supplierApi.getAllSuppliers();

            setSuppliers(
                response.data.data.content
            );

        } catch (error) {

            console.log(error);

        }

    };

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (material) {

                await materialApi.updateMaterial(

                    material.id,

                    form

                );

                toast.success(
                    "Đã cập nhật nguyên vật liệu thành công"
                );

            } else {

                await materialApi.createMaterial(
                    form
                );

                toast.success(
                    "Đã thêm nguyên vật liệu thành công"
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

            <input
                name="code"
                placeholder="Mã"
                value={form.code}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
            />

            <input
                name="name"
                placeholder="Tên nguyên vật liệu"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
            />

            <input
                name="unit"
                placeholder="Đơn vị tính"
                value={form.unit}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
            />

            <input
                type="number"
                step="0.01"
                name="unitPrice"
                placeholder="Đơn giá"
                value={form.unitPrice}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
            />

            <input
                type="number"
                step="0.01"
                name="minimumStock"
                placeholder="Tồn kho tối thiểu"
                value={form.minimumStock}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
            />

            <select
                name="supplierId"
                value={form.supplierId}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
            >

                <option value="">
                    Chọn nhà cung cấp
                </option>

                {

                    suppliers.map((supplier) => (

                        <option
                            key={supplier.id}
                            value={supplier.id}
                        >

                            {supplier.name}

                        </option>

                    ))

                }

            </select>

            <div className="
                flex
                justify-end
                gap-3
            ">

                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl border px-5 py-2"
                >

                    Hủy

                </button>

                <button
                    type="submit"
                    className="
                        rounded-xl
                        bg-pink-500
                        px-5
                        py-2
                        text-white
                        hover:bg-pink-600
                    "
                >

                    {

                        material
                            ? "Cập nhật"
                            : "Thêm mới"

                    }

                </button>

            </div>

        </form>

    );

}

export default MaterialForm;
