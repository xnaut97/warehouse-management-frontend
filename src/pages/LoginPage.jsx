import { useState } from "react";
import authApi from "../api/authApi.js";
import authStore from "../store/authStore.js";
import { useNavigate } from "react-router-dom";


function LoginPage(){

    const navigate = useNavigate();

    const login = authStore(
        state => state.login
    );


    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");


    const handleSubmit = async(e)=>{

        e.preventDefault();


        try{

            const response =
                await authApi.login({
                    username,
                    password
                });


            const token = response.data.data.token;
            const user = response.data.data.user;

            login(user, token);

            navigate("/");
        }
        catch(error){

            console.log(error);

            alert("Đăng nhập thất bại");

        }

    }



    return (

        <div className="
            min-h-screen
            flex
            items-center
            justify-center
            bg-[#FFF0F3]
            px-4
        ">

            <form
                onSubmit={handleSubmit}
                className="
                    bg-white
                    p-6
                    sm:p-8
                    rounded-xl
                    shadow-md
                    w-full
                    max-w-96
                "
            >

                <h1 className="
                    text-3xl
                    font-bold
                    mb-6
                    text-center
                ">
                    Đăng nhập
                </h1>


                <input

                    className="
                        w-full
                        border
                        p-2
                        mb-4
                        rounded
                    "

                    placeholder="Tên đăng nhập"

                    value={username}

                    onChange={
                        e=>setUsername(e.target.value)
                    }

                />


                <input

                    type="password"

                    className="
                        w-full
                        border
                        p-2
                        mb-6
                        rounded
                    "

                    placeholder="Mật khẩu"

                    value={password}

                    onChange={
                        e=>setPassword(e.target.value)
                    }

                />


                <button

                    className="
                        w-full
                        bg-(--color-primary)
                        text-white
                        py-2
                        rounded
                        hover:bg-primary-hover
                    "

                >

                    Đăng nhập

                </button>


            </form>


        </div>

    )

}


export default LoginPage;
