import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

const SocialConnect = () => {
    const navigate = useNavigate();
    const [connected, setConnected] = useState({
        instagram: false,
        tiktok: false,
        youtube: false,
    });
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }

                const res = await API.get("/social/status", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setConnected(res.data);
            } catch (error) {
                toast.error("Failed to fetch social connection status.");
                console.error("Fetch status error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
    }, [navigate]);

    const handleConnect = async (platform) => {
        try {

            const token = localStorage.getItem("token");
            await API.post(`/social/connect`, { platform }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setConnected((prev) => ({ ...prev, [platform]: true }));
            toast.success(`${platform} connected successfully!`);
        } catch (error) {
            toast.error(`Failed to connect ${platform}. Please try again.`);
            console.error("Connect error:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading social connection status...</p>
            </div>
        );
    }

    const allConnected = connected.instagram && connected.tiktok && connected.youtube;

    const handleOnboardingComplete = async () => {
        try {
            const token = localStorage.getItem("token");
            await API.post('/user/onboarding-complete', {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Onboarding complete! Welcome to your home page.");
            navigate("/home");

        } catch (error) {
            console.error("Failed to complete onboarding:", error);
            toast.error("Failed to finalize profile setup. Please try again.");
        }
    };

    const getPlatformIcon = (platform) => {
        switch (platform) {
            case 'instagram':
                return <FaInstagram className="h-6 w-6 text-pink-600" />;
            case 'tiktok':
                return <FaTiktok className="h-6 w-6 text-black" />;
            case 'youtube':
                return <FaYoutube className="h-6 w-6 text-red-600" />;
            default:
                return null;
        }
    };

    const ConnectedIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
    );

    return (
        <div className="min-h-screen bg-gray-100 py-6">
           
            <div className="container mx-auto mt-8 p-6 bg-white rounded-md shadow-md flex flex-col lg:flex-row gap-8">
                {/* Left Section: Content */}
                <div className="lg:w-1/2">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">
                        Connect your social media profiles
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Link your accounts to get access to brand opportunities and detailed metrics.
                    </p>
                    <div className="space-y-4">
                        {["instagram", "tiktok", "youtube"].map((platform) => (
                            <div
                                key={platform}
                                className="p-4 border border-gray-200 rounded-lg flex items-center justify-between shadow-sm bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    {getPlatformIcon(platform)}
                                    <span className="text-lg font-medium capitalize text-gray-700">{platform}</span>
                                </div>
                                {connected && connected.hasOwnProperty(platform) ? (
                                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                                        <ConnectedIcon />
                                        <span>Connected</span>
                                    </div>
                                ) : (
                                    <Button onClick={() => handleConnect(platform)}>Connect</Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4 justify-center mt-8">
                            <Button
                                variant="ghost"
                                onClick={() => navigate("/dashboard")}
                                className="text-gray-500 hover:text-gray-800"
                            >
                                I'll do this later
                            </Button>
                            
                        </div>

                    <div className="flex justify-between mt-20">
                        <Button variant="outline" onClick={() => navigate("/onboarding/preferences")}>
                            Back
                        </Button>
                        <Button
                                onClick={handleOnboardingComplete}
                                disabled={!allConnected}
                            >
                                Finish
                            </Button>
                        
                    </div>
                </div>

                {/* Right Section: Image */}
                <div className="lg:w-1/3">
        <img
          src="/Register.png"
          alt="Claim Your Profile"
          className="rounded-xl shadow-xl h-full w-full object-cover ml-20"
        />
      </div>
            </div>
        </div>
    );
};

export default SocialConnect;