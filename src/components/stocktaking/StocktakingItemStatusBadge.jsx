import Badge from "../common/Badge.jsx";

import {
    itemStatusColor,
    itemStatusLabel
} from "./stocktakingLabels.js";

function StocktakingItemStatusBadge({ status }) {

    if (!status) {

        return (

            <Badge color="gray">
                Chưa kiểm kê
            </Badge>

        );

    }

    return (

        <Badge color={itemStatusColor[status] || "gray"}>

            {itemStatusLabel[status] || status}

        </Badge>

    );

}

export default StocktakingItemStatusBadge;
