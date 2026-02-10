import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import * as Icon from "@phosphor-icons/react";

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        // Check if user is logged in and is admin
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== 'admin') {
            alert('Access denied. Admin only.');
            navigate('/');
            return;
        }

        setUser(parsedUser);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const menuItems = [
        { path: '/admin/dashboard', icon: Icon.ChartBar, label: 'Dashboard' },
        { path: '/admin/products', icon: Icon.Package, label: 'Products' },
        { path: '/admin/orders', icon: Icon.ShoppingCart, label: 'Orders' },
        { path: '/admin/inventory', icon: Icon.Archive, label: 'Inventory' },
        { path: '/admin/banners', icon: Icon.Image, label: 'Banners' },
        { path: '/admin/coupons', icon: Icon.Ticket, label: 'Coupons' },
    ];

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-layout flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className={`bg-black text-white transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className="p-4 flex items-center justify-between border-b border-gray-700 flex-shrink-0">
                    {sidebarOpen && <div className="heading6">Admin Panel</div>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white hover:text-gray-300">
                        {sidebarOpen ? <Icon.X size={24} /> : <Icon.List size={24} />}
                    </button>
                </div>

                <nav className="p-4 flex-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors ${
                                    isActive ? 'bg-white text-black' : 'hover:bg-gray-800'
                                }`}
                            >
                                <IconComponent size={24} className="flex-shrink-0" />
                                {sidebarOpen && <span className="text-button">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-700 flex-shrink-0">
                    <Link
                        to="/"
                        className="flex items-center gap-3 p-3 rounded-lg mb-2 hover:bg-gray-800 transition-colors"
                    >
                        <Icon.House size={24} className="flex-shrink-0" />
                        {sidebarOpen && <span className="text-button">Visit Store</span>}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 p-3 rounded-lg w-full hover:bg-gray-800 transition-colors text-left"
                    >
                        <Icon.SignOut size={24} className="flex-shrink-0" />
                        {sidebarOpen && <span className="text-button">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white border-b border-line p-4">
                    <div className="flex items-center justify-between">
                        <div className="heading6">Welcome, {user.username}</div>
                        <div className="flex items-center gap-4">
                            <span className="text-secondary">{user.email}</span>
                            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
