import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminLayout from './AdminLayout';
import PageTitle from '../components/PageTitle';
import { adminUsers, deleteUserAdmin, removeErrors, removeSuccess } from '../User/userSlice';
import '../AdminStyles/UsersList.css';

function UsersList() {
    const { loading, error, users, success, message } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(adminUsers());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
        if (success) {
            toast.success(message || 'User deleted successfully', { position: 'top-center', autoClose: 3000 });
            dispatch(removeSuccess());
            dispatch(adminUsers());
        }
    }, [dispatch, error, success, message]);

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            dispatch(deleteUserAdmin(id));
        }
    };

    return (
        <AdminLayout pageTitle="Users">
            <PageTitle title="Admin - Users" />
            <div className="usersList-container">
                <h2 className="usersList-title">All Users</h2>
                {loading ? (
                    <p className="loading-message">Loading...</p>
                ) : (
                    <div className="usersList-table-container">
                        <table className="usersList-table">
                            <thead>
                                <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u._id}>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>{u.role}</td>
                                        <td>
                                            <Link to={`/admin/user/${u._id}`} className="action-icon edit-icon"><EditIcon /></Link>
                                            <button className="action-icon delete-icon" onClick={() => deleteHandler(u._id)}><DeleteIcon /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

export default UsersList;
