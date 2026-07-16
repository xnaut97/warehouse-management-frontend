import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import warehouseApi from "../../api/warehouseApi.js";
import userApi from "../../api/userApi.js";

function WarehouseForm({

                           warehouse,

                           onSuccess,

                           onCancel

                       }) {

    const [users, setUsers] = useState([]);

    const [form, setForm] = useState({

        code: "",

        name: "",

        address: "",

        description: "",

        managerId: "",

        enabled: true

    });

    const roleLabels = {
        ADMIN: "Quản trị viên",
        WAREHOUSE_MANAGER: "Quản lý kho",
        WAREHOUSE_STAFF: "Nhân viên kho",
        DIRECTOR: "Giám đốc",
    };

    useEffect(() => {

        loadUsers();

    }, []);

    useEffect(() => {

        if (!warehouse) {

            return;

        }

        setForm({

            code: warehouse.code,

            name: warehouse.name,

            address: warehouse.address || "",

            description: warehouse.description || "",

            managerId: warehouse.managerId || "",

            enabled: warehouse.enabled

        });

    }, [warehouse]);

    const loadUsers = async () => {

        try {

            const response =
                await userApi.getAllUsers();

            setUsers(

                response.data.data.filter(

                    user => user.enabled

                )

            );

        } catch (error) {

            console.log(error);

        }

    };

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

            if (warehouse) {

                await warehouseApi.updateWarehouse(

                    warehouse.id,

                    {

                        name: form.name,

                        address: form.address,

                        description: form.description,

                        managerId: form.managerId || null,

                        enabled: form.enabled

                    }

                );

                toast.success(
                    "Đã cập nhật kho thành công"
                );

            } else {

                await warehouseApi.createWarehouse({

                    code: form.code,

                    name: form.name,

                    address: form.address,

                    description: form.description,

                    managerId: form.managerId || null

                });

                toast.success(
                    "Đã thêm kho thành công"
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

                !warehouse &&

                <div>

                    <label className="mb-2 block font-medium">

                        Mã kho

                    </label>

                    <input

                        type="text"

                        name="code"

                        value={form.code}

                        onChange={handleChange}

                        className="
                            w-full
                            rounded-xl
                            border
                            border-gray-300
                            px-4
                            py-3
                            outline-none
                            focus:border-pink-500
                        "

                    />

                </div>

            }

            <div>

                <label className="mb-2 block font-medium">

                    Tên kho

                </label>

                <input

                    type="text"

                    name="name"

                    value={form.name}

                    onChange={handleChange}

                    className="
                        w-full
                        rounded-xl
                        border
                        border-gray-300
                        px-4
                        py-3
                        outline-none
                        focus:border-pink-500
                    "

                />

            </div>

            <div>

                <label className="mb-2 block font-medium">

                    Địa chỉ

                </label>

                <input

                    type="text"

                    name="address"

                    value={form.address}

                    onChange={handleChange}

                    className="
                        w-full
                        rounded-xl
                        border
                        border-gray-300
                        px-4
                        py-3
                        outline-none
                        focus:border-pink-500
                    "

                />

            </div>

            <div>

                <label className="mb-2 block font-medium">

                    Mô tả

                </label>

                <textarea

                    rows={4}

                    name="description"

                    value={form.description}

                    onChange={handleChange}

                    className="
                        w-full
                        rounded-xl
                        border
                        border-gray-300
                        px-4
                        py-3
                        outline-none
                        focus:border-pink-500
                    "

                />

            </div>

            <div>

                <label className="mb-2 block font-medium">

                    Người quản lý

                </label>

                <select

                    name="managerId"

                    value={form.managerId}

                    onChange={handleChange}

                    className="
                        w-full
                        rounded-xl
                        border
                        border-gray-300
                        px-4
                        py-3
                        outline-none
                        focus:border-pink-500
                    "

                >

                    <option value="">

                        Chưa có người quản lý

                    </option>

                    {

                        users.map(user => (

                            <option

                                key={user.id}

                                value={user.id}

                            >

                                {user.fullName} ({roleLabels[user.role] || user.role})

                            </option>

                        ))

                    }

                </select>

            </div>

            {

                warehouse &&

                <div className="
                    flex
                    items-center
                    gap-3
                ">

                    <input

                        type="checkbox"

                        name="enabled"

                        checked={form.enabled}

                        onChange={handleChange}

                        className="
                            h-5
                            w-5
                            accent-pink-500
                        "

                    />

                    <span>

                        Kho đang hoạt động

                    </span>

                </div>

            }

            <div className="
                flex
                justify-end
                gap-3
                pt-4
            ">

                <button

                    type="button"

                    onClick={onCancel}

                    className="
                        rounded-xl
                        border
                        px-6
                        py-3
                        transition
                        hover:bg-gray-100
                    "

                >

                    Hủy

                </button>

                <button

                    type="submit"

                    className="
                        rounded-xl
                        bg-pink-500
                        px-6
                        py-3
                        font-medium
                        text-white
                        transition
                        hover:bg-pink-600
                    "

                >

                    {

                        warehouse

                            ? "Cập nhật kho"

                            : "Thêm kho"

                    }

                </button>

            </div>

        </form>

    );

}

export default WarehouseForm;
