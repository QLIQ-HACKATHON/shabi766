
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../Api";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


const Card = ({ title, value }) => (
  <div className="bg-white border border-gray-300 shadow-sm rounded-2xl p-4 w-full sm:w-auto min-w-[200px] flex-1 hover:shadow-md transition-shadow">
    <h3 className="text-sm text-gray-500 mb-2">{title}</h3>
    <p className="text-2xl font-bold text-blue-600">{value}</p>
  </div>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const referralTarget = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await API.get("/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userProfile = res.data;
        setProfile(userProfile);
        setProfileCompletion(userProfile.profileCompletionRate);
        
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        toast.error("Failed to load dashboard data.");
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [navigate]);

  const handleCopyReferralLink = () => {
    if (!profile || !profile.referralCode) return;
    const fullLink = `http://localhost:3000/signup?ref=${profile.referralCode}`;
    navigator.clipboard.writeText(fullLink);
    toast.success("Referral link copied!");
  };

  if (loading) {
      return <div className="p-6 text-center">Loading dashboard...</div>;
  }
  
  if (!profile) {
      return <div className="p-6 text-center">User profile not found.</div>;
  }

  // Calculate dynamic values
  const referralsCount = profile.referrals?.length || 0;
  const referralsLeft = Math.max(referralTarget - referralsCount, 0);
  const progress = Math.min((referralsCount / referralTarget) * 100, 100);

  const dynamicStats1 = [
    { title: "My Rating", value: "96%" }, 
    { title: "Order Acceptance Rate", value: "91%" },
    { title: "Order Fulfillment Rate", value: "94%" },
    { title: "Late Dispatch Rate", value: "3%" },
    { title: "Order Return Rate", value: "5%" },
  ];
  
  const dynamicStats2 = [
    { title: "Sales", value: "N/A" },
    { title: "Total Potential Sales", value: "N/A" },
    { title: "Open Orders", value: "N/A" },
    { title: "Campaigns", value: "N/A" },
    { title: "My Gigs", value: "N/A" },
    { title: "My Wallet", value: `$${profile.rewardPoints || 0}` },
    { title: "My Cash Wallet", value: "N/A" },
    { title: "My Network", value: referralsCount.toString() },
  ];

  return (
    
      
      <div className="p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Health</h2>
          <div className="flex flex-wrap gap-4">
            {dynamicStats1.map((item, idx) => (
              <Card key={idx} title={item.title} value={item.value} />
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Global Snapshot</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            {dynamicStats2.slice(0, 4).map((item, idx) => (
              <Card key={idx} title={item.title} value={item.value} />
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {dynamicStats2.slice(4).map((item, idx) => (
              <Card key={idx + 4} title={item.title} value={item.value} />
            ))}
          </div>
        </section>

        <section className="mb-10 max-w-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile Completion</h2>
          
          {profileCompletion < 100 ? (
            <Link to="/onboarding/kyc">
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                <p className="text-xl font-bold text-blue-600 mb-2">{profileCompletion}% Complete</p>
                <Progress value={profileCompletion} className="mb-3" />
                <p className="text-sm text-gray-500">
                  Complete your profile to unlock more features and brand campaigns.
                </p>
              </div>
            </Link>
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
              <p className="text-xl font-bold text-green-600 mb-2">100% Complete</p>
              <Progress value={100} className="mb-3" />
              <p className="text-sm text-gray-500">
                Congratulations! Your profile is fully optimized.
              </p>
            </div>
          )}
        </section>

        <section className="mb-10 max-w-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Referral Program</h2>
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-600 text-sm">Your Referral Code</p>
                <p className="text-xl font-semibold text-blue-700">{profile.referralCode || "N/A"}</p>
              </div>
              <Button
                variant="default"
                className="mt-2"
                onClick={handleCopyReferralLink}
                disabled={!profile.referralCode}
              >
                Copy Referral Link
              </Button>
            </div>

            <Progress value={progress} className="mb-3" />
            <p className="text-sm text-gray-500">
              {referralsLeft > 0
                ? `${referralsLeft} more referral${referralsLeft > 1 ? "s" : ""} needed to unlock the next reward`
                : "Congratulations! You've reached the next level!"}
            </p>
          </div>
        </section>

        <section className="mb-10 max-w-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Referral Links</h2>
          <div className="flex gap-4">
            <Link
              to="/dashboard/referrals"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              My Referrals
            </Link>
            <Link
              to="/dashboard/leaderboard"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Leaderboard
            </Link>
          </div>
        </section>
      </div>
    
  );
};

export default Dashboard;