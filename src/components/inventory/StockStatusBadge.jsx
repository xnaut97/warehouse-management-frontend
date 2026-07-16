import Badge from "../common/Badge";

function StockStatusBadge({ status }) {

    const badgeColor = {
        NORMAL: "green",
        LOW: "yellow",
        OUT_OF_STOCK: "red"
    };

    const label = {
        NORMAL: "Bình thường",
        LOW: "Sắp hết",
        OUT_OF_STOCK: "Hết hàng"
    };

    return (

        <Badge color={badgeColor[status] || "gray"}>

            {label[status] || status}

        </Badge>

    );

}

export default StockStatusBadge;