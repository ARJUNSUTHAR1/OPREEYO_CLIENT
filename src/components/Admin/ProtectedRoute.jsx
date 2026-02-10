import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const navigate = useNavigate();
    const user = useAuthStore(state => state.user);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token || !user) {
            navigate('/login');
            return;
        }

        if (requireAdmin && user.role !== 'admin') {
            navigate('/');
            return;
        }
    }, [token, user, requireAdmin, navigate]);

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
