import React, { useEffect, useState } from "react";
import API from "../Api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ReferralsTab = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token || !user?._id) {
            setLoading(false);
            return;
        }

        const fetchReferrals = async () => {
            try {
                // Ensure your backend router is configured to handle this path correctly
                const res = await API.get(`/referrals/${user._id}/referrals`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setData(res.data);
            } catch (err) {
                console.error("Error fetching referrals", err);
                toast.error("Failed to load referral data.");
            } finally {
                setLoading(false);
            }
        };

        fetchReferrals();
    }, []);

    const handleCopy = () => {
        if (data?.referralCode) {
            navigator.clipboard.writeText(data.referralCode);
            toast.success("Referral code copied to clipboard!");
        }
    };

    if (loading) {
        return (
            <div className="p-6 text-center bg-white shadow rounded-xl animate-pulse">
                <p>Loading your referral information...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-6 text-center bg-white shadow rounded-xl">
                <p className="text-red-500">Failed to load referral data. Please log in again.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold text-gray-800">Referral Dashboard</h2>

            {/* Referral Code Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-700">Your Referral Code</p>
                    <div className="mt-2 flex items-center bg-gray-100 rounded-md p-2">
                        <Input
                            type="text"
                            value={data.referralCode}
                            readOnly
                            className="flex-1 border-none bg-transparent font-mono text-gray-800 focus-visible:ring-0"
                        />
                        <Button onClick={handleCopy} className="bg-sky-500 hover:bg-sky-600 ml-2 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                            </svg>
                            Copy
                        </Button>
                    </div>
                </div>
            </div>

            {/* Referred By Section */}
            {data.referredBy?.fullname && (
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                        </svg>
                        <p>
                            You were referred by: <strong className="text-gray-800">{data.referredBy.fullname}</strong>
                        </p>
                    </div>
                </div>
            )}

            {/* List of Referrals */}
            <h3 className="text-2xl font-bold text-gray-800 mt-8">People You Referred</h3>
            {data.referrals?.length === 0 ? (
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 text-center text-gray-500">
                    <p>You haven't referred anyone yet.</p>
                    <p className="mt-2">Share your code to start earning rewards!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.referrals.map((ref) => (
                        <div key={ref._id} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 transition-transform hover:scale-105">
                            <div className="flex items-center space-x-3 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.935 13.935 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="font-semibold text-gray-800">{ref.fullname}</p>
                            </div>
                            <p className="text-sm text-gray-500">{ref.email}</p>
                            <div className="mt-4 flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 01.894.553l.448.894a1 1 0 00.16.291l.824.824a1 1 0 01.378.378l.894.448A1 1 0 0118 10a1 1 0 01-.553.894l-.894.448a1 1 0 00-.291.16l-.824.824a1 1 0 01-.378.378l-.448.894A1 1 0 0110 18a1 1 0 01-.894-.553l-.448-.894a1 1 0 00-.16-.291l-.824-.824a1 1 0 01-.378-.378l-.894-.448A1 1 0 012 10a1 1 0 01.553-.894l.894-.448a1 1 0 00.291-.16l.824-.824a1 1 0 01.378-.378l.448-.894A1 1 0 0110 2zM6 10a4 4 0 118 0 4 4 0 01-8 0z" clipRule="evenodd" />
                                </svg>
                                <p className="text-base font-medium text-gray-800">
                                    {ref.rewardPoints} Points
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReferralsTab;