import Badge from "../common/Badge";

function InventoryItemGroupBadge({ itemGroup }) {

    const badgeColor = {
        MATERIAL: "green",
        PRODUCT: "pink"
    };

    const label = {
        MATERIAL: "Nguyên vật liệu",
        PRODUCT: "Sản phẩm"
    };

    return (

        <Badge color={badgeColor[itemGroup] || "gray"}>

            {label[itemGroup] || itemGroup}

        </Badge>

    );

}

export default InventoryItemGroupBadge;
