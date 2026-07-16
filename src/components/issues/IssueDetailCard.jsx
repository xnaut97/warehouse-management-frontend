import IssueStatusBadge from "./IssueStatusBadge";

function IssueDetailCard({ issue }) {

    return (

        <div className="rounded-xl border border-pink-100 bg-white p-6 shadow-sm">

            <div className="grid grid-cols-2 gap-6">

                <div>

                    <p className="text-sm text-slate-500">
                        Mã phiếu
                    </p>

                    <p className="mt-1 font-semibold">
                        {issue.issueNo}
                    </p>

                </div>

                <div>

                    <p className="text-sm text-slate-500">
                        Trạng thái
                    </p>

                    <div className="mt-1">

                        <IssueStatusBadge
                            status={issue.status}
                        />

                    </div>

                </div>

                <div>

                    <p className="text-sm text-slate-500">
                        Kho
                    </p>

                    <p className="mt-1">
                        {issue.warehouse}
                    </p>

                </div>

                <div>

                    <p className="text-sm text-slate-500">
                        Khách hàng
                    </p>

                    <p className="mt-1">
                        {issue.customer}
                    </p>

                </div>

                <div>

                    <p className="text-sm text-slate-500">
                        Ngày xuất
                    </p>

                    <p className="mt-1">
                        {issue.issueDate}
                    </p>

                </div>

                <div>

                    <p className="text-sm text-slate-500">
                        Tổng tiền
                    </p>

                    <p className="mt-1 font-semibold">

                        {issue.totalAmount}

                    </p>

                </div>

            </div>

        </div>

    );

}

export default IssueDetailCard;