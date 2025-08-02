import Influenceruser from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const registerUser = async (req, res) => {
  try {
    console.log("typeof req.body:", typeof req.body);
    console.log("req.body:", req.body);

    const { name, email, phone, gender, password, referredBy } = req.body;

    if (!name || !email || !phone || !gender || !password) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    const existingUser = await Influenceruser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email." });
    }
 
    const hashedPassword = await bcrypt.hash(password, 10);
    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const userData = {
      name,
      email,
      phone,
      password: hashedPassword,
      referralCode,
      referredBy,
      rewardPoints: 0,
      kyc: {
        gender,
      }
    };
    
    const newUser = new Influenceruser(userData);

    if (referredBy) {
      
      const referrer = await Influenceruser.findOne({ referralCode: new RegExp(`^${referredBy}$`, 'i') });
      

      if (!referrer) {
        return res.status(400).json({ message: "Invalid referral code." });
      }

      referrer.rewardPoints = (referrer.rewardPoints || 0) + 10;
      referrer.referrals = referrer.referrals || [];
      referrer.referrals.push(newUser._id);
      await referrer.save();
    }
    
    await newUser.save();

    res.status(201).json({
      message: "Registered successfully",
      referralCode: newUser.referralCode,
    });
  } catch (err) {
    console.error("Registration error:", err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(el => el.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Influenceruser.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};



