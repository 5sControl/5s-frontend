import React from "react";
import "./Logout.scss";
import {useTranslation} from "react-i18next";
import { Logout as LogoutIcon } from "../../assets/svg/SVGcomponent";

type LogoutProps = {
  username: string;
  status?: string;
  logout: () => void;
};

export const Logout: React.FC<LogoutProps> = ({ username, status, logout }) => {
    const { t } = useTranslation();
  return (
    <div className="logout">
      <div className="logout_text">
        <span className="logout_username">{username}</span>
        {
          status && <span className={`logout_status${status === "owner" ? "Owner" : "Worker"} capitalized`}>
          {status}
        </span>
        }
      </div>
      <div onClick={logout}>
        <img src={LogoutIcon} alt="Log out" />
      </div>
    </div>
  );
};

