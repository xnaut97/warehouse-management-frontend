import {
    LucideSquareArrowRightEnter
} from "lucide-react";

function StatCard({
                      title,
                      value,
                      icon,
                      color = "bg-pink-100",
                      onClick
                  }) {

    return (

        <div
            onClick={onClick}
            className={`rounded-2xl border border-(--color-border) bg-white p-6 shadow-sm transition-all duration-200 ${
                onClick
                    ? "cursor-pointer hover:-translate-y-1 hover:shadow-md"
                    : ""
            }`}
        >

            <div className="mb-5 flex items-center justify-between">

                <div className={`rounded-xl text-(--color-border) p-3`}>
                    {icon}
                </div>

                {
                    onClick && <LucideSquareArrowRightEnter
                        size={20}
                        className="text-(--color-border)"
                    />
                }

            </div>


            <h3 className="text-sm text-gray-500">
                {title}
            </h3>


            <p className="mt-2 text-3xl font-bold">
                {value}
            </p>


        </div>

    );

}

export default StatCard;