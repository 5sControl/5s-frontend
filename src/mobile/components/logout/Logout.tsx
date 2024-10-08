import React from "react";
import "./Logout.scss";

type LogoutProps = {
  username: string;
  status: string;
  logout: () => void;
};

export const Logout: React.FC<LogoutProps> = ({ username, status, logout }) => {
  return (
    <div className="logout">
      <div className="logout_text">
        <span className="logout_username">{username}</span>
        <span className={`logout_status${status === "owner" ? "Owner" : "Worker"} capitalized`}>
          {status}
        </span>
      </div>
      <div onClick={logout}>Log out</div>
    </div>
  );
};

