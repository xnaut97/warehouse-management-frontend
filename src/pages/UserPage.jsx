import {useEffect, useState} from "react";
import {Plus} from "lucide-react";

import userApi from "../api/userApi.js";

import PageHeader from "../components/common/PageHeader.jsx";
import TableToolbar from "../components/common/TableToolbar.jsx";
import Modal from "../components/common/Modal.jsx";

import UserForm from "../components/users/UserForm.jsx";
import ResetPasswordForm from "../components/users/ResetPasswordForm.jsx";
import UserTable from "../components/users/UserTable.jsx";

import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import toast from "react-hot-toast";


function UserPage() {

    const [showForm, setShowForm] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);

    const [users, setUsers] = useState([]);

    const [resetUser, setResetUser] = useState(null);

    const [search, setSearch] = useState("");

    const [confirmUser, setConfirmUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const loadUsers = async () => {

        try {

            setLoading(true);

            const response =
                await userApi.getAllUsers();

            setUsers(response.data.data);

        } catch (error) {

            toast.error("Lỗi khi tải danh sách người dùng");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadUsers();

    }, []);


    const handleToggleStatus = (user) => {

        setConfirmUser(user);

    };

    const confirmToggleStatus = async () => {

        try {

            if (confirmUser.enabled) {

                await userApi.lockUser(confirmUser.id);

                toast.success("Đã khóa người dùng thành công");

            } else {

                await userApi.unlockUser(confirmUser.id);

                toast.success("Đã mở khóa người dùng thành công");

            }


            setConfirmUser(null);
            loadUsers();

        } catch (error) {

            toast.error("Cập nhật trạng thái người dùng thất bại");

        }

    };

    const filteredUsers = users.filter((user) => {

        const keyword = search.toLowerCase();

        return (
            user.username.toLowerCase().includes(keyword) ||
            user.fullName.toLowerCase().includes(keyword) ||
            user.email.toLowerCase().includes(keyword)
        );

    });


    return (

        <div>

            <PageHeader
                title="Người dùng"
                description="Quản lý người dùng trong hệ thống quản lý kho."
                actionLabel="Thêm người dùng"
                actionIcon={<Plus size={18}/>}
                onAction={() => {

                    setSelectedUser(null);

                    setShowForm(true);

                }}
            />


            <TableToolbar
                search={search}
                setSearch={setSearch}
            />


            <UserTable
                users={filteredUsers}
                onEdit={(user) => {

                    setSelectedUser(user);

                    setShowForm(true);

                }}
                onToggleStatus={handleToggleStatus}
                onResetPassword={(user) => {

                    setResetUser(user);

                }}
            />


            {
                showForm && (

                    <Modal
                        title={
                            selectedUser
                                ? "Chỉnh sửa người dùng"
                                : "Thêm người dùng"
                        }
                        onClose={() => setShowForm(false)}
                    >

                        <UserForm
                            user={selectedUser}
                            onCancel={() => setShowForm(false)}
                            onSuccess={() => {

                                setShowForm(false);

                                loadUsers();

                            }}
                        />

                    </Modal>

                )
            }


            {
                resetUser && (

                    <Modal
                        title="Đặt lại mật khẩu"
                        onClose={() => setResetUser(null)}
                    >

                        <ResetPasswordForm
                            user={resetUser}
                            onSuccess={() => {

                                setResetUser(null);

                                toast.success("Đặt lại mật khẩu thành công");

                            }}
                        />

                    </Modal>

                )
            }

            {
                confirmUser && (

                    <ConfirmDialog
                        title={
                            confirmUser.enabled
                                ? "Khóa người dùng?"
                                : "Mở khóa người dùng?"
                        }

                        message={
                            confirmUser.enabled
                                ? "Người dùng sẽ không thể đăng nhập vào hệ thống."
                                : "Người dùng sẽ có thể đăng nhập lại vào hệ thống."
                        }

                        confirmText={
                            confirmUser.enabled
                                ? "Khóa"
                                : "Mở khóa"
                        }

                        danger={confirmUser.enabled}

                        onCancel={() =>
                            setConfirmUser(null)
                        }

                        onConfirm={confirmToggleStatus}
                    />

                )
            }

        </div>

    );

}


export default UserPage;
