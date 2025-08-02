import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../Api"; // Your Axios instance
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Instagram, Youtube } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';

const ProfileClaiming = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Initialize searchTerm from the URL parameter 'q'
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || "");
  const [platformFilter, setPlatformFilter] = useState("");
  const [minFollowers, setMinFollowers] = useState(0);
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Fetches influencers from the backend based on filters
  const fetchInfluencers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const params = {
        search: searchTerm,
        platform: platformFilter,
        minFollowers: minFollowers,
        page: 1, // Start with page 1 for new searches
        limit: 10,
      };

      const res = await API.get("/influencers", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setInfluencers(res.data.influencers);
      if (res.data.influencers.length === 0) {
        toast.info("No matching profiles found.");
      }
    } catch (error) {
      console.error("Failed to fetch influencers:", error);
      toast.error("Failed to fetch profiles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // This useEffect now runs on initial load and whenever any filter changes
  useEffect(() => {
    fetchInfluencers();
  }, [searchTerm, platformFilter, minFollowers]);

  // Handles the final claim request to the backend
  const handleClaimSubmit = async () => {
    if (!selectedProfile) return;

    try {
      const token = localStorage.getItem("token");
      await API.post(`/influencers/${selectedProfile._id}/claim`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(`You have successfully claimed the profile: ${selectedProfile.displayName || selectedProfile.username}!`);
      setSelectedProfile(null); // Close the confirmation modal
      fetchInfluencers(); // Refresh the list to reflect the change
    } catch (error) {
      console.error("Claim profile failed:", error);
      const errorMessage = error.response?.data?.message || 'Failed to claim profile. Please try again.';
      toast.error(errorMessage);
    }
  };

  // A simple function to handle changes in the input for dynamic search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  }
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'Instagram':
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case 'TikTok':
        return <FaTiktok className="h-4 w-4 text-black" />;
      case 'YouTube':
        return <Youtube className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
  
    <div className="p-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
      {/* Left Column: Search & Influencer List */}
      <div className="lg:w-2/3">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Claim Your Profile</h2>
        <p className="text-gray-600 mb-6 text-lg">
          Search for your social media profile in our database and claim it as your own.
        </p>

        {/* Search Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border mb-10">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Find Your Profile</h3>
          <div className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Search by username, display name, or niche"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') fetchInfluencers();
              }}
              className="text-base"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="">All Platforms</option>
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="YouTube">YouTube</option>
              </select>
              <Input
                type="number"
                placeholder="Minimum followers"
                value={minFollowers}
                onChange={(e) => setMinFollowers(e.target.value)}
              />
            </div>
          </div>
          <Button
            onClick={fetchInfluencers}
            className="mt-5 w-full bg-sky-500 hover:bg-sky-600 text-white"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>

        {/* Influencer List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-gray-500 mt-8">Loading profiles...</div>
          ) : influencers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {influencers.map((profile) => (
                <div
                  key={profile._id}
                  className="flex flex-col items-center justify-between p-5 border rounded-xl shadow-md bg-white hover:shadow-lg transition duration-200"
                >
                  <div className="flex flex-col items-center">
                    <img
                      src={profile.profilePicture || 'https://via.placeholder.com/150'}
                      alt={profile.displayName}
                      className="w-20 h-20 rounded-full mb-3 object-cover"
                    />
                    <p className="font-semibold text-center">{profile.displayName || profile.username}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      {getPlatformIcon(profile.platform)} {profile.followersCount.toLocaleString()} followers
                    </p>
                  </div>
                  <div className="mt-4 w-full">
                    {profile.isClaimed ? (
                      <Button variant="outline" disabled className="w-full text-gray-500">Claimed</Button>
                    ) : (
                      <Button
                        onClick={() => setSelectedProfile(profile)}
                        className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                      >
                        Claim
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-8">No matching profiles found.</div>
          )}
        </div>
      </div>

      {/* Right Column: Banner Image */}
      <div className="lg:w-1/3">
        <img
          src="/Register.png"
          alt="Claim Your Profile"
          className="rounded-xl shadow-xl h-full w-full object-cover"
        />
      </div>

      {/* Confirmation Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirm Profile Claim</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to claim the profile for <strong>{selectedProfile.displayName || selectedProfile.username}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedProfile(null)}
                className="border-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleClaimSubmit}
                className="bg-sky-500 hover:bg-sky-600 text-white"
              >
                Confirm & Claim
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
 
);

};



export default ProfileClaiming;