import React, { useState, useEffect } from 'react';
import * as Icon from "@phosphor-icons/react";
import AdminLayout from '../../components/Admin/AdminLayout';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminInventory = () => {
    const [activeTab, setActiveTab] = useState('low-stock');
    const [lowStockItems, setLowStockItems] = useState([]);
    const [outOfStockItems, setOutOfStockItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [threshold, setThreshold] = useState(10);
    const [bulkUpdate, setBulkUpdate] = useState({});

    useEffect(() => {
        fetchInventoryData();
    }, [threshold]);

    const fetchInventoryData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [lowStock, outOfStock] = await Promise.all([
                axios.get(`http://localhost:5000/api/inventory/low-stock?threshold=${threshold}`, config),
                axios.get('http://localhost:5000/api/inventory/out-of-stock', config),
            ]);

            setLowStockItems(lowStock.data);
            setOutOfStockItems(outOfStock.data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
            toast.error('Failed to fetch inventory data');
        } finally {
            setLoading(false);
        }
    };

    const handleStockUpdate = (productId, size, color, newStock) => {
        setBulkUpdate(prev => ({
            ...prev,
            [`${productId}-${size}-${color}`]: {
                productId,
                size,
                color,
                stock: parseInt(newStock),
            }
        }));
    };

    const submitBulkUpdate = async () => {
        const updates = Object.values(bulkUpdate);
        
        if (updates.length === 0) {
            toast.info('No updates to submit');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/api/inventory/bulk-update',
                { updates },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const successCount = response.data.results.filter(r => r.success).length;
            toast.success(`Successfully updated ${successCount} items`);
            
            setBulkUpdate({});
            fetchInventoryData();
        } catch (error) {
            console.error('Error updating stock:', error);
            toast.error('Failed to update stock');
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                        <p>Loading inventory...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="inventory-content">
                <div className="flex items-center justify-between mb-6">
                    <div className="heading4">Inventory Management</div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label className="text-button">Low Stock Threshold:</label>
                            <input
                                type="number"
                                value={threshold}
                                onChange={(e) => setThreshold(parseInt(e.target.value) || 10)}
                                className="w-20 px-3 py-2 border border-line rounded-lg"
                                min="1"
                            />
                        </div>
                        <button
                            onClick={submitBulkUpdate}
                            className="button-main flex items-center gap-2"
                            disabled={Object.keys(bulkUpdate).length === 0}
                        >
                            <Icon.FloppyDisk size={20} />
                            Save Changes ({Object.keys(bulkUpdate).length})
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-line">
                    <button
                        onClick={() => setActiveTab('low-stock')}
                        className={`px-4 py-3 text-button border-b-2 transition-colors ${
                            activeTab === 'low-stock'
                                ? 'border-black text-black'
                                : 'border-transparent text-secondary hover:text-black'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Icon.Warning size={20} />
                            Low Stock ({lowStockItems.length})
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('out-of-stock')}
                        className={`px-4 py-3 text-button border-b-2 transition-colors ${
                            activeTab === 'out-of-stock'
                                ? 'border-black text-black'
                                : 'border-transparent text-secondary hover:text-black'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Icon.XCircle size={20} />
                            Out of Stock ({outOfStockItems.length})
                        </div>
                    </button>
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg shadow-sm border border-line overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-surface">
                                <tr className="border-b border-line">
                                    <th className="text-left py-4 px-4 text-button">Product</th>
                                    <th className="text-left py-4 px-4 text-button">Size</th>
                                    <th className="text-left py-4 px-4 text-button">Color</th>
                                    <th className="text-left py-4 px-4 text-button">Current Stock</th>
                                    <th className="text-left py-4 px-4 text-button">Update Stock</th>
                                    <th className="text-left py-4 px-4 text-button">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeTab === 'low-stock' && lowStockItems.length > 0 ? (
                                    lowStockItems.map((item, index) => (
                                        <tr key={index} className="border-b border-line hover:bg-surface">
                                            <td className="py-4 px-4">
                                                <div className="text-button">{item.productName}</div>
                                                <div className="text-xs text-secondary">ID: {item.productId}</div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="px-2 py-1 bg-surface rounded text-xs">
                                                    {item.size}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="px-2 py-1 bg-surface rounded text-xs">
                                                    {item.color}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    item.stock <= 5 ? 'bg-red-100 text-red-800' :
                                                    item.stock <= threshold ? 'bg-orange-100 text-orange-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                    {item.stock} units
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <input
                                                    type="number"
                                                    defaultValue={item.stock}
                                                    onChange={(e) => handleStockUpdate(
                                                        item.productId,
                                                        item.size,
                                                        item.color,
                                                        e.target.value
                                                    )}
                                                    className="w-24 px-3 py-1 border border-line rounded"
                                                    min="0"
                                                />
                                            </td>
                                            <td className="py-4 px-4">
                                                <Icon.Warning className="text-orange-600" size={20} />
                                            </td>
                                        </tr>
                                    ))
                                ) : activeTab === 'out-of-stock' && outOfStockItems.length > 0 ? (
                                    outOfStockItems.map((item, index) => (
                                        <tr key={index} className="border-b border-line hover:bg-surface">
                                            <td className="py-4 px-4">
                                                <div className="text-button">{item.productName}</div>
                                                <div className="text-xs text-secondary">ID: {item.productId}</div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="px-2 py-1 bg-surface rounded text-xs">
                                                    {item.size}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="px-2 py-1 bg-surface rounded text-xs">
                                                    {item.color}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                                                    0 units
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <input
                                                    type="number"
                                                    defaultValue={0}
                                                    onChange={(e) => handleStockUpdate(
                                                        item.productId,
                                                        item.size,
                                                        item.color,
                                                        e.target.value
                                                    )}
                                                    className="w-24 px-3 py-1 border border-line rounded"
                                                    min="0"
                                                />
                                            </td>
                                            <td className="py-4 px-4">
                                                <Icon.XCircle className="text-red-600" size={20} />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-secondary">
                                            {activeTab === 'low-stock' 
                                                ? 'No low stock items' 
                                                : 'No out of stock items'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-white p-6 rounded-lg border border-line">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-secondary text-xs mb-2">Low Stock Items</div>
                                <div className="heading5">{lowStockItems.length}</div>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <Icon.Warning className="text-orange-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-line">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-secondary text-xs mb-2">Out of Stock</div>
                                <div className="heading5">{outOfStockItems.length}</div>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <Icon.XCircle className="text-red-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-line">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-secondary text-xs mb-2">Pending Updates</div>
                                <div className="heading5">{Object.keys(bulkUpdate).length}</div>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Icon.FloppyDisk className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminInventory;
