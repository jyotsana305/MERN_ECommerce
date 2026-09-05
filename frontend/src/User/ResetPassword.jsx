import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import '../UserStyles/Form.css';
import PageTitle from "../components/PageTitle";
import { resetPassword, removeErrors } from "./userSlice";
function ResetPassword() {
    const { success, loading, error } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { token } = useParams();

    const resetPasswordSubmit = (e) => {
        e.preventDefault();
        const data = {
            password,
            confirmPassword,
        };
        dispatch(resetPassword({ token, userData: data }));
    };

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
        if (success) {
            toast.success("Password reset successfully", { position: 'top-center', autoClose: 3000 });
            navigate("/login");
        }
    }, [dispatch, error, success, navigate]);

    return (
        <>
            <PageTitle title="Reset Password" />
            <div className="container form-container">
                <div className="form-content">
                    <form className="form" onSubmit={resetPasswordSubmit}>
                        <h2>Reset Password</h2>
                        <div className="input-group">
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your new Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button className="authBtn">Update Password</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ResetPassword;