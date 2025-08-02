import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Api"; 
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import ReferralMetricsCard from "../dashboard/ReferralMetricsCard";
import ConnectedAccountsCard from "../dashboard/ConnectedAccountsCard";
import BrandOpportunitiesCard from "../dashboard/BrandOpportunitiesCard";
import NotificationsCard from "../dashboard/NotificationsCard";
import { SocketProvider } from '../Notifications/SocketContext'; 

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [claimedProfile, setClaimedProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }
                
                // Using your centralized API instance. No need for manual headers.
                const userRes = await API.get("/user/me");
                const userData = userRes.data;
                setUser(userData);
                
                if (userData.claimedProfileId) {
                    const profileId = userData.claimedProfileId._id || userData.claimedProfileId;
                    // Using your centralized API instance. No need for manual headers.
                    const profileRes = await API.get(`/influencers/${profileId}`);
                    setClaimedProfile(profileRes.data);
                }

            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
                toast.error("Failed to load your profile. Please try again.");
                navigate("/login"); 
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <p className="text-lg text-gray-600">Loading your personalized dashboard...</p>
                    <div className="mt-4 animate-spin rounded-full h-12 w-12 border-4 border-t-sky-500 border-gray-200"></div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-6 max-w-4xl mx-auto text-center bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Error loading data</h2>
                    <p>There was an issue fetching your profile. Please try logging in again.</p>
                    <Button onClick={() => navigate("/login")} className="mt-4 bg-red-500 hover:bg-red-600">Go to Login</Button>
                </div>
            </div>
        );
    }

    const isProfileClaimed = claimedProfile !== null;
    const isSocialConnected = user.socialConnected; 
    const hasPreferences = user.hasPreferences;   
    const hasKyc = user.isKycVerified;           
    
    const onboardingProgress = [isProfileClaimed, isSocialConnected, hasPreferences, hasKyc].filter(Boolean).length;
    const totalOnboardingSteps = 4;
    const progressValue = (onboardingProgress / totalOnboardingSteps) * 100;

    if (!isProfileClaimed) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
                <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-2xl">
                    <svg className="mx-auto h-16 w-16 text-sky-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
                        Hello, {user.fullname}!
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                        You're not quite finished yet! Claim your social profile to unlock all platform features and start monetizing your influence.
                    </p>
                    <Button onClick={() => navigate("/claim-profile")} className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                        Claim Profile Now
                    </Button>
                </div>
            </div>
        );
    }

    // --- Onboarding Complete Dashboard UI ---
    return (
        // The SocketProvider is added here, wrapping the entire dashboard UI
        <SocketProvider userId={user._id}>
            <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    Welcome back, {user.fullname}!
                </h1>
                <p className="text-gray-600 mb-8">
                    Your dashboard is ready. Here's a quick overview.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Profile Card */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col md:flex-row items-center gap-6">
                        <img 
                            src={claimedProfile?.profilePictureUrl || 'https://i.pravatar.cc/150?u=a042581f4e29026704d'} 
                            alt="Profile" 
                            className="w-24 h-24 rounded-full border-4 border-sky-200" 
                        />
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl font-bold text-gray-800">{claimedProfile?.displayName || claimedProfile?.username}</h3>
                            <p className="text-md text-gray-500">{claimedProfile?.platform} - {claimedProfile?.followersCount?.toLocaleString() || '0'} followers</p>
                            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                                <Button 
                                    onClick={() => navigate(`/view-profile/${claimedProfile?._id}`)} 
                                    className="bg-sky-500 hover:bg-sky-600 text-white"
                                >
                                    View My Profile
                                </Button>
                                <Button 
                                    variant="outline" 
                                    onClick={() => toast.info('Feature coming soon!')}
                                >
                                    Edit Profile
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Onboarding Progress Card (Now dynamic) */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col justify-between">
                        <div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">Onboarding Progress</h4>
                            <p className="text-sm text-gray-500 mb-4">Complete your profile to unlock new opportunities.</p>
                        </div>
                        <div className="mt-auto">
                            <Progress value={progressValue} className="w-full" />
                            <p className="text-sm text-right mt-2 text-gray-600">{Math.round(progressValue)}% Complete</p>
                            {progressValue < 100 && (
                                <Button 
                                    className="w-full mt-4 bg-sky-500 hover:bg-sky-600"
                                    onClick={() => navigate("/onboarding/social")}
                                >
                                    Finish Setup
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* A new grid for the smaller dashboard cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    <ReferralMetricsCard />
                    <ConnectedAccountsCard />
                    <BrandOpportunitiesCard />
                    <NotificationsCard userId={user._id}/>
                </div>
            </div>
        </SocketProvider>
    );
};

export default Home;