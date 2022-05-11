import { useState, useEffect, useContext } from "react";
import type { NextComponentType } from "next";
import { Menu } from "antd";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  AppstoreOutlined,
  CoffeeOutlined,
  LoginOutlined,
  UserAddOutlined,
  CarryOutOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";

import Axios from "../axios-url";
import { AuthContext } from "../context/AuthContext";

const { Item, SubMenu, ItemGroup } = Menu;

const TopNav: NextComponentType = () => {
  const [current, setCurrent] = useState("");
  const { state, dispatch, csrfToken } = useContext(AuthContext);
  const router = useRouter();
  const { user } = state;

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [process.browser && window.location.pathname]);

  const logout = async () => {
    dispatch({ type: "LOGOUT" });
    window.localStorage.removeItem("user");
    Axios.defaults.headers.post["X-CSRF-Token"] = csrfToken;
    const { data } = await Axios.get("/users/logout");
    toast(data.data);
    router.push("/login");
  };
  return (
    <Menu mode="horizontal" selectedKeys={[current]}>
      <Item
        key="/"
        onClick={(e) => setCurrent(e.key)}
        icon={<AppstoreOutlined />}
      >
        <Link href="/">
          <a>App</a>
        </Link>
      </Item>
      {user && user.role && user.role.includes("INSTRUCTOR") && (
        <Item
          onClick={(e) => setCurrent(e.key)}
          key="/instructor/course/create"
          icon={<CarryOutOutlined />}
        >
          <Link href="/instructor/course/create">
            <a>Create Course</a>
          </Link>
        </Item>
      )}
      {user && user.role && user.role.includes("SUBSCRIBER") && (
        <Item
          onClick={(e) => setCurrent(e.key)}
          key="/user/become-instructor"
          icon={<TeamOutlined />}
        >
          <Link href="/user/become-instructor">
            <a>Become Instructor</a>
          </Link>
        </Item>
      )}

      {user === null && (
        <>
          <Item
            onClick={(e) => setCurrent(e.key)}
            key="/login"
            icon={<LoginOutlined />}
          >
            <Link href="/login">
              <a>Login</a>
            </Link>
          </Item>
          <Item
            onClick={(e) => setCurrent(e.key)}
            key="/register"
            icon={<UserAddOutlined />}
          >
            <Link href="/register">
              <a>Register</a>
            </Link>
          </Item>
        </>
      )}
      {user !== null && (
        <SubMenu
          key="/me"
          icon={<CoffeeOutlined />}
          title={user && user.firstName + " " + user.lastName}
        >
          <ItemGroup>
            <Item key="/user">
              <Link href="/user">
                <a>Dashboard</a>
              </Link>
            </Item>
            <Item key="/logout" onClick={logout}>
              Logout
            </Item>
          </ItemGroup>
        </SubMenu>
      )}
    </Menu>
  );
};

export default TopNav;
