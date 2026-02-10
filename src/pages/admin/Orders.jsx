import React, { useState, useEffect } from 'react';
import * as Icon from "@phosphor-icons/react";
import AdminLayout from '../../components/Admin/AdminLayout';
import axios from 'axios';
import { toast } from 'react-toastify';
import useCurrencyStore from '../../store/currencyStore';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const { formatPrice } = useCurrencyStore();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/api/payment/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to fetch orders');
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, orderStatus, paymentStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${BASE_URL}/api/payment/orders/${orderId}`,
                { 
                    orderStatus, 
                    paymentStatus,
                    trackingNumber: selectedOrder?.trackingNumber,
                    trackingUrl: selectedOrder?.trackingUrl,
                    returnStatus: selectedOrder?.returnStatus,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Order status updated successfully');
            fetchOrders();
            setShowDetails(false);
        } catch (error) {
            console.error('Error updating order:', error);
            toast.error('Failed to update order status');
        }
    };

    const viewOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowDetails(true);
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                        <p>Loading orders...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="orders-content">
                <div className="heading4 mb-6">Orders Management</div>

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow-sm border border-line overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-surface">
                                <tr className="border-b border-line">
                                    <th className="text-left py-4 px-4 text-button">Order #</th>
                                    <th className="text-left py-4 px-4 text-button">Customer</th>
                                    <th className="text-left py-4 px-4 text-button">Total</th>
                                    <th className="text-left py-4 px-4 text-button">Payment</th>
                                    <th className="text-left py-4 px-4 text-button">Order Status</th>
                                    <th className="text-left py-4 px-4 text-button">Date</th>
                                    <th className="text-right py-4 px-4 text-button">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length > 0 ? (
                                    orders.map((order) => (
                                        <tr key={order._id} className="border-b border-line hover:bg-surface">
                                            <td className="py-4 px-4">
                                                <div className="text-button">{order.orderNumber}</div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="text-button">{order.customerInfo.firstName} {order.customerInfo.lastName}</div>
                                                <div className="text-xs text-secondary">{order.customerInfo.email}</div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="text-button">{formatPrice(order.total)}</div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                                                    order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                                                    'bg-orange-100 text-orange-800'
                                                }`}>
                                                    {order.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                                    order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                    order.orderStatus === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                                    order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-orange-100 text-orange-800'
                                                }`}>
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="text-xs">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs text-secondary">
                                                    {new Date(order.createdAt).toLocaleTimeString()}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-end">
                                                    <button
                                                        onClick={() => viewOrderDetails(order)}
                                                        className="p-2 hover:bg-surface rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Icon.Eye size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-12 text-center text-secondary">
                                            No orders yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {showDetails && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-line flex items-center justify-between">
                            <div className="heading6">Order Details - {selectedOrder.orderNumber}</div>
                            <button
                                onClick={() => setShowDetails(false)}
                                className="p-2 hover:bg-surface rounded-lg"
                            >
                                <Icon.X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Customer Info */}
                            <div className="mb-6">
                                <div className="text-button mb-3">Customer Information</div>
                                <div className="grid grid-cols-2 gap-4 bg-surface p-4 rounded-lg">
                                    <div>
                                        <span className="text-secondary text-xs">Name:</span>
                                        <div>{selectedOrder.customerInfo.firstName} {selectedOrder.customerInfo.lastName}</div>
                                    </div>
                                    <div>
                                        <span className="text-secondary text-xs">Email:</span>
                                        <div>{selectedOrder.customerInfo.email}</div>
                                    </div>
                                    <div>
                                        <span className="text-secondary text-xs">Phone:</span>
                                        <div>{selectedOrder.customerInfo.phoneNumber}</div>
                                    </div>
                                    <div>
                                        <span className="text-secondary text-xs">Country:</span>
                                        <div>{selectedOrder.customerInfo.country}</div>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-secondary text-xs">Address:</span>
                                        <div>
                                            {selectedOrder.customerInfo.address}, {selectedOrder.customerInfo.city}, 
                                            {selectedOrder.customerInfo.state} {selectedOrder.customerInfo.postalCode}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mb-6">
                                <div className="text-button mb-3">Order Items</div>
                                <div className="border border-line rounded-lg overflow-hidden">
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4 p-4 border-b border-line last:border-b-0">
                                            <img
                                                src={item.image ? (item.image.startsWith('http') ? item.image : `${BASE_URL}${item.image}`) : '/images/product/1000x1000.png'}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <div className="text-button">{item.name}</div>
                                                <div className="text-xs text-secondary">
                                                    Size: {item.size} | Color: {item.color}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-button">{formatPrice(item.price)} × {item.quantity}</div>
                                                <div className="text-xs text-secondary">
                                                    {formatPrice(item.price * item.quantity)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="mb-6">
                                <div className="text-button mb-3">Order Summary</div>
                                <div className="bg-surface p-4 rounded-lg space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>{formatPrice(selectedOrder.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Discount:</span>
                                        <span>-{formatPrice(selectedOrder.discount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping:</span>
                                        <span>{formatPrice(selectedOrder.shipping)}</span>
                                    </div>
                                    <div className="flex justify-between text-button pt-2 border-t border-line">
                                        <span>Total:</span>
                                        <span>{formatPrice(selectedOrder.total)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Update Status */}
                            <div className="mb-6">
                                <div className="text-button mb-3">Update Status</div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-secondary mb-2 block">Order Status</label>
                                        <select
                                            value={selectedOrder.orderStatus}
                                            onChange={(e) => setSelectedOrder({...selectedOrder, orderStatus: e.target.value})}
                                            className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-black"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                            <option value="returned">Returned</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-secondary mb-2 block">Payment Status</label>
                                        <select
                                            value={selectedOrder.paymentStatus}
                                            onChange={(e) => setSelectedOrder({...selectedOrder, paymentStatus: e.target.value})}
                                            className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-black"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="paid">Paid</option>
                                            <option value="failed">Failed</option>
                                            <option value="refunded">Refunded</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-secondary mb-2 block">Tracking Number</label>
                                        <input
                                            type="text"
                                            value={selectedOrder.trackingNumber || ''}
                                            onChange={(e) => setSelectedOrder({...selectedOrder, trackingNumber: e.target.value})}
                                            placeholder="Enter tracking number"
                                            className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-secondary mb-2 block">Tracking URL</label>
                                        <input
                                            type="text"
                                            value={selectedOrder.trackingUrl || ''}
                                            onChange={(e) => setSelectedOrder({...selectedOrder, trackingUrl: e.target.value})}
                                            placeholder="Enter tracking URL"
                                            className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-black"
                                        />
                                    </div>
                                </div>
                                {selectedOrder.returnStatus && selectedOrder.returnStatus !== 'none' && (
                                    <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                                        <div className="text-button text-orange-800 mb-2">Return Request</div>
                                        <p className="text-sm text-secondary">Reason: {selectedOrder.returnReason || 'Not specified'}</p>
                                        <select
                                            value={selectedOrder.returnStatus}
                                            onChange={(e) => setSelectedOrder({...selectedOrder, returnStatus: e.target.value})}
                                            className="mt-2 px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-black"
                                        >
                                            <option value="requested">Requested</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleUpdateStatus(selectedOrder._id, selectedOrder.orderStatus, selectedOrder.paymentStatus)}
                                    className="button-main flex-1"
                                >
                                    Update Order
                                </button>
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="px-6 py-3 border border-line rounded-lg hover:bg-surface flex-1"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminOrders;
