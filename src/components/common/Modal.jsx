function Modal({
                   title,
                   children,
                   onClose
               }) {


    return (

        <div className="
            fixed
            inset-0
            z-50
            bg-black/40
            flex
            items-center
            justify-center
            p-4
        ">


            <div className="
                bg-white
                rounded-xl
                shadow-lg
                w-full
                max-w-[500px]
                max-h-[calc(100vh-2rem)]
                overflow-y-auto
                p-4
                sm:p-6
            ">


                <div className="
                    flex
                    justify-between
                    items-center
                    mb-5
                ">

                    <h2 className="
                        text-xl
                        font-bold
                        pr-4
                    ">
                        {title}
                    </h2>


                    <button
                        onClick={onClose}
                        className="
                            text-gray-500
                        "
                    >
                        ✕
                    </button>


                </div>


                {children}


            </div>


        </div>

    )

}


export default Modal;
