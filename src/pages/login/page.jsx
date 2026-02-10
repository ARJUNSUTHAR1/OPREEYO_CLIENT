import React, { useState } from 'react';
import TopNavOne from '../../components/Header/TopNav/TopNavOne';
import MenuOne from '../../components/Header/Menu/MenuOne';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Footer from '../../components/Footer/Footer';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import useAuthStore from '../../store/authStore'; // ✅ Zustand store


const Login = () => {
    const [form, setForm] = useState({
        identifier: '',
        password: '',
        remember: false
    });


    const setUser = useAuthStore(state => state.setUser);
    const setToken = useAuthStore(state => state.setToken);

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { identifier, password } = form;

        if (!identifier || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth/login`, {
                identifier,
                password
            });

            toast.success("Login successful");

            // ✅ Save to Zustand
            setUser(res.data.user);
            setToken(res.data.token);

            // ✅ Also save to localStorage for admin panel
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            // Redirect to admin dashboard if user is admin
            if (res.data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                // Check if there's a redirect parameter
                const redirect = searchParams.get('redirect');
                if (redirect) {
                    navigate(decodeURIComponent(redirect));
                } else {
                    navigate('/');
                }
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading='Login' subHeading='Login' />
            </div>
            <div className="login-block md:py-18 py-10">
                <div className="container">
                    <div className="content-main flex gap-y-8 max-md:flex-col">
                        <div className="left md:w-1/2 w-full lg:pr-[60px] md:pr-[40px] md:border-r border-line">
                            <div className="heading4 icon">Login</div>
                            <form className="md:mt-7 mt-4" onSubmit={handleSubmit}>
                                <div className="email ">
                                    <input
                                        className="border-[#000] icon px-4 pt-3 pb-3 w-full rounded-lg"
                                        name="identifier"
                                        type="text"
                                        placeholder="Username or email address *"
                                        value={form.identifier}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="pass mt-5">
                                    <input
                                        className="border-[#000] icon px-4 pt-3 pb-3 w-full rounded-lg"
                                        name="password"
                                        type="password"
                                        placeholder="Password *"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="flex items-center justify-between mt-5">
                                    <div className='flex items-center'>
                                        <div className="block-input">
                                            <input
                                                type="checkbox"
                                                name='remember'
                                                id='remember'
                                                checked={form.remember}
                                                onChange={handleChange}
                                            />
                                            <Icon.CheckSquare size={20} weight='fill' className='icon-checkbox' />
                                        </div>
                                        <label htmlFor='remember' className="icon pl-2 cursor-pointer">Remember me</label>
                                    </div>
                                    {/* <Link to={'/forgot-password'} className='font-semibold hover:underline'>Forgot Your Password?</Link> */}
                                </div>
                                <div className="block-button md:mt-7 mt-4">
                                    <button
                                        className={`button-main icon font-bold ${loading ? 'opacity-60 pointer-events-none' : ''}`}
                                        type="submit"
                                    >
                                        {loading ? "Logging in..." : "Login"}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="right md:w-1/2 w-full lg:pl-[60px] md:pl-[40px] flex items-center">
                            <div className="text-content">
                                <div className="heading4 icon">New Customer</div>
                                <div className="mt-2 text-secondary icon">Be part of our growing family of new customers! Join us today and unlock a world of exclusive benefits, offers, and personalized experiences.</div>
                                <div className="block-button md:mt-7 mt-4">
                                    <Link to={'/register'} className="button-main icon font-bold">Register</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Login;
