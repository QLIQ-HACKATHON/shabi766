
import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../Api";

const ReferralLeaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    API.get("/referrals/leaderboard").then((res) => setLeaders(res.data));
  }, []);

  return (
    <div className="p-6 bg-white shadow rounded-xl mt-8">
      <h2 className="text-xl font-bold mb-4">🏆 Referral Leaderboard</h2>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left bg-gray-100">
            <th className="py-2 px-4">#</th>
            <th className="py-2 px-4">Full Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Referrals</th>
            <th className="py-2 px-4">Points</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((user, index) => (
            <tr key={user._id} className="border-t">
              <td className="py-2 px-4">{index + 1}</td>
              <td className="py-2 px-4">{user.fullname}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">{user.totalReferrals}</td>
              <td className="py-2 px-4">{user.rewardPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReferralLeaderboard;
