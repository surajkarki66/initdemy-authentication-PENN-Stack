import { FC } from "react";
import Link from "next/link";

const UserNav: FC = () => {
  return (
    <div className="nav flex-column nav-pills mt-2">
      <Link href="/user">
        <a className="nav-link activate">Dashboard</a>
      </Link>
      <Link href="/accountSettings">
        <a className="nav-link activate">Account Settings</a>
      </Link>
    </div>
  );
};

export default UserNav;
