import React, { useState, useEffect } from "react";
import { socket } from "../lib/socket.js";
import { useAuthStore } from "../stores/useAuthStore.js";

const OnlineUsers = () => {
  const [onlineUserIds, setOnlineUserIds] = useState([]);

  const { authUser } = useAuthStore();

  // Connect socket only once
  useEffect(() => {
    if (!authUser?._id) {
      console.log(authUser);
      console.log("No authUser.userId, skipping socket connection");
      return;
    }

    console.log("Attempting to connect socket with userId:", authUser._id);

    // Pass userId to the server via query param
    socket.io.opts.query = {
      userId: authUser.fullName,
    };
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    socket.on("getOnlineUsers", (userIds) => {
      console.log("[CLIENT] Received online user IDs:", userIds);
      setOnlineUserIds(userIds);
    });

    return () => {
      socket.disconnect();
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("getOnlineUsers");
    };
  }, [authUser]);

  return (
    <div className="fixed bottom-4 left-4 z-30 lg:bottom-6 lg:left-6 xl:bottom-8 xl:left-8">
      {/* Mobile: Compact indicator */}
      <div className="lg:hidden bg-base-200/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg border border-base-300">
        <div className="flex items-center gap-2">
          <span className="text-success text-sm animate-pulse">●</span>
          <span className="text-xs font-medium text-base-content">
            {onlineUserIds.length} online
          </span>
        </div>
      </div>

      {/* Desktop: Full panel */}
      <div className="hidden lg:block bg-base-200/95 backdrop-blur-sm rounded-xl shadow-xl border border-base-300 p-4 max-w-xs">
        <h3 className="font-semibold text-base-content text-sm mb-3 flex items-center gap-2">
          <span className="text-success animate-pulse">●</span>
          Online Users ({onlineUserIds.length})
        </h3>

        <ul className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
          {onlineUserIds.length > 0 ? (
            onlineUserIds.map((userId, index) => (
              <li key={index} className="text-base-content">
                <div className="flex items-center gap-2">
                  <span className="text-success text-xs">●</span>
                  <span className="text-xs truncate">{userId}</span>
                </div>
              </li>
            ))
          ) : (
            <li className="text-base-content/60 text-xs italic">No users online</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default OnlineUsers;
