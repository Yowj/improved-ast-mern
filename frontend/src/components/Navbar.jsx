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
    <div className="flex justify-between items-center bg-base-300 h-16 px-4 border-primary border-b-2 shadow-lg">
      <div className="flex items-center gap-3">
        <div>
          <p className="scale-200 mb-3">📚</p>
        </div>
        <div>
          <Link
            to="/"
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient "
          >
            <button>Liber Reverie</button>
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4 ">
        <div>
          <ThemeController />
        </div>

        {authUser && (
          <>
            <Link to={"/profile"} className={`btn gap-2`}>
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
