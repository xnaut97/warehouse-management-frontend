export const MATERIAL_WAREHOUSE_CODE = "WH001";

export const PRODUCT_WAREHOUSE_CODE = "WH002";

export const filterWarehousesByCode = (warehouses, code) =>
    (warehouses ?? []).filter(
        (warehouse) =>
            warehouse.code === code &&
            warehouse.enabled !== false
    );
