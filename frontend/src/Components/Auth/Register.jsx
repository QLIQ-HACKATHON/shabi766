import React, { useState } from "react";
import API from "../Api";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    verifyPassword: "",
    referralCode: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setReferralCode(e.target.value);
  };

  const handleNext = () => {
    if (!form.name || !form.email || !form.phone || !form.gender) {
      alert("Please fill all fields on this page");
      return;
    }
    setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.verifyPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        gender: form.gender,
        referredBy: form.referralCode || undefined,
      };
      const res = await API.post("/auth/register", payload);
      alert(res.data.message);
      navigate("/profile-claim");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  const handleSocialLogin = () => {
    alert("Google OAuth login coming soon...");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="flex w-full max-w-4xl overflow-hidden shadow-xl">
        {/* Left side: Form */}
        <div className="w-full md:w-1/2 p-6">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 ? (
                <>
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Mobile Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Gender</h3>
                    <div className="flex gap-2">
                      {["MALE", "FEMALE"].map((gender) => (
                        <button
                          key={gender}
                          type="button"
                          onClick={() => setForm({ ...form, gender })}
                          className={`flex-1 py-2 rounded-lg text-white font-medium transition-all 
          ${form.gender === gender ? "bg-sky-500" : "bg-sky-200 hover:bg-sky-300"}`}
                        >
                          {gender.charAt(0) + gender.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>


                  <div className="flex gap-2">
                    <div className="flex-1">
                      {editing ? (
                        <Input
                          id="referralCode"
                          name="referralCode"
                          placeholder="Enter referral code"
                          value={form.referralCode}
                          onChange={handleChange} 
                          onBlur={() => {
                            if (!form.referralCode.trim()) setEditing(false);
                          }}
                          className="w-full py-2 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setEditing(true)}
                          className="w-full py-2 bg-sky-200 hover:bg-sky-300 text-black rounded-lg font-medium"
                        >
                          Referral Code
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      className="flex-1 py-2 bg-sky-200 hover:bg-sky-300 text-black rounded-lg font-medium"
                    >
                      Scan QR
                    </button>
                  </div>


                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      disabled
                      className="px-4 py-2 bg-sky-200 text-gray-500 rounded-lg font-medium cursor-not-allowed"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium"
                    >
                      Next
                    </button>
                  </div>

                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="verifyPassword">Verify Password</Label>
                    <Input
                      id="verifyPassword"
                      name="verifyPassword"
                      type="password"
                      value={form.verifyPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label>Verify Email</Label>
                    <Button type="button" variant="outline" className="w-full">
                      Send Verification Email
                    </Button>
                  </div>
                  <div>
                    <Label>Verify Phone Number</Label>
                    <Button type="button" variant="outline" className="w-full">
                      Send OTP
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
                    >
                      Create Account
                    </Button>
                  </div>

                </>
              )}
            </form>
            <div className="mt-6 text-center">
              <p className="mb-2">Or sign up with</p>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleSocialLogin}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#FFC107"
                    d="M43.6 20.4h-3.7v-.1H24v7.2h11.1c-1 4.6-5.3 7.8-11.1 7.8-6.7 0-12.1-5.4-12.1-12.1s5.4-12.1 12.1-12.1c3.1 0 5.8 1.1 7.8 2.9l5.5-5.5C34.9 9.1 29.9 7 24 7 12.4 7 3 16.4 3 28s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.8-.4-4.1z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.3 14.1l6.6 4.9c1.8-3.6 5.8-6 10.1-6 3.1 0 5.8 1.1 7.8 2.9l5.5-5.5C34.9 9.1 29.9 7 24 7c-6.7 0-12.1 5.4-12.1 12.1 0 1.8.5 3.4 1.4 4.8z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.5 0 10.2-2.3 13.6-6l-6.3-5.2c-2.2 1.5-5 2.4-8.2 2.4-5.8 0-10.7-3.9-12.4-9.3l-6.7 5.2C9.9 38.1 16.3 44 24 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.6 20.4h-3.7v-.1H24v7.2h11.1c-1 4.6-5.3 7.8-11.1 7.8-1.4 0-2.7-.2-3.9-.6l-6.7 5.2c2.3 1.3 5 2 8 2 6.7 0 12.1-5.4 12.1-12.1 0-1.4-.1-2.8-.4-4.1z"
                  />
                </svg>
                Google
              </Button>
            </div>

          </CardContent>
        </div>

        {/* Right side: Image */}
        <div className="hidden md:block w-1/2 bg-gray-200">
          <img
            src="/Register.png"
            alt="Signup Visual"
            className="w-full h-full object-cover"
          />
        </div>
      </Card>
    </div>
  );
};

export default Register;
