import React from "react";
import { Dice6 } from "lucide-react";
import ThemeController from "./ThemeController";
import { useAuthStore } from "../stores/useAuthStore";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();

  return (
    <div className="flex justify-between items-center bg-base-300 h-16 px-4">
      <div className="flex items-center gap-3">
        <div>
          <Dice6 size={35} className="animate-spin" />
        </div>
        <div>
          <Link to={"/"} className="text-2xl font-bold text-shadow-info-content">
            <button class>Webnovel</button>
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div>
          <ThemeController />
        </div>

        {authUser && (
          <>
            <Link to={"/profile"} className={`btn btn-sm gap-2`}>
              <User className="size-5" />
              <span className="hidden sm:inline">Profile</span>
            </Link>

            <button
              className="btn flex gap-2 items-center hover:animate-[wiggle_0.5s_ease-in-out_infinite] hover:bg-blue-500 hover:text-white"
              onClick={logout}
            >
              <LogOut className="size-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
