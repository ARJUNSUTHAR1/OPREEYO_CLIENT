import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TopNavOne from '../../components/Header/TopNav/TopNavOne'
import MenuOne from '../../components/Header/Menu/MenuOne'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import Footer from '../../components/Footer/Footer'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { motion } from 'framer-motion'
import ProductCreateForm from '../../components/ProductCreate/ProductCreate'
import useProductStore from '../../store/productStore'
import useAuthStore from '../../store/authStore';
import useCurrencyStore from '../../store/currencyStore';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const MyAccount = () => {
    const [activeTab, setActiveTab] = useState('dashboard')
    const [activeAddress, setActiveAddress] = useState('billing')
    const [activeOrders, setActiveOrders] = useState('all')
    const [openDetail, setOpenDetail] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null);
    const [userOrders, setUserOrders] = useState([]);
    const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
    const [ordersLoading, setOrdersLoading] = useState(false);

    const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const navigate = useNavigate()

    const { products, fetchProducts, setProducts } = useProductStore()
    const user = useAuthStore(state => state.user);
    const { formatPrice } = useCurrencyStore();

    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        logout(); // clear Zustand store
        localStorage.removeItem('token'); // clear token if stored
        toast.success('Logged out successfully');
        navigate('/login'); // or wherever you want to redirect
    };

    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        if (user && activeTab === 'orders') {
            fetchUserOrders();
        }
    }, [user, activeTab]);

    const fetchUserOrders = async () => {
        try {
            setOrdersLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/api/payment/my-orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setOrdersLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'returned': return 'bg-orange-100 text-orange-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    const handleActiveAddress = (order) => {
        setActiveAddress(prevOrder => prevOrder === order ? null : order)
    }

    const handleActiveOrders = (order) => {
        setActiveOrders(order)
    }

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const handleEdit = (product) => {
        setEditingProduct(product);
        setActiveTab("product-create"); // show the form tab
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`${BASE_URL}/api/products/${id}`);
            toast.success("Product deleted");
            const filtered = products.filter((p) => p._id !== id);
            setProducts(filtered);
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    const [showReturnModal, setShowReturnModal] = useState(false);
    const [returnReason, setReturnReason] = useState('');
    const [returningOrder, setReturningOrder] = useState(null);

    const handleRequestReturn = (order) => {
        setReturningOrder(order);
        setShowReturnModal(true);
        setReturnReason('');
    };

    const handleSubmitReturn = async () => {
        if (!returnReason.trim()) {
            toast.error('Please provide a reason for return');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${BASE_URL}/api/payment/request-return`, {
                orderId: returningOrder._id,
                returnReason: returnReason
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Return request submitted successfully');
            setShowReturnModal(false);
            setReturningOrder(null);
            setReturnReason('');
            fetchUserOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit return request');
        }
    };


    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
                {/* <Breadcrumb heading='My Account' subHeading='My Account' /> */}
            </div>
            <div className="profile-block md:py-20 py-10">
                <div className="container">
                    <div className="content-main flex gap-y-8 max-md:flex-col w-full">
                        <div className="left md:w-1/3 w-full xl:pr-[3.125rem] lg:pr-[28px] md:pr-[16px]">
                            <div className="icon user-infor bg-surface lg:px-7 px-4 lg:py-10 py-5 md:rounded-[20px] rounded-xl">
                                <div className="heading flex flex-col items-center justify-center">
                                    <div className="avatar">
                                        <img
                                            src={user?.avatar || 'https://i.pinimg.com/736x/c5/d9/93/c5d9939766e861978c2fb79b8afee8ec.jpg'}
                                            width={300}
                                            height={300}
                                            alt='avatar'
                                            className='md:w-[140px] w-[120px] md:h-[140px] h-[120px] rounded-full'
                                        />
                                    </div>
                                    <div className="name heading6 mt-4 text-center">{user.username}</div>
                                    <div className="mail heading6 font-normal normal-case text-secondary text-center mt-1">{user.email}</div>
                                </div>
                                <div className="menu-tab w-full max-w-none lg:mt-10 mt-6 icon">
                                    <Link to={'#!'} scroll={false} className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                                        <Icon.HouseLine size={20} />
                                        <strong className="heading6">Dashboard</strong>
                                    </Link>
                                    <Link to={'#!'} scroll={false} className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
                                        <Icon.HouseLine size={20} />
                                        <strong className="heading6">Products</strong>
                                    </Link>
                                    <Link to={'#!'} scroll={false} className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5 ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                                        <Icon.Package size={20} />
                                        <strong className="heading6">History Orders</strong>
                                    </Link>
                                    <Link to={'#!'} scroll={false} className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5 ${activeTab === 'address' ? 'active' : ''}`} onClick={() => setActiveTab('address')}>
                                        <Icon.Tag size={20} />
                                        <strong className="heading6">My Address</strong>
                                    </Link>
                                    <Link to={'#!'} scroll={false} className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5 ${activeTab === 'setting' ? 'active' : ''}`} onClick={() => setActiveTab('setting')}>
                                        <Icon.GearSix size={20} />
                                        <strong className="heading6">Setting</strong>
                                    </Link>
                                    <button onClick={handleLogout} className="item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5">
                                        <Icon.SignOut size={20} />
                                        <strong className="heading6">Logout</strong>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="right md:w-2/3 w-full pl-2.5 icon">

                            <div className={`tab text-content w-full ${activeTab === 'dashboard' ? 'block' : 'hidden'}`}>
                                <div className="overview grid sm:grid-cols-3 gap-5">
                                    <div className="item flex items-center justify-between p-5 border border-[#d1cbcb] rounded-lg box-shadow-xs">
                                        <div className="counter">
                                            <span className="text-secondary">Awaiting Pickup</span>
                                            <h5 className="heading5 mt-1">4</h5>
                                        </div>
                                        <Icon.HourglassMedium className='text-4xl' />
                                    </div>
                                    <div className="item flex items-center justify-between p-5 border border-[#d1cbcb] rounded-lg box-shadow-xs">
                                        <div className="counter">
                                            <span className="text-secondary">Cancelled Orders</span>
                                            <h5 className="heading5 mt-1">12</h5>
                                        </div>
                                        <Icon.ReceiptX className='text-4xl' />
                                    </div>
                                    <div className="item flex items-center justify-between p-5 border border-[#d1cbcb] rounded-lg box-shadow-xs">
                                        <div className="counter">
                                            <span className="text-secondary">Total Number of Orders</span>
                                            <h5 className="heading5 mt-1">200</h5>
                                        </div>
                                        <Icon.Package className='text-4xl' />
                                    </div>
                                </div>
                                <div className="recent_order pt-5 px-5 pb-2 mt-7 border border-[#d1cbcb] rounded-xl">
                                    <h6 className="heading6">Recent Orders</h6>
                                    <div className="list overflow-x-auto w-full mt-5">
                                        <table className="w-full max-[1400px]:w-[700px] max-md:w-[700px]">
                                            <thead className="border-b border-[#d1cbcb]">
                                                <tr>
                                                    <th scope="col" className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap">Order</th>
                                                    <th scope="col" className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap">Products</th>
                                                    <th scope="col" className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap">Pricing</th>
                                                    <th scope="col" className="pb-3 text-right text-sm font-bold uppercase text-secondary whitespace-nowrap">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="item duration-300 border-b border-[#d1cbcb]">
                                                    <th scope="row" className="py-3 text-left">
                                                        <strong className="text-title">54312452</strong>
                                                    </th>
                                                    <td className="py-3">
                                                        <Link to={'/product/default'} className="product flex items-center gap-3">
                                                            <img src={'/images/product/1000x1000.png'} width={400} height={400} alt='Contrasting sweatshirt' className="flex-shrink-0 w-12 h-12 rounded" />
                                                            <div className="info flex flex-col">
                                                                <strong className="product_name text-button">Contrasting sweatshirt</strong>
                                                                <span className="product_tag caption1 text-secondary">Women, Clothing</span>
                                                            </div>
                                                        </Link>
                                                    </td>
                                                    <td className="py-3 price">$45.00</td>
                                                    <td className="py-3 text-right">
                                                        <span className="tag px-4 py-1.5 rounded-full bg-opacity-10 bg-yellow text-yellow caption1 font-semibold">Pending</span>
                                                    </td>
                                                </tr>
                                                <tr className="item duration-300 border-b border-[#d1cbcb]">
                                                    <th scope="row" className="py-3 text-left">
                                                        <strong className="text-title">54312452</strong>
                                                    </th>
                                                    <td className="py-3">
                                                        <Link to={'/product/default'} className="product flex items-center gap-3">
                                                            <img src={'/images/product/1000x1000.png'} width={400} height={400} alt='Faux-leather trousers' className="flex-shrink-0 w-12 h-12 rounded" />
                                                            <div className="info flex flex-col">
                                                                <strong className="product_name text-button">Faux-leather trousers</strong>
                                                                <span className="product_tag caption1 text-secondary">Women, Clothing</span>
                                                            </div>
                                                        </Link>
                                                    </td>
                                                    <td className="py-3 price">$45.00</td>
                                                    <td className="py-3 text-right">
                                                        <span className="tag px-4 py-1.5 rounded-full bg-opacity-10 bg-purple text-purple caption1 font-semibold">Delivery</span>
                                                    </td>
                                                </tr>
                                                <tr className="item duration-300 border-b border-[#d1cbcb]">
                                                    <th scope="row" className="py-3 text-left">
                                                        <strong className="text-title">54312452</strong>
                                                    </th>
                                                    <td className="py-3">
                                                        <Link to={'/product/default'} className="product flex items-center gap-3">
                                                            <img src={'/images/product/1000x1000.png'} width={400} height={400} alt='V-neck knitted top' className="flex-shrink-0 w-12 h-12 rounded" />
                                                            <div className="info flex flex-col">
                                                                <strong className="product_name text-button">V-neck knitted top</strong>
                                                                <span className="product_tag caption1 text-secondary">Women, Clothing</span>
                                                            </div>
                                                        </Link>
                                                    </td>
                                                    <td className="py-3 price">$45.00</td>
                                                    <td className="py-3 text-right">
                                                        <span className="tag px-4 py-1.5 rounded-full bg-opacity-10 bg-success text-success caption1 font-semibold">Completed</span>
                                                    </td>
                                                </tr>
                                                <tr className="item duration-300 border-b border-[#d1cbcb]">
                                                    <th scope="row" className="py-3 text-left">
                                                        <strong className="text-title">54312452</strong>
                                                    </th>
                                                    <td className="py-3">
                                                        <Link to={'/product/default'} className="product flex items-center gap-3">
                                                            <img src={'/images/product/1000x1000.png'} width={400} height={400} alt='Contrasting sweatshirt' className="flex-shrink-0 w-12 h-12 rounded" />
                                                            <div className="info flex flex-col">
                                                                <strong className="product_name text-button">Contrasting sweatshirt</strong>
                                                                <span className="product_tag caption1 text-secondary">Women, Clothing</span>
                                                            </div>
                                                        </Link>
                                                    </td>
                                                    <td className="py-3 price">$45.00</td>
                                                    <td className="py-3 text-right">
                                                        <span className="tag px-4 py-1.5 rounded-full bg-opacity-10 bg-yellow text-yellow caption1 font-semibold">Pending</span>
                                                    </td>
                                                </tr>
                                                <tr className="item duration-300 border-b border-[#d1cbcb]">
                                                    <th scope="row" className="py-3 text-left">
                                                        <strong className="text-title">54312452</strong>
                                                    </th>
                                                    <td className="py-3">
                                                        <Link to={'/product/default'} className="product flex items-center gap-3">
                                                            <img src={'/images/product/1000x1000.png'} width={400} height={400} alt='Faux-leather trousers' className="flex-shrink-0 w-12 h-12 rounded" />
                                                            <div className="info flex flex-col">
                                                                <strong className="product_name text-button">Faux-leather trousers</strong>
                                                                <span className="product_tag caption1 text-secondary">Women, Clothing</span>
                                                            </div>
                                                        </Link>
                                                    </td>
                                                    <td className="py-3 price">$45.00</td>
                                                    <td className="py-3 text-right">
                                                        <span className="tag px-4 py-1.5 rounded-full bg-opacity-10 bg-purple text-purple caption1 font-semibold">Delivery</span>
                                                    </td>
                                                </tr>
                                                <tr className="item duration-300">
                                                    <th scope="row" className="py-3 text-left">
                                                        <strong className="text-title">54312452</strong>
                                                    </th>
                                                    <td className="py-3">
                                                        <Link to={'/product/default'} className="product flex items-center gap-3">
                                                            <img src={'/images/product/1000x1000.png'} width={400} height={400} alt='V-neck knitted top' className="flex-shrink-0 w-12 h-12 rounded" />
                                                            <div className="info flex flex-col">
                                                                <strong className="product_name text-button">V-neck knitted top</strong>
                                                                <span className="product_tag caption1 text-secondary">Women, Clothing</span>
                                                            </div>
                                                        </Link>
                                                    </td>
                                                    <td className="py-3 price">$45.00</td>
                                                    <td className="py-3 text-right">
                                                        <span className="tag px-4 py-1.5 rounded-full bg-opacity-10 bg-red text-red caption1 font-semibold">Canceled</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className={`tab text-content w-full ${activeTab === 'products' ? 'block' : 'hidden'}`}>
                                <div className="overview flex items-end justify-end">
                                    <button onClick={() => setActiveTab('product-create')} className="button-main bg-white text-black border border-black w-max text-center icon p-0 !px-4 !py-2 !text-[0.8rem]">Add Product</button>
                                </div>
                                <div className="recent_order pt-5 px-5 pb-2 mt-7 border border-[#d1cbcb] rounded-xl">
                                    <h6 className="heading6">All Products</h6>
                                    <div className="list overflow-x-auto w-full mt-5">
                                        <table className="w-full max-[1400px]:w-[700px] max-md:w-[700px] icon">
                                            <thead className="border-b border-[#d1cbcb]">
                                                <tr>
                                                    <th scope="col" className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap">SNO.</th>
                                                    <th scope="col" className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap">Product</th>
                                                    <th scope="col" className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap">Sale Price</th>
                                                    <th scope="col" className="pb-3 text-right text-sm font-bold uppercase text-secondary whitespace-nowrap">Created At</th>
                                                    <th scope="col" className="pb-3 text-right text-sm font-bold uppercase text-secondary whitespace-nowrap">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {products.map((product, index) => (
                                                    <tr key={`${product._id}+1`} className="item duration-300 border-b border-[#d1cbcb] items-center">
                                                        {/* SNO. */}
                                                        <th scope="row" className="py-3 text-left">
                                                            <strong className="text-title">{index + 1}</strong>
                                                        </th>

                                                        {/* Image + Info */}
                                                        <td className="py-3">
                                                            <Link to={`/product/${product.slug || 'default'}`} className="product flex items-center gap-3">
                                                                <img
                                                                    src={product.thumbImage?.[0] ? `${BASE_URL}${product.thumbImage[0]}` : (product.images?.[0] ? `${BASE_URL}${product.images[0]}` : '/images/product/1000x1000.png')}
                                                                    width={400}
                                                                    height={400}
                                                                    alt={product.name}
                                                                    className="flex-shrink-0 w-12 h-12 rounded object-cover"
                                                                />
                                                                <div className="info flex flex-col">
                                                                    <strong className="product_name text-button">{product.name}</strong>
                                                                    <span className="product_tag caption1 text-secondary">{product.gender}, {product.category}</span>
                                                                </div>
                                                            </Link>
                                                        </td>

                                                        {/* Price */}
                                                        <td className="py-3 price">{formatPrice(product.price, product.currency || 'INR')}</td>


                                                        {/* Created At */}
                                                        <td className="py-3 text-right">
                                                            {new Date(product.createdAt).toLocaleDateString('en-IN')}
                                                        </td>
                                                        <td className="!py-6 text-right  flex gap-5 items-center  justify-end">
                                                            <button
                                                                className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                                                title="Edit"
                                                                onClick={() => handleEdit(product)}
                                                            >
                                                                <Icon.PencilSimple size={18} weight="bold" />
                                                            </button>
                                                            <button
                                                                className="text-red-600 hover:text-red-800 cursor-pointer"
                                                                title="Delete"
                                                                onClick={() => handleDelete(product._id)}
                                                            >
                                                                <Icon.Trash size={18} weight="bold" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <ProductCreateForm editingProduct={editingProduct} setEditingProduct={setEditingProduct} setActiveTab={setActiveTab} activeTab={activeTab} />
                            <div className={`tab text-content overflow-hidden w-full p-7 border border-[#d1cbcb] rounded-xl ${activeTab === 'orders' ? 'block' : 'hidden'} icon`}>
                                <h6 className="heading6">Your Orders</h6>
                                <div className="w-full overflow-x-auto">
                                    <div className="menu-tab grid grid-cols-5 max-lg:w-[500px] border-b border-[#d1cbcb] mt-3">
                                        {['all', 'pending', 'shipped', 'delivered', 'cancelled'].map((item, index) => (
                                            <button
                                                key={index}
                                                className={`item relative px-3 py-2.5 text-secondary text-center duration-300 hover:text-black border-b-2 capitalize ${activeOrders === item ? 'active border-black' : 'border-transparent'}`}
                                                onClick={() => handleActiveOrders(item)}
                                            >
                                                <span className='relative text-button z-[1]'>
                                                    {item}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="list_order icon">
                                    {ordersLoading ? (
                                        <div className="text-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
                                            <p className="text-secondary">Loading orders...</p>
                                        </div>
                                    ) : userOrders.length === 0 ? (
                                        <div className="text-center py-8 text-secondary">
                                            <Icon.Package size={48} className="mx-auto mb-3" />
                                            <p>No orders yet</p>
                                            <Link to="/shop/breadcrumb1" className="button-main mt-4 inline-block">Start Shopping</Link>
                                        </div>
                                    ) : (
                                        userOrders
                                            .filter(order => activeOrders === 'all' || order.orderStatus === activeOrders)
                                            .map((order) => (
                                        <div key={order._id} className="order_item mt-5 border border-[#d1cbcb] rounded-lg box-shadow-xs">
                                            <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-[#d1cbcb]">
                                                <div className="flex items-center gap-2">
                                                    <strong className="text-title">Order:</strong>
                                                    <strong className="order_number text-button uppercase">{order.orderNumber}</strong>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`tag px-4 py-1.5 rounded-full caption1 font-semibold capitalize ${getStatusColor(order.orderStatus)}`}>
                                                        {order.orderStatus}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="list_prd px-5">
                                                {order.items?.map((item, idx) => (
                                                    <div key={idx} className="prd_item flex flex-wrap items-center justify-between gap-3 py-5 border-b border-[#d1cbcb]">
                                                        <div className="flex items-center gap-5">
                                                            <div className="bg-img flex-shrink-0 w-16 aspect-square rounded-lg overflow-hidden">
                                                                <img
                                                                    src={item.image ? (item.image.startsWith('http') ? item.image : `${BASE_URL}${item.image}`) : '/images/product/1000x1000.png'}
                                                                    alt={item.name}
                                                                    className='w-full h-full object-cover'
                                                                />
                                                            </div>
                                                            <div>
                                                                <div className="prd_name text-title">{item.name}</div>
                                                                <div className="caption1 text-secondary mt-1">
                                                                    <span className="uppercase">{item.size}</span>
                                                                    <span> / </span>
                                                                    <span className="capitalize">{item.color}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='text-title'>
                                                            {item.quantity} x {formatPrice(item.price, order.currency || 'INR')}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="px-5 py-3 flex justify-between items-center border-b border-[#d1cbcb]">
                                                <span className="text-secondary text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                <span className="text-button">Total: {formatPrice(order.total, order.currency || 'INR')}</span>
                                            </div>
                                            {order.trackingNumber && (
                                                <div className="px-5 py-3 bg-surface flex items-center gap-2">
                                                    <Icon.MapPin size={16} />
                                                    <span className="text-sm">Tracking: <strong>{order.trackingNumber}</strong></span>
                                                    {order.trackingUrl && (
                                                        <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm underline ml-2">Track</a>
                                                    )}
                                                </div>
                                            )}
                                            <div className="flex flex-wrap gap-3 p-5">
                                                <button className="button-main !py-2 !text-sm" onClick={() => { setSelectedOrderDetail(order); setOpenDetail(true); }}>Order Details</button>
                                                {order.trackingNumber && (
                                                    <Link 
                                                        to={`/track-order/${order.orderNumber}`}
                                                        className="button-main bg-blue-600 hover:bg-blue-700 text-white !py-2 !text-sm"
                                                    >
                                                        Track Order
                                                    </Link>
                                                )}
                                                {order.orderStatus === 'delivered' && order.returnStatus === 'none' && (
                                                    <button 
                                                        className="button-main bg-surface border border-[#d1cbcb] hover:bg-black text-black hover:text-white !py-2 !text-sm"
                                                        onClick={() => handleRequestReturn(order)}
                                                    >
                                                        Request Return
                                                    </button>
                                                )}
                                                {order.returnStatus === 'requested' && (
                                                    <span className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded text-sm">
                                                        Return Requested
                                                    </span>
                                                )}
                                                {order.returnStatus === 'approved' && (
                                                    <span className="px-3 py-2 bg-green-100 text-green-800 rounded text-sm">
                                                        Return Approved
                                                    </span>
                                                )}
                                                {order.returnStatus === 'rejected' && (
                                                    <span className="px-3 py-2 bg-red-100 text-red-800 rounded text-sm">
                                                        Return Rejected
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                    )}
                                </div>
                            </div>
                            <div className={`tab_address text-content w-full p-7 border border-[#d1cbcb] rounded-xl ${activeTab === 'address' ? 'block' : 'hidden'} icon`}>
                                <form>
                                    <button
                                        type='button'
                                        className={`tab_btn flex items-center justify-between w-full pb-1.5 border-b border-[#d1cbcb] ${activeAddress === 'billing' ? 'active' : ''}`}
                                        onClick={() => handleActiveAddress('billing')}
                                    >
                                        <strong className="heading6">Billing address</strong>
                                        <Icon.CaretDown className='text-2xl ic_down duration-300' />
                                    </button>
                                    <div className={`form_address ${activeAddress === 'billing' ? 'block' : 'hidden'}`}>
                                        <div className='grid sm:grid-cols-2 gap-4 gap-y-5 mt-5'>
                                            <div className="first-name">
                                                <label htmlFor="billingFirstName" className='caption1 capitalize'>First Name <span className='text-red'>*</span></label>
                                                <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="billingFirstName" type="text" required />
                                            </div>
                                            <div className="last-name">
                                                <label htmlFor="billingLastName" className='caption1 capitalize'>Last Name <span className='text-red'>*</span></label>
                                                <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="billingLastName" type="text" required />
                                            </div>
                                            <div className="company">
                                                <label htmlFor="billingCompany" className='caption1 capitalize'>Company name (optional)</label>
                                                <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="billingCompany" type="text" required />
                                            </div>
                                            <div className="country">
                                                <label htmlFor="billingCountry" className='caption1 capitalize'>Country / Region <span className='text-red'>*</span></label>
                                                <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="billingCountry" type="text" required />
                                            </div>
                                            <div className="street">
                                                <label htmlFor="billingStreet" className='caption1 capitalize'>street address <span className='text-red'>*</span></label>
                                                <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="billingStreet" type="text" required />
                                            </div>
                                            <div className="city">
                                                <label htmlFor="billingCity" className='caption1 capitalize'>Town / city <span className='text-red'>*</span></label>
                                                <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="billingCity" type="text" required />
                                            </div>
                                            <div className="state">
                                                <label htmlFor="billingState" className='caption1 capitalize'>state <span className='text-red'>*</span></label>
                                                <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="billingState" type="text" required />
                                            </div>
                                            <div className="zip">
                                                <label htmlFor="billingZip" className='caption1 capitalize'>ZIP <span className='text-red'>*</span></label>
                                                <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="billingZip" type="text" required />
                                            </div>
                                            <div className="phone">
                                                <label htmlFor="billingPhone" className='caption1 capitalize'>Phone <span className='text-red'>*</span></label>
                                                <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="billingPhone" type="text" required />
                                            </div>
                                            <div className="email">
                                                <label htmlFor="billingEmail" className='caption1 capitalize'>Email <span className='text-red'>*</span></label>
                                                <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="billingEmail" type="email" required />
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type='button'
                                        className={`tab_btn flex items-center justify-between w-full mt-10 pb-1.5 border-b border-[#d1cbcb] ${activeAddress === 'shipping' ? 'active' : ''}`}
                                        onClick={() => handleActiveAddress('shipping')}
                                    >
                                        <strong className="heading6">Shipping address</strong>
                                        <Icon.CaretDown className='text-2xl ic_down duration-300' />
                                    </button>
                                    <div className={`form_address ${activeAddress === 'shipping' ? 'block' : 'hidden'}`}>
                                        <div className='grid sm:grid-cols-2 gap-4 gap-y-5 mt-5'>
                                            <div className="first-name">
                                                <label htmlFor="shippingFirstName" className='caption1 capitalize'>First Name <span className='text-red'>*</span></label>
                                                <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="shippingFirstName" type="text" required />
                                            </div>
                                            <div className="last-name">
                                                <label htmlFor="shippingLastName" className='caption1 capitalize'>Last Name <span className='text-red'>*</span></label>
                                                <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="shippingLastName" type="text" required />
                                            </div>
                                            <div className="company">
                                                <label htmlFor="shippingCompany" className='caption1 capitalize'>Company name (optional)</label>
                                                <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="shippingCompany" type="text" required />
                                            </div>
                                            <div className="country">
                                                <label htmlFor="shippingCountry" className='caption1 capitalize'>Country / Region <span className='text-red'>*</span></label>
                                                <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="shippingCountry" type="text" required />
                                            </div>
                                            <div className="street">
                                                <label htmlFor="shippingStreet" className='caption1 capitalize'>street address <span className='text-red'>*</span></label>
                                                <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="shippingStreet" type="text" required />
                                            </div>
                                            <div className="city">
                                                <label htmlFor="shippingCity" className='caption1 capitalize'>Town / city <span className='text-red'>*</span></label>
                                                <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="shippingCity" type="text" required />
                                            </div>
                                            <div className="state">
                                                <label htmlFor="shippingState" className='caption1 capitalize'>state <span className='text-red'>*</span></label>
                                                <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="shippingState" type="text" required />
                                            </div>
                                            <div className="zip">
                                                <label htmlFor="shippingZip" className='caption1 capitalize'>ZIP <span className='text-red'>*</span></label>
                                                <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="shippingZip" type="text" required />
                                            </div>
                                            <div className="phone">
                                                <label htmlFor="shippingPhone" className='caption1 capitalize'>Phone <span className='text-red'>*</span></label>
                                                <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="shippingPhone" type="text" required />
                                            </div>
                                            <div className="email">
                                                <label htmlFor="shippingEmail" className='caption1 capitalize'>Email <span className='text-red'>*</span></label>
                                                <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="shippingEmail" type="email" required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="block-button lg:mt-10 mt-6">
                                        <button className="button-main">Update Address</button>
                                    </div>
                                </form>
                            </div>
                            <div className={`tab text-content w-full p-7 border border-[#d1cbcb] rounded-xl ${activeTab === 'setting' ? 'block' : 'hidden'} icon`}>
                                <form>
                                    <div className="heading5 pb-4">Information</div>
                                    <div className="upload_image col-span-full">
                                        <label htmlFor="uploadImage">Upload Avatar: <span className="text-red">*</span></label>
                                        <div className="flex flex-wrap items-center gap-5 mt-3">
                                            <div className="bg_img flex-shrink-0 relative w-[7.5rem] h-[7.5rem] rounded-lg overflow-hidden bg-surface">
                                                <span className="ph ph-image text-5xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-secondary"></span>
                                                <img
                                                    src={'/images/avatar/1.png'}
                                                    width={300}
                                                    height={300}
                                                    alt='avatar'
                                                    className="upload_img relative z-[1] w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <strong className="text-button">Upload File:</strong>
                                                <p className="caption1 text-secondary mt-1">JPG 120x120px</p>
                                                <div className="upload_file flex items-center gap-3 w-[220px] mt-3 px-3 py-2 border border-[#d1cbcb] rounded">
                                                    <label htmlFor="uploadImage" className="caption2 py-1 px-3 rounded bg-[#d1cbcb] whitespace-nowrap cursor-pointer">Choose File</label>
                                                    <input type="file" name="uploadImage" id="uploadImage" accept="image/*" className="caption2 cursor-pointer" required />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='grid sm:grid-cols-2 gap-4 gap-y-5 mt-5'>
                                        <div className="first-name">
                                            <label htmlFor="firstName" className='caption1 capitalize'>First Name <span className='text-red'>*</span></label>
                                            <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="firstName" type="text" defaultValue={'Tony'} placeholder='First name' required />
                                        </div>
                                        <div className="last-name">
                                            <label htmlFor="lastName" className='caption1 capitalize'>Last Name <span className='text-red'>*</span></label>
                                            <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="lastName" type="text" defaultValue={'Nguyen'} placeholder='Last name' required />
                                        </div>
                                        <div className="phone-number">
                                            <label htmlFor="phoneNumber" className='caption1 capitalize'>Phone Number <span className='text-red'>*</span></label>
                                            <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="phoneNumber" type="text" defaultValue={'(+12) 345 678 910'} placeholder="Phone number" required />
                                        </div>
                                        <div className="email">
                                            <label htmlFor="email" className='caption1 capitalize'>Email Address <span className='text-red'>*</span></label>
                                            <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="email" type="email" defaultValue={'hi.avitex@gmail.com'} placeholder="Email address" required />
                                        </div>
                                        <div className="gender">
                                            <label htmlFor="gender" className='caption1 capitalize'>Gender <span className='text-red'>*</span></label>
                                            <div className="select-block mt-2">
                                                <select className="border border-[#d1cbcb] px-4 py-3 w-full rounded-lg" id="gender" name="gender" defaultValue={'default'}>
                                                    <option value="default" disabled>Choose Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                <Icon.CaretDown className='arrow-down text-lg' />
                                            </div>
                                        </div>
                                        <div className="birth">
                                            <label htmlFor="birth" className='caption1'>Day of Birth <span className='text-red'>*</span></label>
                                            <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="birth" type="date" placeholder="Day of Birth" required />
                                        </div>
                                    </div>
                                    <div className="heading5 pb-4 lg:mt-10 mt-6">Change Password</div>
                                    <div className="pass">
                                        <label htmlFor="password" className='caption1'>Current password <span className='text-red'>*</span></label>
                                        <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="password" type="password" placeholder="Password *" required />
                                    </div>
                                    <div className="new-pass mt-5">
                                        <label htmlFor="newPassword" className='caption1'>New password <span className='text-red'>*</span></label>
                                        <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="newPassword" type="password" placeholder="New Password *" required />
                                    </div>
                                    <div className="confirm-pass mt-5">
                                        <label htmlFor="confirmPassword" className='caption1'>Confirm new password <span className='text-red'>*</span></label>
                                        <input className="border-[#d1cbcb] mt-2 px-4 py-3 w-full rounded-lg" id="confirmPassword" type="password" placeholder="Confirm Password *" required />
                                    </div>
                                    <div className="block-button lg:mt-10 mt-6">
                                        <button className="button-main">Save Change</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            
            {/* Return Request Modal */}
            {showReturnModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowReturnModal(false)}>
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <h3 className="heading5 mb-4">Request Return</h3>
                        <p className="text-sm text-secondary mb-4">Order: {returningOrder?.orderNumber}</p>
                        <textarea
                            className="w-full border border-[#d1cbcb] px-4 py-3 rounded-lg mb-4"
                            rows="4"
                            placeholder="Please provide a reason for return..."
                            value={returnReason}
                            onChange={(e) => setReturnReason(e.target.value)}
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={handleSubmitReturn}
                                className="button-main flex-1"
                            >
                                Submit Return Request
                            </button>
                            <button
                                onClick={() => {
                                    setShowReturnModal(false);
                                    setReturningOrder(null);
                                    setReturnReason('');
                                }}
                                className="button-main bg-surface border border-[#d1cbcb] text-black hover:bg-black hover:text-white flex-1"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={`modal-order-detail-block flex items-center justify-center icon`} onClick={() => setOpenDetail(false)}>
                <div className={`modal-order-detail-main grid grid-cols-2 w-[1160px] bg-white rounded-2xl ${openDetail ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                    <div className="info p-10 border-r border-[#d1cbcb]">
                        <h5 className="heading5">Order Details</h5>
                        <div className="list_info grid grid-cols-2 gap-10 gap-y-8 mt-5">
                            <div className="info_item">
                                <strong className="text-button-uppercase text-secondary">Contact Information</strong>
                                <h6 className="heading6 order_name mt-2">Tony nguyen</h6>
                                <h6 className="heading6 order_phone mt-2">(+12) 345 - 678910</h6>
                                <h6 className="heading6 normal-case order_email mt-2">hi.avitex@gmail.com</h6>
                            </div>
                            <div className="info_item">
                                <strong className="text-button-uppercase text-secondary">Payment method</strong>
                                <h6 className="heading6 order_payment mt-2">cash delivery</h6>
                            </div>
                            <div className="info_item">
                                <strong className="text-button-uppercase text-secondary">Shipping address</strong>
                                <h6 className="heading6 order_shipping_address mt-2">2163 Phillips Gap Rd, West Jefferson, North Carolina, US</h6>
                            </div>
                            <div className="info_item">
                                <strong className="text-button-uppercase text-secondary">Billing address</strong>
                                <h6 className="heading6 order_billing_address mt-2">2163 Phillips Gap Rd, West Jefferson, North Carolina, US</h6>
                            </div>
                            <div className="info_item">
                                <strong className="text-button-uppercase text-secondary">Company</strong>
                                <h6 className="heading6 order_company mt-2">Avitex Technology</h6>
                            </div>
                        </div>
                    </div>
                    <div className="list p-10">
                        <h5 className="heading5">Items</h5>
                        <div className="list_prd">
                            <div className="prd_item flex flex-wrap items-center justify-between gap-3 py-5 border-b border-[#d1cbcb]">
                                <Link to={'/product/default'} className="flex items-center gap-5">
                                    <div className="bg-img flex-shrink-0 md:w-[100px] w-20 aspect-square rounded-lg overflow-hidden">
                                        <img
                                            src={'/images/product/1000x1000.png'}
                                            width={1000}
                                            height={1000}
                                            alt={'Contrasting sheepskin sweatshirt'}
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                    <div>
                                        <div className="prd_name text-title">Contrasting sheepskin sweatshirt</div>
                                        <div className="caption1 text-secondary mt-2">
                                            <span className="prd_size uppercase">XL</span>
                                            <span>/</span>
                                            <span className="prd_color capitalize">Yellow</span>
                                        </div>
                                    </div>
                                </Link>
                                <div className='text-title'>
                                    <span className="prd_quantity">1</span>
                                    <span> X </span>
                                    <span className="prd_price">$45.00</span>
                                </div>
                            </div>
                            <div className="prd_item flex flex-wrap items-center justify-between gap-3 py-5 border-b border-[#d1cbcb]">
                                <Link to={'/product/default'} className="flex items-center gap-5">
                                    <div className="bg-img flex-shrink-0 md:w-[100px] w-20 aspect-square rounded-lg overflow-hidden">
                                        <img
                                            src={'/images/product/1000x1000.png'}
                                            width={1000}
                                            height={1000}
                                            alt={'Contrasting sheepskin sweatshirt'}
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                    <div>
                                        <div className="prd_name text-title">Contrasting sheepskin sweatshirt</div>
                                        <div className="caption1 text-secondary mt-2">
                                            <span className="prd_size uppercase">XL</span>
                                            <span>/</span>
                                            <span className="prd_color capitalize">White</span>
                                        </div>
                                    </div>
                                </Link>
                                <div className='text-title'>
                                    <span className="prd_quantity">2</span>
                                    <span> X </span>
                                    <span className="prd_price">$70.00</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-5">
                            <strong className="text-title">Shipping</strong>
                            <strong className="order_ship text-title">Free</strong>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <strong className="text-title">Discounts</strong>
                            <strong className="order_discounts text-title">-$80.00</strong>
                        </div>
                        <div className="flex items-center justify-between mt-5 pt-5 border-t border-[#d1cbcb]">
                            <h5 className="heading5">Subtotal</h5>
                            <h5 className="order_total heading5">$105.00</h5>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyAccount