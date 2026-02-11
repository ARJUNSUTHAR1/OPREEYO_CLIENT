import React, { useState, useEffect } from 'react';
import * as Icon from "@phosphor-icons/react";
import AdminLayout from '../../components/Admin/AdminLayout';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminBanners = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [formData, setFormData] = useState({
        type: 'slider',
        title: '',
        subtitle: '',
        description: '',
        image: '',
        buttonText: 'Shop Now',
        buttonLink: '/shop/breadcrumb1',
        category: '',
        isActive: true,
        displayOrder: 0,
    });

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const token = localStorage.getItem('token');
            const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const response = await axios.get(`${BASE_URL}/api/banners`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBanners(response.data);
        } catch (error) {
            console.error('Error fetching banners:', error);
            toast.error('Failed to fetch banners');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 1 * 1024 * 1024) {
            toast.error('File size must be less than 1MB');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        const toastId = toast.loading('Uploading banner image...');

        try {
            const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const response = await axios.post(`${BASE_URL}/api/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data && response.data.path) {
                const imageUrl = `${BASE_URL}${response.data.path}`;
                setFormData(prev => ({ ...prev, image: imageUrl }));
                toast.dismiss(toastId);
                toast.success('Banner image uploaded successfully');
            } else {
                toast.dismiss(toastId);
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.dismiss(toastId);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to upload image';
            toast.error(errorMessage);
        } finally {
            // Reset file input
            e.target.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            if (editingBanner) {
                await axios.put(`${BASE_URL}/api/banners/${editingBanner._id}`, formData, config);
                toast.success('Banner updated successfully');
            } else {
                await axios.post(`${BASE_URL}/api/banners`, formData, config);
                toast.success('Banner created successfully');
            }

            setShowModal(false);
            setEditingBanner(null);
            setFormData({
                title: '',
                subtitle: '',
                description: '',
                image: '',
                buttonText: 'Shop Now',
                buttonLink: '/shop/breadcrumb1',
                isActive: true,
                displayOrder: 0,
            });
            fetchBanners();
        } catch (error) {
            console.error('Error saving banner:', error);
            toast.error('Failed to save banner');
        }
    };

    const handleEdit = (banner) => {
        setEditingBanner(banner);
        setFormData({
            type: banner.type || 'slider',
            title: banner.title || '',
            subtitle: banner.subtitle || '',
            description: banner.description || '',
            image: banner.image || '',
            buttonText: banner.buttonText || 'Shop Now',
            buttonLink: banner.buttonLink || '/shop/breadcrumb1',
            category: banner.category || '',
            isActive: banner.isActive !== undefined ? banner.isActive : true,
            displayOrder: banner.displayOrder || 0,
        });
        setShowModal(true);
    };

    const handleDelete = async (bannerId) => {
        if (!window.confirm('Are you sure you want to delete this banner?')) return;

        try {
            const token = localStorage.getItem('token');
            const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            await axios.delete(`${BASE_URL}/api/banners/${bannerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Banner deleted successfully');
            fetchBanners();
        } catch (error) {
            console.error('Error deleting banner:', error);
            toast.error('Failed to delete banner');
        }
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
            <div className="banners-content">
                <div className="flex items-center justify-between mb-6">
                    <div className="heading4">Banner Management</div>
                    <button
                        onClick={() => {
                            setEditingBanner(null);
                            setFormData({
                                title: '',
                                subtitle: '',
                                description: '',
                                image: '',
                                buttonText: 'Shop Now',
                                buttonLink: '/shop/breadcrumb1',
                                isActive: true,
                                displayOrder: 0,
                            });
                            setShowModal(true);
                        }}
                        className="button-main flex items-center gap-2"
                    >
                        <Icon.Plus size={20} />
                        Add Banner
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {banners.map((banner) => (
                        <div key={banner._id} className="bg-white rounded-lg shadow-sm border border-line overflow-hidden">
                            <div className="relative h-48">
                                <img
                                    src={banner.image}
                                    alt={banner.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                        banner.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                                    }`}>
                                        {banner.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-button font-bold mb-2">{banner.title}</h3>
                                {banner.subtitle && (
                                    <p className="text-sm text-secondary mb-2">{banner.subtitle}</p>
                                )}
                                {banner.description && (
                                    <p className="text-xs text-secondary mb-3 line-clamp-2">{banner.description}</p>
                                )}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-secondary">Order: {banner.displayOrder}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(banner)}
                                            className="p-2 hover:bg-surface rounded-lg"
                                        >
                                            <Icon.PencilSimple size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(banner._id)}
                                            className="p-2 hover:bg-red-100 text-red-600 rounded-lg"
                                        >
                                            <Icon.Trash size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {banners.length === 0 && (
                    <div className="text-center py-12 text-secondary">
                        No banners yet. Create your first banner!
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-line flex items-center justify-between">
                            <div className="heading6">{editingBanner ? 'Edit Banner' : 'Add Banner'}</div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-surface rounded-lg">
                                <Icon.X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-button mb-2 block">Banner Type *</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-4 py-2 border border-line rounded-lg"
                                    >
                                        <option value="slider">Slider Banner</option>
                                        <option value="navbar">Navbar Hover Banner</option>
                                    </select>
                                </div>

                                {formData.type === 'navbar' && (
                                    <div>
                                        <label className="text-button mb-2 block">Category</label>
                                        <input
                                            type="text"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-2 border border-line rounded-lg"
                                            placeholder="e.g., fashion, electronics"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="text-button mb-2 block">Title *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 border border-line rounded-lg"
                                        placeholder="Summer Sale 2024"
                                    />
                                </div>

                                <div>
                                    <label className="text-button mb-2 block">Subtitle</label>
                                    <input
                                        type="text"
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                        className="w-full px-4 py-2 border border-line rounded-lg"
                                        placeholder="Up to 50% Off"
                                    />
                                </div>

                                <div>
                                    <label className="text-button mb-2 block">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows="3"
                                        className="w-full px-4 py-2 border border-line rounded-lg"
                                        placeholder="Shop the latest collection..."
                                    />
                                </div>

                                <div>
                                    <label className="text-button mb-2 block">Banner Image *</label>
                                    {formData.image && (
                                        <div className="relative mb-3">
                                            <img src={formData.image} alt="Preview" className="w-full h-48 object-cover rounded-lg border-2 border-line" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, image: '' })}
                                                className="absolute -top-2 -right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 shadow-lg"
                                            >
                                                <Icon.X size={16} />
                                            </button>
                                        </div>
                                    )}
                                    <label className="cursor-pointer flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-line rounded-lg hover:bg-surface hover:border-black transition-all">
                                        <Icon.Image size={20} />
                                        <span className="text-button">Choose Banner Image</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-button mb-2 block">Button Text</label>
                                        <input
                                            type="text"
                                            value={formData.buttonText}
                                            onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                                            className="w-full px-4 py-2 border border-line rounded-lg"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-button mb-2 block">Button Link</label>
                                        <input
                                            type="text"
                                            value={formData.buttonLink}
                                            onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                                            className="w-full px-4 py-2 border border-line rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-button mb-2 block">Display Order</label>
                                        <input
                                            type="number"
                                            value={formData.displayOrder}
                                            onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 border border-line rounded-lg"
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.isActive}
                                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-button">Active</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <button type="submit" className="button-main flex-1">
                                    {editingBanner ? 'Update Banner' : 'Create Banner'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3 border border-line rounded-lg hover:bg-surface flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminBanners;
