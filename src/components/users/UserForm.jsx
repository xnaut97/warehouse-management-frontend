import { useState } from "react";
import userApi from "../../api/userApi.js";

function UserForm({
                      user,
                      onSuccess,
                      onCancel
                  }) {


    const [form,setForm] = useState({

        username:user?.username ?? "",
        password:"",
        fullName:user?.fullName ?? "",
        email:user?.email ?? "",
        role:user?.role ?? "WAREHOUSE_STAFF"

    });



    const handleChange=(e)=>{

        setForm({

            ...form,

            [e.target.name]:
            e.target.value

        })

    }



    const submit = async(e)=>{

        e.preventDefault();


        try{


            if(user){

                await userApi.updateUser(
                    user.id,
                    form
                );


            }
            else{

                await userApi.createUser(
                    form
                );

            }


            onSuccess();


        }
        catch(error){

            console.log(error);

            alert(
                "Thao tác thất bại"
            );

        }

    }



    return (

        <form
            onSubmit={submit}
            className="space-y-4"
        >


            {
                !user &&
                <input

                    name="username"

                    placeholder="Tên đăng nhập"

                    className="
                        w-full
                        border
                        p-2
                        rounded
                    "

                    value={form.username}

                    onChange={handleChange}

                />
            }



            {
                !user &&
                <input

                    name="password"

                    type="password"

                    placeholder="Mật khẩu"

                    className="
                        w-full
                        border
                        p-2
                        rounded
                    "

                    value={form.password}

                    onChange={handleChange}

                />
            }



            <input

                name="fullName"

                placeholder="Họ và tên"

                className="
                    w-full
                    border
                    p-2
                    rounded
                "

                value={form.fullName}

                onChange={handleChange}

            />



            <input

                name="email"

                placeholder="Email"

                className="
                    w-full
                    border
                    p-2
                    rounded
                "

                value={form.email}

                onChange={handleChange}

            />



            <select

                name="role"

                className="
                    w-full
                    border
                    p-2
                    rounded
                "

                value={form.role}

                onChange={handleChange}

            >

                <option value="ADMIN">
                    Quản trị viên
                </option>

                <option value="WAREHOUSE_MANAGER">
                    Quản lý kho
                </option>

                <option value="WAREHOUSE_STAFF">
                    Nhân viên kho
                </option>

                <option value="DIRECTOR">
                    Giám đốc
                </option>


            </select>



            <button

                className="
                    w-full
                    bg-(--color-primary)
                    text-white
                    py-2
                    rounded
                "

            >

                Lưu

            </button>


        </form>

    )

}


export default UserForm;
