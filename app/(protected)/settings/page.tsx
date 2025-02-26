"use client";

import { useSession } from "next-auth/react";
import { logout } from "@/actions/logout";

const SettingPage = () => {
  const session = useSession();

  const onClick = () => {
    logout();
  };

  return (
    <div>
      {JSON.stringify(session)}
      <button onClick={onClick} type="submit">
        Sign Out
      </button>
    </div>
  );
};

export default SettingPage;
