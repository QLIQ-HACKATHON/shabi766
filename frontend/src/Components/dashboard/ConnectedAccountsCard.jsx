import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import API from "../Api";

const ConnectedAccountsCard = () => {
    const [connectedStatus, setConnectedStatus] = useState({
        instagram: false,
        tiktok: false,
        youtube: false,
    });

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const res = await API.get("/social/status", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setConnectedStatus(res.data);
            } catch (error) {
                console.error("Failed to fetch social status:", error);
            }
        };
        fetchStatus();
    }, []);

    const getIcon = (platform, isConnected) => {
        const iconClass = isConnected ? 'text-green-500' : 'text-gray-400';
        switch (platform) {
            case 'instagram': return <FaInstagram className={`h-6 w-6 ${iconClass}`} />;
            case 'tiktok': return <FaTiktok className={`h-6 w-6 ${iconClass}`} />;
            case 'youtube': return <FaYoutube className={`h-6 w-6 ${iconClass}`} />;
            default: return null;
        }
    };

    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-sm font-medium">Connected Accounts</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                {Object.entries(connectedStatus).map(([platform, isConnected]) => (
                    <div key={platform} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {getIcon(platform, isConnected)}
                            <span className="text-sm capitalize">{platform}</span>
                        </div>
                        <span className={`text-xs font-semibold ${isConnected ? 'text-green-600' : 'text-red-500'}`}>
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default ConnectedAccountsCard;