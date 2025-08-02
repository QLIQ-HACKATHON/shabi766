import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/Components/ui/badge";
import API from "../Api";
import { toast } from 'sonner';

const BrandOpportunitiesCard = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const res = await API.get("/opportunities", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOpportunities(res.data.opportunities);
            } catch (error) {
                console.error("Failed to fetch opportunities:", error);
                toast.error("Failed to load brand opportunities.");
            } finally {
                setLoading(false);
            }
        };

        fetchOpportunities();
    }, []);

    return (
        <Card className="md:col-span-2 shadow-md">
            <CardHeader>
                <CardTitle className="text-lg">Brand Opportunities</CardTitle>
                <CardDescription>Find and apply for new brand collaborations.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p className="text-center text-gray-500">Loading opportunities...</p>
                ) : opportunities.length > 0 ? (
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                        {opportunities.map((opp) => (
                            <div key={opp._id} className="border-b pb-2">
                                <h3 className="font-semibold text-sky-600">{opp.brandName}</h3>
                                <p className="text-sm text-gray-700">{opp.campaignTitle}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    <Badge variant="secondary">{opp.type}</Badge>
                                    <Badge variant="secondary">{opp.niche}</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No new opportunities at the moment.</p>
                )}
            </CardContent>
        </Card>
    );
};

export default BrandOpportunitiesCard;