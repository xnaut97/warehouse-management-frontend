import Badge from "../common/Badge.jsx";

function ReceiptStatusBadge({ status }) {

    const statusColor = {
        DRAFT: "yellow",
        CONFIRMED: "green",
        CANCELLED: "red"
    };

    const statusLabel = {
        DRAFT: "Nháp",
        CONFIRMED: "Đã xác nhận",
        CANCELLED: "Đã hủy"
    };

    return (
        <Badge color={statusColor[status] || "gray"}>
            {statusLabel[status] || status}
        </Badge>
    );
}

export default ReceiptStatusBadge;
