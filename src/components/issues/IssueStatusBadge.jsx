import Badge from "../common/Badge.jsx";

function IssueStatusBadge({ status }) {

    const badgeColor = {
        DRAFT: "yellow",
        CONFIRMED: "green",
        CANCELLED: "red"
    };

    const label = {
        DRAFT: "Bản nháp",
        CONFIRMED: "Đã xác nhận",
        CANCELLED: "Đã hủy"
    };

    return (
        <Badge color={badgeColor[status]}>
            {label[status]}
        </Badge>
    );

}

export default IssueStatusBadge;