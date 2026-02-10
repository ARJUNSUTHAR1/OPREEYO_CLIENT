import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Icon from "@phosphor-icons/react";
import AdminLayout from '../../components/Admin/AdminLayout';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            // Fetch products
            const productsRes = await axios.get('http://localhost:5000/api/products');
            
            // Fetch orders
            const ordersRes = await axios.get('http://localhost:5000/api/payment/orders', config);

            const orders = ordersRes.data;
            const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
            const pendingOrders = orders.filter(order => order.orderStatus === 'pending').length;

            setStats({
                totalProducts: productsRes.data.length,
                totalOrders: orders.length,
                totalRevenue: totalRevenue,
                pendingOrders: pendingOrders,
            });

            setRecentOrders(orders.slice(0, 5));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                        <p>Loading dashboard...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="dashboard-content">
                <div className="heading4 mb-6">Dashboard Overview</div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="stat-card bg-white p-6 rounded-lg shadow-sm border border-line">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="caption1 text-secondary mb-2">Total Products</div>
                                <div className="heading5">{stats.totalProducts}</div>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Icon.Package className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="stat-card bg-white p-6 rounded-lg shadow-sm border border-line">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="caption1 text-secondary mb-2">Total Orders</div>
                                <div className="heading5">{stats.totalOrders}</div>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Icon.ShoppingCart className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="stat-card bg-white p-6 rounded-lg shadow-sm border border-line">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="caption1 text-secondary mb-2">Total Revenue</div>
                                <div className="heading5">${stats.totalRevenue.toFixed(2)}</div>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <Icon.CurrencyDollar className="text-purple-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="stat-card bg-white p-6 rounded-lg shadow-sm border border-line">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="caption1 text-secondary mb-2">Pending Orders</div>
                                <div className="heading5">{stats.pendingOrders}</div>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <Icon.Clock className="text-orange-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="recent-orders bg-white p-6 rounded-lg shadow-sm border border-line">
                    <div className="flex items-center justify-between mb-4">
                        <div className="heading6">Recent Orders</div>
                        <Link to="/admin/orders" className="text-button hover:underline">View All</Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-line">
                                    <th className="text-left py-3 px-2 text-button">Order #</th>
                                    <th className="text-left py-3 px-2 text-button">Customer</th>
                                    <th className="text-left py-3 px-2 text-button">Total</th>
                                    <th className="text-left py-3 px-2 text-button">Status</th>
                                    <th className="text-left py-3 px-2 text-button">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order) => (
                                        <tr key={order._id} className="border-b border-line hover:bg-surface">
                                            <td className="py-3 px-2">
                                                <Link to={`/admin/orders/${order._id}`} className="text-blue-600 hover:underline">
                                                    {order.orderNumber}
                                                </Link>
                                            </td>
                                            <td className="py-3 px-2">{order.customerInfo.email}</td>
                                            <td className="py-3 px-2">${order.total.toFixed(2)}</td>
                                            <td className="py-3 px-2">
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                                    order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                    order.orderStatus === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-orange-100 text-orange-800'
                                                }`}>
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-6 text-center text-secondary">
                                            No orders yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link to="/admin/products/add" className="bg-black text-white p-6 rounded-lg hover:bg-gray-800 transition-colors">
                        <Icon.Plus size={32} className="mb-2" />
                        <div className="text-button">Add New Product</div>
                    </Link>
                    <Link to="/admin/products" className="bg-white p-6 rounded-lg border border-line hover:bg-surface transition-colors">
                        <Icon.List size={32} className="mb-2" />
                        <div className="text-button">Manage Products</div>
                    </Link>
                    <Link to="/admin/orders" className="bg-white p-6 rounded-lg border border-line hover:bg-surface transition-colors">
                        <Icon.ShoppingBag size={32} className="mb-2" />
                        <div className="text-button">View Orders</div>
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
