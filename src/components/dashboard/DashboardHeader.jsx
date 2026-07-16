import { Bell } from "lucide-react";

function DashboardHeader() {

    const greeting = () => {

        const hour = new Date().getHours();

        if (hour < 12) return "Chào buổi sáng";

        if(hour >= 16 && hour <= 18) return "Chào buổi chiều";

        if (hour < 18) return "Chào buổi trưa";

        return "Chào buổi tối";

    };

    return (

        <div className="
            mb-8
            flex
            items-center
            justify-between
        ">

            <div>

                <h1 className="
                    text-4xl
                    font-bold
                    text-gray-800
                ">

                    {greeting()} 👋

                </h1>

                <p className="
                    mt-2
                    text-gray-500
                ">

                    Chào mừng quay trở lại với Hệ Thống Quản Lý Kho

                </p>

            </div>

            <button
                className="
                    rounded-2xl
                    bg-white
                    p-3
                    shadow
                    transition
                    hover:shadow-lg
                "
            >

                <Bell size={22}/>

            </button>

        </div>

    );

}

export default DashboardHeader;