import React from "react";
import ThemeController from "./ThemeController";
import { useAuthStore } from "../stores/useAuthStore";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";

import Ai from "../pages/Ai";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();

  let name;
  let pic;

  if (authUser) {
    name = authUser.fullName || "";
    pic = authUser.profilePicture || "/kratos.png";
  }

  return (
    <div className="flex justify-between items-center bg-base-300 h-16 px-4 border-primary border-b-2 shadow-lg">
      <div className="flex items-center gap-3">
        <div>
          <p className="scale-200 mb-3">📚</p>
        </div>
        <div>
          <Link
            to="/"
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient cursor-pointer"
          >
            Liber Reverie
          </Link>
        </div>
        <div>
          <ThemeController />
        </div>
        <div>
          <Link className="btn" to={"/grammar-enhancer"}>
            AI Grammar Enhancer
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4 ">
        {authUser && (
          <>
            <div>
              <p className="text-primary hidden md:inline">AST {name}</p>
            </div>
            <Link to={"/profile"} className={`btn gap-2 hidden sm:inline`}>
              <img src={pic} className="hidden sm:inline object-cover size-10 p-0.5 rounded-2xl" />
              <span className="hidden sm:inline">Profile Settings</span>
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
