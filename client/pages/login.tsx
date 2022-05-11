import Link from "next/link";
import { useState, SyntheticEvent, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";

import Axios from "../axios-url";

const Login: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { state, dispatch, csrfToken, setAccessToken } =
    useContext(AuthContext);
  const { user } = state;
  const router = useRouter();

  useEffect(() => {
    if (user !== null) router.push("/");
  }, [router, user]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      Axios.defaults.headers.post["X-CSRF-Token"] = csrfToken;
      const { data } = await Axios.post(`/users/login`, {
        email,
        password,
      });
      if (data) {
        const { user, accessToken } = data.data;
        dispatch({ type: "LOGIN", payload: user });
        window.localStorage.setItem("user", JSON.stringify(user));
        setAccessToken(accessToken);
        setLoading(false);
        router.push("/");
      }
    } catch (error: any) {
      toast.error(error.response.data.data.error);
      setLoading(false);
    }
  };
  return (
    <>
      <div className="jumbotron text-center bg-primary square">
        <h1 style={{ color: "white" }}>Login</h1>
        <p className="lead">Lets get logged in to our platform!</p>
      </div>
      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-4 p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            required
          />
          <input
            type="password"
            className="form-control mb-4 p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />

          <br />
          <div className="d-grid gap-2">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={!email || !password || loading}
            >
              {loading ? <SyncOutlined spin /> : "Submit"}
            </button>
          </div>
        </form>
        <p className="text-center p-3">
          Not yet registered?{" "}
          <Link href="/register">
            <a>Register</a>
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
