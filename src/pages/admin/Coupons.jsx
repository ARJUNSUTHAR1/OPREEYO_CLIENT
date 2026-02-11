import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Icon from "@phosphor-icons/react";
import AdminLayout from '../../components/Admin/AdminLayout';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minPurchase: '',
        maxDiscount: '',
        usageLimit: '',
        validFrom: '',
        validUntil: '',
        isActive: true
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const token = localStorage.getItem('token');
            const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const response = await axios.get(`${BASE_URL}/api/coupons`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCoupons(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching coupons:', error);
            toast.error('Failed to fetch coupons');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            
            const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            if (editingCoupon) {
                await axios.put(`${BASE_URL}/api/coupons/${editingCoupon._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Coupon updated successfully');
            } else {
                await axios.post(`${BASE_URL}/api/coupons`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Coupon created successfully');
            }
            
            setShowModal(false);
            setEditingCoupon(null);
            resetForm();
            fetchCoupons();
        } catch (error) {
            console.error('Error saving coupon:', error);
            toast.error(error.response?.data?.message || 'Failed to save coupon');
        }
    };

    const handleEdit = (coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minPurchase: coupon.minPurchase || '',
            maxDiscount: coupon.maxDiscount || '',
            usageLimit: coupon.usageLimit || '',
            validFrom: coupon.validFrom?.split('T')[0] || '',
            validUntil: coupon.validUntil?.split('T')[0] || '',
            isActive: coupon.isActive
        });
        setShowModal(true);
    };

    const handleDelete = async (couponId) => {
        if (!window.confirm('Are you sure you want to delete this coupon?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            await axios.delete(`${BASE_URL}/api/coupons/${couponId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Coupon deleted successfully');
            fetchCoupons();
        } catch (error) {
            console.error('Error deleting coupon:', error);
            toast.error('Failed to delete coupon');
        }
    };

    const resetForm = () => {
        setFormData({
            code: '',
            discountType: 'percentage',
            discountValue: '',
            minPurchase: '',
            maxDiscount: '',
            usageLimit: '',
            validFrom: '',
            validUntil: '',
            isActive: true
        });
    };

    const handleAddNew = () => {
        setEditingCoupon(null);
        resetForm();
        setShowModal(true);
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="coupons-content">
                <div className="flex justify-between items-center mb-6">
                    <div className="heading4">Coupons Management</div>
                    <button
                        onClick={handleAddNew}
                        className="button-main flex items-center gap-2"
                    >
                        <Icon.Plus size={20} />
                        Add New Coupon
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-line overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-surface">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Value</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Usage</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Valid Until</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                            {coupons.map((coupon) => (
                                <tr key={coupon._id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-semibold">{coupon.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap capitalize">{coupon.discountType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {coupon.usedCount} / {coupon.usageLimit || '∞'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(coupon.validUntil).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {coupon.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(coupon)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Icon.PencilSimple size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(coupon._id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Icon.Trash size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="heading5">{editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}</h2>
                                <button onClick={() => setShowModal(false)}>
                                    <Icon.X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-button mb-2 block">Coupon Code *</label>
                                        <input
                                            type="text"
                                            name="code"
                                            value={formData.code}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-black uppercase"
                                            placeholder="SUMMER2024"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-button mb-2 block">Discount Type *</label>
                                        <select
                                            name="discountType"
                                            value={formData.discountType}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-black"
                                        >
                                            <option value="percentage">Percentage</option>
                                            <option value="fixed">Fixed Amount</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-button mb-2 block">Discount Value *</label>
                                        <input
                                            type="number"
                                            name="discountValue"
                                            value={formData.discountValue}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                            step="0.01"
                                            className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-black"
                                            placeholder="10"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-button mb-2 block">Min Purchase</label>
                                        <input
                                            type="number"
                                            name="minPurchase"
                                            value={formData.minPurchase}
                                            onChange={handleInputChange}
                                            min="0"
                                            step="0.01"
                                            className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-black"
                                            placeholder="0"
                                        />
                                    </div>

                                    {formData.discountType === 'percentage' && (
                                        <div>
                                            <label className="text-button mb-2 block">Max Discount</label>
                                            <input
                                                type="number"
                                                name="maxDiscount"
                                                value={formData.maxDiscount}
                                                onChange={handleInputChange}
                                                min="0"
                                                step="0.01"
                                                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-black"
                                                placeholder="100"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-button mb-2 block">Usage Limit</label>
                                        <input
                                            type="number"
                                            name="usageLimit"
                                            value={formData.usageLimit}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-black"
                                            placeholder="Unlimited"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-button mb-2 block">Valid From *</label>
                                        <input
                                            type="date"
                                            name="validFrom"
                                            value={formData.validFrom}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-black"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-button mb-2 block">Valid Until *</label>
                                        <input
                                            type="date"
                                            name="validUntil"
                                            value={formData.validUntil}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-black"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleInputChange}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-button">Active</span>
                                    </label>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-2 border border-line rounded-lg hover:bg-surface"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="button-main"
                                    >
                                        {editingCoupon ? 'Update' : 'Create'} Coupon
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminCoupons;
