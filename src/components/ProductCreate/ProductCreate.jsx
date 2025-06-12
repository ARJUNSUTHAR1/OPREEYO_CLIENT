import React, { useEffect, useState } from 'react';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import axios from 'axios';
import { toast } from 'react-toastify';
import useProductStore from '../../store/productStore'; // adjust path if needed


const fixedSizes = ["S", "M", "L", "XL"];
const fixedColors = [
    { name: "Red", code: "#DB4444" },
    { name: "Yellow", code: "#ECB018" },
    { name: "Green", code: "#007C55" }
];

const ProductCreateForm = ({ activeTab, setActiveTab, editingProduct, setEditingProduct }) => {
    const [form, setForm] = useState({
        name: '',
        category: '',
        gender: '',
        price: '',
        originPrice: '',
        new: false,
        sale: false,
        description: '',
        thumbImage: [],
        variation: []
    });

    useEffect(() => {
        if (editingProduct) {
            setForm(editingProduct);
        }
    }, [editingProduct]);

    const addProduct = useProductStore(state => state.addProduct);
    const { products, setProducts } = useProductStore()

    const [newVariant, setNewVariant] = useState({ size: '', color: '', stock: '', image: '' });

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/upload`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );
            return res.data.url; // returned by backend: /uploads/image.jpg
        } catch (err) {
            toast.error("Image upload failed");
            return '';
        }
    };


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleVariantChange = (e) => {
        const { name, value } = e.target;
        setNewVariant(prev => ({ ...prev, [name]: value }));
    };

    const addVariant = () => {
        if (!newVariant.size || !newVariant.color || !newVariant.stock || !newVariant.image) {
            toast.error("add variant")
            return;
        }

        setForm(prev => ({
            ...prev,
            variation: [...prev.variation, newVariant]
        }));
        setNewVariant({ size: '', color: '', stock: '', image: '' });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const payload = {
                ...form,
                price: Number(form.price) || 0,
                originPrice: Number(form.originPrice) || 0,
                thumbImage: form.thumbImage || [], // ✅ This must stay an actual array, not string
                variation: form.variation.map(v => ({
                    ...v,
                    stock: Number(v.stock)  // ✅ Convert to number
                }))
            };

            if (editingProduct) {
                // 🔁 Edit mode
                await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/products/${editingProduct._id}`, payload);
                toast.success("Product updated successfully");
                const updatedList = products.map((p) =>
                    p._id === updatedProduct._id ? res.data.updatedProduct : p
                );
                setProducts(updatedList);
            } else {
                // ➕ Create mode
                const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/products`, payload);
                toast.success("Product created successfully");
                addProduct(res.data); // assuming res.data returns the new product
            }

            setForm({
                name: '', category: '', gender: '',
                price: '', originPrice: '', new: false, sale: false, description: '', thumbImage: [], variation: []
            });

            setEditingProduct(null);
            setActiveTab("products");

        } catch (err) {
            toast.error(err?.response?.data?.message || 'Creation failed');
        }
    };

    return (
        <div className={`tab_address text-content w-full p-7 border border-[#d1cbcb] rounded-xl ${activeTab === 'product-create' ? 'block' : 'hidden'} icon`}>
            <form onSubmit={handleSubmit}>
                <button type='button' className={`tab_btn flex items-center justify-between w-full pb-1.5 border-b border-[#d1cbcb] active`}>
                    <strong className="heading6">{editingProduct ? 'Update Product' : 'Create Product'}</strong>
                    <Icon.CaretDown className='text-2xl ic_down duration-300' />
                </button>

                <div className={`form_address block icon`}>
                    <div className='grid sm:grid-cols-2 gap-4 gap-y-5 mt-5'>
                        {['name', 'price', 'originPrice'].map(field => (
                            <div key={field} className="field">
                                <label htmlFor={field} className='caption1 capitalize'>{field} *</label>
                                <input
                                    className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg"
                                    id={field}
                                    name={field}
                                    type="text"
                                    value={form[field]}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ))}

                        <div className="field">
                            <label className='caption1 capitalize'>Category</label>
                            <select name="category" value={form.category} onChange={handleChange} className="border-[#d1cbcb] border mt-2 px-4 py-3 w-full rounded-lg">
                                <option value="">Select Category</option>
                                <option value="fashion">Fashion</option>
                                <option value="electronics">Electronics</option>
                                <option value="home">Home</option>
                                <option value="beauty">Beauty</option>
                                <option value="sports">Sports</option>
                            </select>
                        </div>

                        <div className="field">
                            <label className='caption1 capitalize'>Gender</label>
                            <select name="gender" value={form.gender} onChange={handleChange} className="border-[#d1cbcb] border mt-2 px-4 py-3 w-full rounded-lg">
                                <option value="">Select Gender</option>
                                <option value="men">Men</option>
                                <option value="women">Women</option>
                                <option value="kids">Kids</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="field">
                            <label className='caption1 capitalize'>Card Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const uploadedUrl = await uploadImage(file);
                                        if (uploadedUrl) {
                                            setForm(prev => ({
                                                ...prev,
                                                thumbImage: [...prev.thumbImage, uploadedUrl]  // ✅ This ensures it's an array
                                            }));
                                        }
                                    }
                                }}
                                className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg"
                                required
                            />
                        </div>

                        <div className="field">
                            <label className='caption1 capitalize'>Card Hover Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const uploadedUrl = await uploadImage(file);
                                        if (uploadedUrl) {
                                            setForm(prev => ({
                                                ...prev,
                                                thumbImage: [...prev.thumbImage, uploadedUrl]  // ✅ This ensures it's an array
                                            }));
                                        }
                                    }
                                }}
                                className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg"
                                required
                            />
                        </div>

                        <div className="col-span-2">
                            <h4 className="heading6 mb-2">Add variation</h4>
                            <div className="grid grid-cols-4 gap-4">
                                <select name="size" value={newVariant.size} onChange={handleVariantChange} className="border-[#d1cbcb] border px-3 py-2 rounded-lg">
                                    <option value="">Select Size</option>
                                    {fixedSizes.map(size => <option key={size} value={size}>{size}</option>)}
                                </select>
                                <select name="color" value={newVariant.color} onChange={handleVariantChange} className="border-[#d1cbcb] border px-3 py-2 rounded-lg">
                                    <option value="">Select Color</option>
                                    {fixedColors.map(color => <option key={color.name} value={color.name}>{color.name}</option>)}
                                </select>
                                <input type="text" name="stock" placeholder="Stock" value={newVariant.stock} onChange={handleVariantChange} className="border-[#d1cbcb] px-3 py-2 rounded-lg" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const uploadedUrl = await uploadImage(file);
                                            if (uploadedUrl) {
                                                setNewVariant(prev => ({ ...prev, image: uploadedUrl }));
                                            }
                                        }
                                    }}
                                    className="border-[#d1cbcb] px-3 py-2 rounded-lg"
                                />
                            </div>
                            <button type="button" onClick={addVariant} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg">Add Variation</button>
                            <ul className="mt-4 list-disc ml-5">
                                {form.variation?.map((v, i) => (
                                    <li key={i}>{v.size} - {v.color} - Stock: {v.stock}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="field">
                            <label className='caption1 capitalize'>Description</label>
                            <textarea className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" name="description" value={form.description} onChange={handleChange} required />
                        </div>
                        <div className='flex gap-5'>
                            <div className="field flex items-center gap-2">
                                <label className='caption1 capitalize'>New</label>
                                <input type="checkbox" name="new" checked={form.new} onChange={handleChange} />
                            </div>
                            <div className="field flex items-center gap-2">
                                <label className='caption1 capitalize'>Sale</label>
                                <input type="checkbox" name="sale" checked={form.sale} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="block-button lg:mt-10 mt-6">
                    <button type="submit" className="button-main">{editingProduct ? 'Update Product' : 'Create Product'}</button>
                </div>
            </form>
        </div>
    );
};

export default ProductCreateForm;
