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
    <div className=" text-xs md:fixed md:block hidden bottom-0 right-0 bg-base-200 rounded-lg  w-[6%] no-wrap overflow-hidden p-3">
      <h3 className="font-semibold text-base-content">Online Users ({onlineUserIds.length})</h3>

      <ul>
        {onlineUserIds.map((userId, index) => (
          <li key={index} className=" text-base-content">
            <div>
              <span className="text-success text-lg">●</span>
              <span className="">{userId}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsers;
