import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import { useAuthStore } from "./stores/useAuthStore";
import { useTemplateStore } from "./stores/useTemplateStore";
import { Loader } from "lucide-react";
import { Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { fetchTemplates, isLoading } = useTemplateStore();

  useEffect(() => {
    checkAuth();
    fetchTemplates();
  }, [checkAuth, fetchTemplates]);

  if (isCheckingAuth && !authUser && isLoading)
    return (
      <div className="flex flex-cold gap-1 items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
        <p>Please wait</p>
      </div>
    );

  return (
    <div>
      <Navbar />
      <Routes>
        <Route>
          <Route path="/" element={authUser ? <Home /> : <Navigate to="/signup" />} />
          <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" />} />
        </Route>
      </Routes>
      <Toaster
        position="bottom-left"
        toastOptions={{
          duration: 2500,
          style: {
            background: "rgba(0, 0, 0, 0.5)", // semi-transparent black
            color: "#fff",
            backdropFilter: "blur(4px)", // optional: adds a blur effect
          },
        }}
      />
    </div>
  );
};
export default App;
