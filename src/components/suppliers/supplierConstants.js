export const SUPPLIER_GROUP_LABELS = {
    SAND: "Cát",
    CEMENT: "Xi măng",
    ADDITIVE: "Phụ gia",
    PACKAGING_MATERIAL: "Vật tư đóng gói"
};

export const SUPPLIER_GROUPS = [
    "SAND",
    "CEMENT",
    "ADDITIVE",
    "PACKAGING_MATERIAL"
];

export const DEFAULT_SUPPLIER_GROUP = SUPPLIER_GROUPS[0];

export const supplierGroupLabel = (group) =>
    SUPPLIER_GROUP_LABELS[group] || group || "";
