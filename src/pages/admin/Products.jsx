import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Icon from "@phosphor-icons/react";
import AdminLayout from '../../components/Admin/AdminLayout';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to fetch products');
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Product deleted successfully');
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product');
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                        <p>Loading products...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="products-content">
                <div className="flex items-center justify-between mb-6">
                    <div className="heading4">Products Management</div>
                    <Link to="/admin/products/add" className="button-main flex items-center gap-2">
                        <Icon.Plus size={20} />
                        Add New Product
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-line mb-6">
                    <div className="relative">
                        <Icon.MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={20} />
                        <input
                            type="text"
                            placeholder="Search products by name or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-line rounded-lg focus:outline-none focus:border-black"
                        />
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-lg shadow-sm border border-line overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-surface">
                                <tr className="border-b border-line">
                                    <th className="text-left py-4 px-4 text-button">Image</th>
                                    <th className="text-left py-4 px-4 text-button">Name</th>
                                    <th className="text-left py-4 px-4 text-button">Category</th>
                                    <th className="text-left py-4 px-4 text-button">Price</th>
                                    <th className="text-left py-4 px-4 text-button">Stock</th>
                                    <th className="text-left py-4 px-4 text-button">Status</th>
                                    <th className="text-right py-4 px-4 text-button">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <tr key={product._id} className="border-b border-line hover:bg-surface">
                                            <td className="py-4 px-4">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface">
                                                    {product.thumbImage && product.thumbImage[0] ? (
                                                        <img
                                                            src={product.thumbImage[0]}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Icon.Image size={24} className="text-secondary" />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="text-button">{product.name}</div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="px-2 py-1 bg-surface rounded text-xs">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="text-button">${product.price}</div>
                                                {product.originPrice && product.originPrice > product.price && (
                                                    <div className="text-xs text-secondary line-through">
                                                        ${product.originPrice}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-4 px-4">
                                                {product.variation && product.variation.length > 0 ? (
                                                    <div className="text-xs">
                                                        {product.variation.reduce((sum, v) => sum + (v.stock || 0), 0)} units
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-secondary">N/A</div>
                                                )}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex gap-1">
                                                    {product.new && (
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                                            New
                                                        </span>
                                                    )}
                                                    {product.sale && (
                                                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                                                            Sale
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        to={`/admin/products/edit/${product._id}`}
                                                        className="p-2 hover:bg-surface rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Icon.PencilSimple size={20} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product._id)}
                                                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Icon.Trash size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-12 text-center text-secondary">
                                            {searchTerm ? 'No products found matching your search' : 'No products yet. Add your first product!'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-6 flex items-center justify-between text-secondary">
                    <div>Total Products: {filteredProducts.length}</div>
                    <div>Showing {filteredProducts.length} of {products.length} products</div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminProducts;
