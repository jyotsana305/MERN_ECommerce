import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AdminLayout from './AdminLayout';
import PageTitle from '../components/PageTitle';
import { getSingleUserAdmin, updateUserRole, removeErrors, removeSuccess } from '../User/userSlice';
import '../AdminStyles/UpdateRole.css';

function UpdateRole() {
    const { id } = useParams();
    const [role, setRole] = useState("user");
    const { singleUser, error, success } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getSingleUserAdmin(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (singleUser && singleUser._id === id) {
            setRole(singleUser.role);
        }
    }, [singleUser, id]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
        if (success) {
            toast.success('User role updated successfully', { position: 'top-center', autoClose: 3000 });
            dispatch(removeSuccess());
            navigate('/admin/users');
        }
    }, [dispatch, error, success, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateUserRole({ id, role }));
    };

    return (
        <AdminLayout pageTitle="Update User Role">
            <PageTitle title="Admin - Update User Role" />
            <div className="page-wrapper">
                <div className="update-user-role-container">
                    <form className="update-user-role-form" onSubmit={submitHandler}>
                        <div className="form-group">
                            <label>Name</label>
                            <input value={singleUser?.name || ''} disabled />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input value={singleUser?.email || ''} disabled />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <button className="btn" type="submit">Update Role</button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}

export default UpdateRole;
