import Badge from "../common/Badge.jsx";

function MaterialBOMStatusBadge({ enabled }) {

    return (

        <Badge color={enabled ? "green" : "gray"}>

            {enabled ? "Đang áp dụng" : "Ngừng áp dụng"}

        </Badge>

    );

}

export default MaterialBOMStatusBadge;
