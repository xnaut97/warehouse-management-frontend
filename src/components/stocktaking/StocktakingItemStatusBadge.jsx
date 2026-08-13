import Badge from "../common/Badge.jsx";

import {
    itemStatusColor,
    itemStatusLabel
} from "./stocktakingLabels.js";

function StocktakingItemStatusBadge({ status }) {

    return (

        <Badge color={itemStatusColor[status] || "gray"}>

            {itemStatusLabel[status] || status}

        </Badge>

    );

}

export default StocktakingItemStatusBadge;
