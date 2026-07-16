import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Plus } from "lucide-react";

import issueApi from "../../api/issueApi.js";

import IssueDetailCard from "./IssueDetailCard.jsx";
import IssueItemTable from "./IssueItemTable.jsx";
import ConfirmDialog from "../common/ConfirmDialog.jsx";

function IssueDetail() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [issue, setIssue] = useState(null);

    const [showConfirm, setShowConfirm] = useState(false);

    const loadIssue = async () => {

        try {

            const response = await issueApi.getDetail(id);

            setIssue(response.data.data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        loadIssue();

    }, [id]);


    const handleConfirm = async () => {
        try {

            await issueApi.confirm(id);

            loadIssue();

        } catch (error) {

            console.log(error);

        }

    };


    if (!issue) {

        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-slate-500">
                    Đang tải dữ liệu...
                </div>
            </div>
        );

    }


    const statusStyle = {
        DRAFT: "bg-yellow-100 text-yellow-700",
        CONFIRMED: "bg-green-100 text-green-700",
        CANCELLED: "bg-red-100 text-red-700"
    };


    const statusText = {
        DRAFT: "Nháp",
        CONFIRMED: "Đã xác nhận",
        CANCELLED: "Đã hủy"
    };


    return (

        <div className="space-y-6 pt-10 pb-10 pl-12 pr-12">

            <button
                onClick={() => navigate("/issues")}
                className="group flex items-center gap-2 text-lg font-medium text-slate-600 transition hover:text-blue-600"
            >

                <ArrowLeft
                    size={18}
                    className="transition group-hover:-translate-x-1"
                />

                Quay lại danh sách phiếu xuất

            </button>


            <div className="rounded-xl bg-white p-6 shadow-sm">

                <div className="flex items-start justify-between">

                    <div className="space-y-2">

                        <div className="flex items-center gap-3">

                            <h1 className="text-3xl font-bold text-slate-800">
                                Phiếu xuất {issue.issueNo}
                            </h1>


                            <span
                                className={`rounded-full px-3 py-1 text-sm font-medium ${statusStyle[issue.status]}`}
                            >
                                {statusText[issue.status]}
                            </span>

                        </div>


                        <p className="text-sm text-slate-500">
                            Chi tiết thông tin phiếu xuất kho
                        </p>

                    </div>


                    {
                        issue.status === "DRAFT" && (

                            <div className="flex gap-3">

                                <button
                                    className="flex items-center gap-2 rounded-lg border border-blue-600 px-5 py-3 font-medium text-blue-600 transition hover:bg-blue-50"
                                >

                                    <Plus size={18}/>

                                    Thêm hàng hóa

                                </button>


                                <button
                                    onClick={() => setShowConfirm(true)}
                                    className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-700"
                                >

                                    <Check size={18}/>

                                    Xác nhận phiếu

                                </button>

                            </div>

                        )
                    }


                </div>

            </div>


            <div className="rounded-xl bg-white p-6 shadow-sm">

                <h2 className="mb-5 text-lg font-semibold text-slate-800">
                    Thông tin phiếu xuất
                </h2>

                <IssueDetailCard issue={issue}/>

            </div>


            <div className="rounded-xl bg-white p-6 shadow-sm">

                <h2 className="mb-5 text-lg font-semibold text-slate-800">
                    Danh sách hàng hóa
                </h2>

                <IssueItemTable items={issue.items}/>

            </div>

            {
                showConfirm && (
                    <ConfirmDialog
                        title="Xác nhận phiếu xuất"
                        message="Bạn có chắc chắn muốn xác nhận phiếu xuất?"
                        onConfirm={async () => {
                            await handleConfirm();
                            setShowConfirm(false);
                        }}
                        onCancel={() => setShowConfirm(false)}
                    />
                )
            }

        </div>

    );

}

export default IssueDetail;