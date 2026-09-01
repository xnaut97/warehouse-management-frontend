import Badge from "../common/Badge";

function ExpiryStatusBadge({ status }) {

    const badgeColor = {
        FEFO: "red",
        SAFE: "green"
    };

    const label = {
        FEFO: "FEFO",
        SAFE: "An toàn"
    };

    return (

        <Badge color={badgeColor[status] || "gray"}>

            {label[status] || status}

        </Badge>

    );

}

export default ExpiryStatusBadge;
