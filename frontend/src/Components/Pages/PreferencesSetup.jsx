import React, { useState } from "react";
import API from "../Api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PreferencesSetup = () => {
    const navigate = useNavigate();
    const [preferencesData, setPreferencesData] = useState({
        interests: "",
        niches: "",
        contentTypes: "",
        brandPreferences: "",
    });
    const [isPreferencesSubmitted, setIsPreferencesSubmitted] = useState(false);

    const handlePreferencesChange = (e) => {
        const { name, value } = e.target;
        setPreferencesData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePreferencesSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = {
            interests: preferencesData.interests.split(',').map(item => item.trim()),
            niches: preferencesData.niches.split(',').map(item => item.trim()),
            contentTypes: preferencesData.contentTypes.split(',').map(item => item.trim()),
            brandPreferences: preferencesData.brandPreferences.split(',').map(item => item.trim()),
        };
        try {
            const token = localStorage.getItem("token");
            await API.put("/user/me", dataToSend, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Preferences updated successfully!");
            setIsPreferencesSubmitted(true);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update preferences.");
        }
    };

    return (
        
            
            <div className="min-h-screen bg-gray-100 py-6">
                <div className="container mx-auto mt-8 p-6 bg-white rounded-md shadow-md flex flex-col lg:flex-row gap-8">
                    {/* Left Section: Form */}
                    <div className="lg:w-1/2">
                        <h2 className="text-3xl font-bold mb-6 text-gray-800">
                            Tell Us About Yourself
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Help us find the best collaborations for you by sharing your interests.
                        </p>
                        <form onSubmit={handlePreferencesSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="interests">Interests (comma-separated)</Label>
                                <Input type="text" name="interests" id="interests" value={preferencesData.interests} onChange={handlePreferencesChange} />
                            </div>
                            <div>
                                <Label htmlFor="niches">Niches (comma-separated)</Label>
                                <Input type="text" name="niches" id="niches" value={preferencesData.niches} onChange={handlePreferencesChange} />
                            </div>
                            <div>
                                <Label htmlFor="contentTypes">Content Types (comma-separated)</Label>
                                <Input type="text" name="contentTypes" id="contentTypes" value={preferencesData.contentTypes} onChange={handlePreferencesChange} />
                            </div>
                            <div>
                                <Label htmlFor="brandPreferences">Brand Preferences (comma-separated)</Label>
                                <Input type="text" name="brandPreferences" id="brandPreferences" value={preferencesData.brandPreferences} onChange={handlePreferencesChange} />
                            </div>
                            <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600" disabled={isPreferencesSubmitted}>
                                {isPreferencesSubmitted ? "Preferences Saved" : "Save Preferences"}
                            </Button>
                        </form>

                        <div className="flex justify-between mt-8">
                            <Button variant="outline" onClick={() => navigate("/onboarding/kyc")}>
                                Back
                            </Button>
                            <Button
                                onClick={() => navigate("/onboarding/social")}
                                disabled={!isPreferencesSubmitted}
                                className="bg-sky-500 hover:bg-sky-600"
                            >
                                Continue
                            </Button>
                        </div>
                    </div>

                    {/* Right Section: Image */}
                    <div className="lg:w-1/2 flex items-center justify-center">
                        <img
          src="/Register.png"
          alt="Claim Your Profile"
          className="rounded-md shadow-lg w-[450px] h-auto max-h-[500px] object-cover"
        />
                    </div>
                </div>
            </div>
        
    );
};

export default PreferencesSetup;