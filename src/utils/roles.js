export const ROLE_LABELS = {
    ADMIN: "Quản trị viên",
    WAREHOUSE_MANAGER: "Quản lý kho",
    WAREHOUSE_STAFF: "Nhân viên kho",
    EXECUTIVE_BOARD: "Ban lãnh đạo",
    ACCOUNTANT: "Kế toán",
};

export const ASSIGNABLE_ROLES = [
    "ACCOUNTANT",
    "EXECUTIVE_BOARD",
];

export const DEFAULT_ROLE = ASSIGNABLE_ROLES[0];

export const roleLabel = (role) => ROLE_LABELS[role] || role;
