
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../Api"; 
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const ViewProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await API.get(`/influencers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to fetch profile. Please try again.");
        toast.error("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <p>Profile not found.</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
   
      <div className="p-6 max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Go Back
        </Button>

        <div className="bg-white p-8 rounded-lg shadow-md border">
          <div className="flex items-center mb-6">
            {profile.profilePicture && (
              <img
                src={profile.profilePicture}
                alt={profile.displayName}
                className="w-24 h-24 rounded-full mr-6 border-2 border-gray-200"
              />
            )}
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{profile.displayName}</h2>
              <p className="text-xl text-gray-500">@{profile.username}</p>
            </div>
          </div>
          
          <p className="text-lg text-gray-700 mb-4">{profile.bio}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="font-semibold text-gray-600 mr-2">Platform:</span>
              <span className="text-gray-800">{profile.platform}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-gray-600 mr-2">Followers:</span>
              <span className="text-gray-800">{profile.followersCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-gray-600 mr-2">Niche:</span>
              <span className="text-gray-800">{profile.niche}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-gray-600 mr-2">Engagement Rate:</span>
              <span className="text-gray-800">{profile.engagementRate}%</span>
            </div>
          </div>
          
          {profile.metrics && (
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-xl font-semibold mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Avg. Likes</p>
                  <p className="text-lg font-bold">{profile.metrics.averageLikes.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Avg. Comments</p>
                  <p className="text-lg font-bold">{profile.metrics.averageComments.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Avg. Video Views</p>
                  <p className="text-lg font-bold">{profile.metrics.videoViews.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    
  );
};

export default ViewProfile;