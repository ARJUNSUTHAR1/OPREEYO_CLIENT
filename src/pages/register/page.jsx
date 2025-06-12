import React, { useState } from 'react';
import TopNavOne from '../../components/Header/TopNav/TopNavOne';
import MenuOne from '../../components/Header/Menu/MenuOne';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Footer from '../../components/Footer/Footer';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Register = () => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agree: false
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, email, password, confirmPassword, agree } = form;

        if (!username || !email || !password || !confirmPassword) {
            toast.error("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (!agree) {
            toast.error("Please agree to the Terms of User");
            return;
        }

        try {
            setLoading(true);
            await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth/register`, {
                username,
                email,
                password
            });

            toast.success("Account created successfully");
            navigate("/login");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading='Create An Account' subHeading='Create An Account' />
            </div>
            <div className="register-block md:py-18 py-10">
                <div className="container">
                    <div className="content-main flex gap-y-8 max-md:flex-col">
                        <div className="left md:w-1/2 w-full lg:pr-[60px] md:pr-[40px] md:border-r border-line">
                            <div className="heading4 icon">Register</div>
                            <form className="md:mt-7 mt-4" onSubmit={handleSubmit}>
                                <div className="email ">
                                    <input className="border-[#000] icon px-4 pt-3 pb-3 w-full rounded-lg"
                                        name="username"
                                        type="text"
                                        placeholder="Username *"
                                        value={form.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="email  mt-5">
                                    <input className="border-[#000] icon px-4 pt-3 pb-3 w-full rounded-lg"
                                        name="email"
                                        type="email" placeholder="Email*" required
                                        value={form.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="pass mt-5">
                                    <input className="border-[#000] icon px-4 pt-3 pb-3 w-full rounded-lg"
                                        name="password"
                                        id="password"
                                        type="password"
                                        placeholder="Password *"
                                        required
                                        value={form.password}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="confirm-pass mt-5">
                                    <input className="border-[#000] icon px-4 pt-3 pb-3 w-full rounded-lg"
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm Password *"
                                        required
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='flex items-center mt-5'>
                                    <div className="block-input">
                                        <input
                                            type="checkbox"
                                            name='agree'
                                            id='remember'
                                            checked={form.agree}
                                            onChange={handleChange}
                                        />
                                        <Icon.CheckSquare size={20} weight='fill' className='icon-checkbox' />
                                    </div>
                                    <label htmlFor='remember' className="pl-2 cursor-pointer text-secondary2 icon">
                                        I agree to the
                                        <Link to={'#!'} className='text-black hover:underline pl-1 icon'>Terms of User</Link>
                                    </label>
                                </div>
                                <div className="block-button md:mt-7 mt-4">
                                    <button
                                        className={`button-main icon font-bold ${loading ? 'opacity-60 pointer-events-none' : ''}`}
                                        type="submit"
                                    >
                                        {loading ? "Registering..." : "Register"}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="right md:w-1/2 w-full lg:pl-[60px] md:pl-[40px] flex items-center">
                            <div className="text-content">
                                <div className="heading4 icon">Already have an account?</div>
                                <div className="mt-2 text-secondary icon">Welcome back. Sign in to access your personalized experience, saved preferences, and more. We{String.raw`'re`} thrilled to have you with us again!</div>
                                <div className="block-button md:mt-7 mt-4">
                                    <Link to={'/login'} className="button-main icon font-bold">Login</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Register