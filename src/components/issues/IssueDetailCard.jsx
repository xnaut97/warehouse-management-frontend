import IssueStatusBadge from "./IssueStatusBadge.jsx";

function IssueDetailCard({ issue }) {
    return (
        <div className="rounded-xl bg-white p-4 shadow-sm sm:p-8">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-semibold text-slate-800">
                    Thông tin phiếu xuất
                </h2>

                <IssueStatusBadge status={issue.status} />
            </div>

            <div className="grid gap-4 text-sm sm:grid-cols-2">
                <div>
                    <p className="text-gray-500">Số phiếu xuất</p>
                    <p className="font-medium">
                        {issue.issueNo}
                    </p>
                </div>

                <div>
                    <p className="text-gray-500">Kho</p>
                    <p className="font-medium">
                        {issue.warehouse}
                    </p>
                </div>

                <div>
                    <p className="text-gray-500">Ngày xuất</p>
                    <p className="font-medium">
                        {issue.issueDate}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default IssueDetailCard;