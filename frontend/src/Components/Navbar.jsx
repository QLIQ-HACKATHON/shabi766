import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Bell, HelpCircle, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/profile-claim?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="w-full flex items-center justify-between px-4 py-3 bg-white shadow-md sticky top-0 z-50">
      {/* Left: Burger, Logo, and Search */}
      <div className="flex items-center gap-4 flex-1">
        {/* Burger Menu (now always visible) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6 text-gray-700" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link to="/home">Home</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/leaderboard">Leaderboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/referrals">Referrals</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Logo */}
        <Link to="/home" className="text-blue-600 text-xl font-bold">QLIQ</Link>

        {/* Search Bar (flex-1 to fill space, hidden on small screens) */}
        <form onSubmit={handleSearch} className="flex-1 sm:hidden md:flex">
          <Input
            type="text"
            placeholder="Search..."
            className="w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {/* Right: Language, Help, Refer Now, Notifications, Profile */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Language Selection */}
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-gray-600" />
          <select className="border rounded-md px-2 py-1 text-sm ml-2">
            <option value="en">EN</option>
            <option value="fr">FR</option>
            <option value="ur">UR</option>
          </select>
        </div>

        {/* Help Icon */}
        <HelpCircle className="w-5 h-5 text-gray-600 cursor-pointer" />

        {/* Refer Now */}
        <Button variant="outline" className="text-sm px-3">
          Refer Now
        </Button>

        {/* Notifications */}
        <div className="relative cursor-pointer">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            3
          </span>
        </div>

        {/* Profile Avatar with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer">
              <Avatar>
                <AvatarImage src="/profile.png" alt="Profile" />
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user ? user.fullname : "Guest"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;