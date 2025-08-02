import React, { useState } from "react";
import API from "../Api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const KycSetup = () => {
    const navigate = useNavigate();
    const [kycData, setKycData] = useState({
        age: "",
        gender: "",
        location: "",
        document: null,
    });
    const [isKycSubmitted, setIsKycSubmitted] = useState(false);

    const handleKycChange = (e) => {
        const { name, value, files } = e.target;
        setKycData(prev => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleKycSubmit = async (e) => {
        e.preventDefault();
        if (!kycData.document) {
            toast.error("Please upload a document.");
            return;
        }
        const formData = new FormData();
        formData.append("age", kycData.age);
        formData.append("gender", kycData.gender);
        formData.append("location", kycData.location);
        formData.append("document", kycData.document);

        try {
            const token = localStorage.getItem("token");
            await API.post("/user/kyc", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("KYC details submitted successfully!");
            setIsKycSubmitted(true);
            // Navigate to the next step after successful submission
            navigate("/onboarding/preferences"); 
        } catch (err) {
            console.error(err);
            toast.error("Failed to submit KYC details.");
        }
    };

    return (
        
            
            <div className="min-h-screen bg-gray-100 py-6">
                <div className="container mx-auto mt-8 p-6 bg-white rounded-md shadow-md flex flex-col lg:flex-row gap-8">
                    {/* Left Section: Form */}
                    <div className="lg:w-1/2">
                        <h2 className="text-3xl font-bold mb-6 text-gray-800">
                            Verify Your Identity (KYC)
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Please provide your details and upload a valid document for verification.
                        </p>
                        <form onSubmit={handleKycSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="age">Age</Label>
                                <Input type="number" name="age" id="age" value={kycData.age} onChange={handleKycChange} required />
                            </div>
                            <div>
                                <Label htmlFor="gender">Gender</Label>
                                <select
                                    name="gender"
                                    id="gender"
                                    value={kycData.gender}
                                    onChange={handleKycChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="location">Location</Label>
                                <Input type="text" name="location" id="location" value={kycData.location} onChange={handleKycChange} required />
                            </div>
                            <div>
                                <Label htmlFor="document">Document (e.g., Passport, ID Card)</Label>
                                <Input type="file" name="document" id="document" onChange={handleKycChange} required accept=".jpg, .jpeg, .png, .pdf" />
                            </div>
                            <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 " disabled={isKycSubmitted}>
                                {isKycSubmitted ? "KYC Submitted" : "Submit & Continue"}
                            </Button>
                        </form>
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

export default KycSetup;