import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import API from "../Api";
import { toast } from 'sonner';

const ReferralMetricsCard = () => {
    const [referralCount, setReferralCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReferralCount = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const res = await API.get("/referrals/count", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReferralCount(res.data.count);
            } catch (error) {
                console.error("Failed to fetch referral count:", error);
                toast.error("Failed to load referral metrics.");
            } finally {
                setLoading(false);
            }
        };

        fetchReferralCount();
    }, []);

    return (
        <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Your Referrals</CardTitle>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {loading ? "..." : referralCount}
                </div>
                <p className="text-xs text-muted-foreground">Total sign-ups using your code</p>
            </CardContent>
        </Card>
    );
};

export default ReferralMetricsCard;