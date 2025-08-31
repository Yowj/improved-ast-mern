import React, { useState } from "react";
import ThemeController from "./ThemeController";
import { useAuthStore } from "../stores/useAuthStore";
import { LogOut, Menu, X, Bot, FileText, Home, User, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  let name;
  let pic;

  if (authUser) {
    name = authUser.fullName || "";
    pic = authUser.profilePicture || "/kratos.png";
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActiveLink = (path) => location.pathname === path;

  const navigationItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/grammar-enhancer", label: "Grammar AI", icon: FileText },
    { path: "/askAi", label: "Chat AI", icon: Bot },
  ];

  return (
    <>
      <nav className="bg-base-300 w-full border-b-2 border-primary shadow-lg sticky top-0 z-50">
        <div className="max-w-12xl w-full px-3 sm:px-4 lg:px-3">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo Section */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="text-xl sm:text-2xl">📚</div>
              <Link
                to="/"
                className="text-lg sm:text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:scale-105 transition-transform duration-200 truncate"
                onClick={closeMobileMenu}
              >
                <span>Liber Reverie</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            {authUser && <div className="hidden lg:flex items-center gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`btn btn-sm gap-2 transition-all duration-200 ${
                    isActiveLink(item.path)
                      ? "btn-primary shadow-md"
                      : "btn-ghost hover:btn-outline"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
              <div className="btn btn-sm gap-2 transition-all duration-200 btn-ghost hover:btn-outline">
                <ThemeController />
              </div>
            </div> }

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Controller - Always visible */}

              {authUser && (
                <>
                  {/* User Name - Desktop only */}
                  <div className="hidden lg:block">
                    <p className="text-primary text-sm font-medium">AST {name}</p>
                  </div>

                  {/* Profile Button - Desktop */}
                  <Link
                    to="/profile"
                    className="hidden md:flex btn btn-sm gap-2 hover:btn-outline transition-all duration-200"
                  >
                    <img src={pic} className="w-6 h-6 rounded-full object-cover" alt="Profile" />
                    <span className="hidden lg:inline">Profile</span>
                  </Link>

                  {/* Logout Button - Desktop */}
                  <button
                    className="hidden md:flex btn btn-sm gap-2 hover:btn-error transition-all duration-200"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden lg:inline">Logout</span>
                  </button>

                  {/* Mobile Profile Avatar */}
                  <div className="md:hidden">
                    <img
                      src={pic}
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary"
                      alt="Profile"
                    />
                  </div>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden btn btn-sm btn-square btn-ghost"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-base-200 bg-base-200 shadow-lg">
            <div className="max-w-7xl mx-auto px-3 py-3 space-y-2">
              {/* Mobile Theme Controller */}
              <div className="flex items-center justify-between py-2">
                <ThemeController />
              </div>

              <div className="divider my-2"></div>

              {/* Navigation Items */}
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                    isActiveLink(item.path)
                      ? "bg-primary text-primary-content shadow-md"
                      : "hover:bg-base-300"
                  }`}
                  onClick={closeMobileMenu}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}

              {authUser && (
                <>
                  <div className="divider my-2"></div>

                  {/* Mobile User Info */}
                  <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                    <img src={pic} className="w-10 h-10 rounded-full object-cover" alt="Profile" />
                    <div>
                      <p className="font-medium text-sm">AST {name}</p>
                      <p className="text-xs opacity-60">Authenticated User</p>
                    </div>
                  </div>

                  {/* Mobile Profile Link */}
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-300 transition-all duration-200"
                    onClick={closeMobileMenu}
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Profile Settings</span>
                  </Link>

                  {/* Mobile Logout */}
                  <button
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-error hover:text-error-content transition-all duration-200 w-full text-left"
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </>
  );
};

export default Navbar;
