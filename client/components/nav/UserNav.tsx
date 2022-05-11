import { FC } from "react";
import Link from "next/link";

const UserNav: FC = () => {
  return (
    <div
      className="nav flex-column nav-pills mt-2 bg-primary"
      style={{ borderRadius: "5px" }}
    >
      <Link href="/user">
        <a className="nav-link activate" style={{ color: "white" }}>
          Dashboard
        </a>
      </Link>
    </div>
  );
};

export default UserNav;
