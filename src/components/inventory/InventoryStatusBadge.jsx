import Badge from "../common/Badge";

function InventoryStatusBadge({ status }) {

    const badgeColor = {
        NORMAL: "green",
        BELOW_MIN: "red",
        ABOVE_MAX: "yellow"
    };

    const label = {
        NORMAL: "Bình thường",
        BELOW_MIN: "Cảnh báo min",
        ABOVE_MAX: "Cảnh báo max"
    };

    return (

        <Badge color={badgeColor[status] || "gray"}>

            {label[status] || status}

        </Badge>

    );

}

export default InventoryStatusBadge;
