import { useState } from "react";
import userApi from "../../api/userApi.js";


function ResetPasswordForm({ user, onSuccess }) {

    const [password, setPassword] = useState("");


    const submit = async (e) => {

        e.preventDefault();

        try {

            await userApi.resetPassword(user.id, {
                password
            });

            onSuccess();

        } catch(error) {

            console.log(error);

            alert("Đặt lại mật khẩu thất bại");

        }

    };


    return (
        <form onSubmit={submit} className="space-y-4">

            <p>
                Đặt lại mật khẩu cho:
                <b> {user.username}</b>
            </p>


            <input
                type="password"
                placeholder="Mật khẩu mới"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="w-full border p-2 rounded"
            />


            <button
                className="w-full rounded-xl bg-(--color-primary-hover) px-6 py-3 font-medium text-white transition
                    hover:bg-(--color-primary) disabled:opacity-50"
            >
                Đặt lại mật khẩu
            </button>

        </form>
    );

}


export default ResetPasswordForm;
