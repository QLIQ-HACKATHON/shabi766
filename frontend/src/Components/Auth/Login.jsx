import React, { useState } from "react";
import API from "../Api";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    // Step 1: Login to get the token
    const res = await API.post("/auth/login", form);
    const token = res.data.token;
    localStorage.setItem("token", token);

    // Step 2: Fetch user details
    const userRes = await API.get("/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const userData = userRes.data;
    localStorage.setItem("user", JSON.stringify(userData));
    
    toast.success("Login successful!");
    
  
    if (userData && !userData.isProfileComplete) {
      navigate("/onboarding/kyc");
    } else {
      navigate("/home");
    }
    
  } catch (error) {
    console.error("Login failed:", error);
    const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
    toast.error(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};

  const handleSocialLogin = () => {
    alert("Google OAuth login coming soon...");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-5xl shadow-2xl">
        <CardHeader className="pb-0">
          <CardTitle className="ml-20 text-3xl font-semibold">
            Welcome Back 👋
          </CardTitle>
          <p className="ml-20 mt-2 text-sm text-muted-foreground">Lorem ipsum, dolor sit amet consectetur adipisicing elit.<br/> Eaque reiciendis neque ea perferendis non dolor?<br /> Quidem magnam commodi in incidunt dolore illum vel,<br/> nemo earum esse distinctio quos atque.</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8 py-6">
            {/* Form section */}
            <form onSubmit={handleSubmit} className="flex-1 space-y-5">
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

              <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white">
                Login
              </Button>

              <p className="text-sm text-center">
                Don't have an account?{" "}
                <span
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={() => navigate("/register")}
                >
                  Create Account
                </span>
              </p>

              <div className="text-center">
                <p className="mb-2 text-gray-600">Or sign in with</p>
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
            </form>

            {/* Image section */}
            <div className="flex-1 hidden md:flex items-center justify-center -mt-28">
              <img
                src="/Register.png"
                alt="Login Illustration"
                className="w-full max-w-[350px] h-[450px] object-contain"
              />
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
