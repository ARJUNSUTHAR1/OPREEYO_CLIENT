import React, { useState, useEffect } from 'react';
import * as Icon from "@phosphor-icons/react";
import AdminLayout from '../../components/Admin/AdminLayout';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/addresses', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAddresses(response.data);
        } catch (error) {
            console.error('Error fetching addresses:', error);
            toast.error('Failed to fetch addresses');
        } finally {
            setLoading(false);
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
            <div className="addresses-content">
                <div className="heading4 mb-6">User Addresses</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                        <div key={address._id} className="bg-white rounded-lg shadow-sm border border-line p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="text-button font-bold">{address.fullName}</div>
                                    <div className="text-sm text-secondary">{address.phoneNumber}</div>
                                </div>
                                {address.isDefault && (
                                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">
                                        Default
                                    </span>
                                )}
                            </div>
                            <div className="text-sm text-secondary space-y-1">
                                <p>{address.addressLine1}</p>
                                {address.addressLine2 && <p>{address.addressLine2}</p>}
                                <p>{address.city}, {address.state} {address.postalCode}</p>
                                <p>{address.country}</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-line">
                                <span className="text-xs text-secondary capitalize">
                                    {address.addressType} Address
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {addresses.length === 0 && (
                    <div className="text-center py-12 text-secondary">
                        No addresses found.
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminAddresses;
