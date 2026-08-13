function IssueStatusBadge({ status }) {
    const styles = {
        DRAFT: "bg-yellow-100 text-yellow-700",
        CONFIRMED: "bg-green-100 text-green-700",
        CANCELLED: "bg-red-100 text-red-700",
    };

    const labels = {
        DRAFT: "Nháp",
        CONFIRMED: "Đã xác nhận",
        CANCELLED: "Đã hủy",
    };

    return (
        <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
                styles[status] ?? "bg-gray-100 text-gray-600"
            }`}
        >
            {labels[status] ?? status}
        </span>
    );
}

export default IssueStatusBadge;