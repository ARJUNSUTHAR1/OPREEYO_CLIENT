import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Icon from "@phosphor-icons/react";
import AdminLayout from '../../components/Admin/AdminLayout';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        type: '',
        gender: 'unisex',
        description: '',
        price: '',
        originPrice: '',
        currency: 'USD',
        new: false,
        sale: false,
    });
    const [thumbImage, setThumbImage] = useState('');
    const [hoverImage, setHoverImage] = useState('');
    const [extraImages, setExtraImages] = useState([]);
    const [variations, setVariations] = useState([
        { size: 'S', color: 'Black', stock: 0, image: '' }
    ]);

    useEffect(() => {
        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const response = await axios.get(`${BASE_URL}/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const product = response.data;
            setFormData({
                name: product.name || '',
                category: product.category || '',
                type: product.type || '',
                gender: product.gender || 'unisex',
                description: product.description || '',
                price: product.price || '',
                originPrice: product.originPrice || '',
                currency: product.currency || 'USD',
                new: product.new || false,
                sale: product.sale || false,
            });
            setThumbImage(product.thumbImage || '');
            setHoverImage(product.hoverImage || '');
            setExtraImages(product.extraImages || []);
            setVariations(product.variation || [{ size: 'S', color: 'Black', stock: 0, image: '' }]);
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Failed to load product');
        } finally {
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

    const handleImageUpload = async (e, type, index = null) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 1 * 1024 * 1024) {
            toast.error('File size must be less than 1MB');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        const toastId = toast.loading('Uploading image...');

        try {
            const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const response = await axios.post(`${BASE_URL}/api/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data && response.data.path) {
                const imageUrl = `${BASE_URL}${response.data.path}`;

                if (type === 'thumb') {
                    setThumbImage(imageUrl);
                } else if (type === 'hover') {
                    setHoverImage(imageUrl);
                } else if (type === 'extra') {
                    setExtraImages(prev => [...prev, imageUrl]);
                } else if (type === 'variation' && index !== null) {
                    const newVariations = [...variations];
                    newVariations[index].image = imageUrl;
                    setVariations(newVariations);
                }

                toast.dismiss(toastId);
                toast.success('Image uploaded successfully');
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

    const handleImageDelete = async (imageUrl, type, index = null) => {
        try {
            // Extract filename from URL
            const filename = imageUrl.split('/').pop();
            
            // Delete from server
            const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            await axios.delete(`${BASE_URL}/api/upload/${filename}`);
            
            // Update state based on type
            if (type === 'thumb') {
                setThumbImage('');
            } else if (type === 'hover') {
                setHoverImage('');
            } else if (type === 'extra') {
                setExtraImages(prev => prev.filter(img => img !== imageUrl));
            } else if (type === 'variation' && index !== null) {
                const newVariations = [...variations];
                newVariations[index].image = '';
                setVariations(newVariations);
            }
            
            toast.success('Image deleted successfully');
        } catch (error) {
            console.error('Error deleting image:', error);
            toast.error('Failed to delete image');
        }
    };


    const handleVariationChange = (index, field, value) => {
        const newVariations = [...variations];
        newVariations[index][field] = value;
        setVariations(newVariations);
    };

    const addVariation = () => {
        setVariations([...variations, { size: 'M', color: 'Black', stock: 0, image: '' }]);
    };

    const removeVariation = (index) => {
        if (variations.length > 1) {
            setVariations(variations.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                originPrice: parseFloat(formData.originPrice) || parseFloat(formData.price),
                thumbImage: thumbImage,
                hoverImage: hoverImage,
                extraImages: extraImages,
                variation: variations.map(v => ({
                    ...v,
                    stock: parseInt(v.stock)
                }))
            };

            const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            if (isEditMode) {
                await axios.put(`${BASE_URL}/api/products/${id}`, productData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Product updated successfully');
            } else {
                await axios.post(`${BASE_URL}/api/products`, productData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Product added successfully');
            }

            navigate('/admin/products');
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} product`);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                        <p>Loading product...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="add-product-content">
                <div className="heading4 mb-6">{isEditMode ? 'Edit Product' : 'Add New Product'}</div>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-line p-6">
                    {/* Basic Information */}
                    <div className="mb-6">
                        <div className="heading6 mb-4">Basic Information</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-button mb-2 block">Product Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-black"
                                    placeholder="Enter product name"
                                />
                            </div>

                            <div>
                                <label className="text-button mb-2 block">Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-black"
                                >
                                    <option value="">Select Category</option>
                                    <option value="t-shirt">T-Shirt</option>
                                    <option value="dress">Dress</option>
                                    <option value="top">Top</option>
                                    <option value="swimwear">Swimwear</option>
                                    <option value="shirt">Shirt</option>
                                    <option value="accessories">Accessories</option>
                                    <option value="sets">Sets</option>
                                    <option value="underwear">Underwear</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-button mb-2 block">Currency *</label>
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-black"
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="INR">INR (₹)</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-button mb-2 block">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-black"
                                >
                                    <option value="unisex">Unisex</option>
                                    <option value="men">Men</option>
                                    <option value="women">Women</option>
                                </select>
                            </div>

                            <div className="flex gap-4 items-center">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="new"
                                        checked={formData.new}
                                        onChange={handleInputChange}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-button">New Arrival</span>
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="sale"
                                        checked={formData.sale}
                                        onChange={handleInputChange}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-button">On Sale</span>
                                </label>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="text-button mb-2 block">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-black"
                                placeholder="Enter product description"
                            />
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="mb-6">
                        <div className="heading6 mb-4">Pricing</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-button mb-2 block">Price *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-black"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="text-button mb-2 block">Original Price</label>
                                <input
                                    type="number"
                                    name="originPrice"
                                    value={formData.originPrice}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-black"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Product Images */}
                    <div className="mb-6">
                        <div className="heading6 mb-4">Product Images</div>
                        
                        {/* Thumbnail Image */}
                        <div className="mb-4">
                            <label className="text-button mb-2 block">Thumbnail Image (Main Product Image)</label>
                            <div className="border-2 border-dashed border-line rounded-lg p-6">
                                {thumbImage ? (
                                    <div className="relative inline-block">
                                        <img
                                            src={thumbImage}
                                            alt="Thumbnail"
                                            className="w-48 h-48 object-cover rounded-lg border-2 border-line"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleImageDelete(thumbImage, 'thumb')}
                                            className="absolute -top-2 -right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 shadow-lg"
                                        >
                                            <Icon.X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center justify-center">
                                        <Icon.UploadSimple size={48} className="text-secondary mb-2" />
                                        <span className="text-button mb-1">Upload Thumbnail Image</span>
                                        <span className="caption1 text-secondary">Main product image (max 1MB)</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 'thumb')}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Hover Image */}
                        <div className="mb-4">
                            <label className="text-button mb-2 block">Hover Image (Shown on Card Hover)</label>
                            <div className="border-2 border-dashed border-line rounded-lg p-6">
                                {hoverImage ? (
                                    <div className="relative inline-block">
                                        <img
                                            src={hoverImage}
                                            alt="Hover"
                                            className="w-48 h-48 object-cover rounded-lg border-2 border-line"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleImageDelete(hoverImage, 'hover')}
                                            className="absolute -top-2 -right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 shadow-lg"
                                        >
                                            <Icon.X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center justify-center">
                                        <Icon.UploadSimple size={48} className="text-secondary mb-2" />
                                        <span className="text-button mb-1">Upload Hover Image</span>
                                        <span className="caption1 text-secondary">Displayed when user hovers over product card</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 'hover')}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Extra Images */}
                        <div>
                            <label className="text-button mb-2 block">Extra Images (Product Page Gallery)</label>
                            <div className="border-2 border-dashed border-line rounded-lg p-6">
                                <label className="cursor-pointer flex flex-col items-center justify-center">
                                    <Icon.UploadSimple size={48} className="text-secondary mb-2" />
                                    <span className="text-button mb-1">Upload Extra Images</span>
                                    <span className="caption1 text-secondary">Additional images for product detail page</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, 'extra')}
                                        className="hidden"
                                    />
                                </label>

                                {extraImages.length > 0 && (
                                    <div className="grid grid-cols-4 gap-4 mt-4">
                                        {extraImages.map((image, imgIndex) => (
                                            <div key={`extra-${imgIndex}`} className="relative">
                                                <img
                                                    src={image}
                                                    alt={`Extra ${imgIndex + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg border-2 border-line"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleImageDelete(image, 'extra')}
                                                    className="absolute -top-2 -right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 shadow-lg"
                                                >
                                                    <Icon.X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Variations */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="heading6">Variations</div>
                            <button
                                type="button"
                                onClick={addVariation}
                                className="button-main py-2 px-4 flex items-center gap-2"
                            >
                                <Icon.Plus size={20} />
                                Add Variation
                            </button>
                        </div>

                        {variations.map((variation, index) => (
                            <div key={`variation-${index}`} className="border-2 border-line rounded-lg p-6 mb-4 bg-surface hover:border-black transition-all">
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-line">
                                    <span className="text-button font-semibold">Variation {index + 1}</span>
                                    {variations.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeVariation(index)}
                                            className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Icon.Trash size={20} />
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="text-button mb-2 block">Size</label>
                                        <input
                                            type="text"
                                            value={variation.size}
                                            onChange={(e) => handleVariationChange(index, 'size', e.target.value)}
                                            className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-black"
                                            placeholder="e.g., S, M, L"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-button mb-2 block">Color</label>
                                        <input
                                            type="text"
                                            value={variation.color}
                                            onChange={(e) => handleVariationChange(index, 'color', e.target.value)}
                                            className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-black"
                                            placeholder="e.g., Black, White"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-button mb-2 block">Stock</label>
                                        <input
                                            type="number"
                                            value={variation.stock}
                                            onChange={(e) => handleVariationChange(index, 'stock', e.target.value)}
                                            min="0"
                                            className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-black"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <label className="text-button mb-2 block">Variation Image</label>
                                    {variation.image ? (
                                        <div className="relative inline-block">
                                            <img
                                                src={variation.image}
                                                alt="Variation"
                                                className="w-32 h-32 object-cover rounded-lg border-2 border-line"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleVariationChange(index, 'image', '')}
                                                className="absolute -top-2 -right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 shadow-lg"
                                            >
                                                <Icon.X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-line rounded-lg hover:bg-surface hover:border-black transition-all">
                                            <Icon.Image size={20} />
                                            <span className="text-button">Upload Image</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, 'variation', index)}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="button-main flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    {isEditMode ? 'Updating Product...' : 'Adding Product...'}
                                </>
                            ) : (
                                <>
                                    <Icon.Check size={20} />
                                    {isEditMode ? 'Update Product' : 'Add Product'}
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/products')}
                            className="px-6 py-3 border border-line rounded-lg hover:bg-surface"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AddProduct;
