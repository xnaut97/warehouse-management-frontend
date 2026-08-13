import Badge from "../common/Badge.jsx";

import {
    stocktakingStatusColor,
    stocktakingStatusLabel
} from "./stocktakingLabels.js";

function StocktakingStatusBadge({ status }) {

    return (

        <Badge color={stocktakingStatusColor[status] || "gray"}>

            {stocktakingStatusLabel[status] || status}

        </Badge>

    );

}

export default StocktakingStatusBadge;
