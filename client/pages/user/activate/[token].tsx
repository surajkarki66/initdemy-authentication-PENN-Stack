import { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { SyntheticEvent, useContext, useState } from "react";

import Axios from "../../../axios-url";
import { AuthContext } from "../../../context/AuthContext";
import { SyncOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Link from "next/link";

const Activate: NextPage = () => {
  const [validUrl, setValidUrl] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    state: { user },
    csrfToken,
  } = useContext(AuthContext);

  const router = useRouter();
  const token = router.query.token;
  const { dispatch } = useContext(AuthContext);

  const verifyEmailUrl = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      Axios.defaults.headers.post["X-CSRF-Token"] = csrfToken;
      const { data } = await Axios.post("/user/userActivation", {
        accessToken: token,
      });
      toast(data.data.message);
      if (user) {
        dispatch({ type: "LOGIN", payload: data.data.user });
        window.localStorage.setItem("user", JSON.stringify(data.data.user));
      }
      setValidUrl(true);
      setLoading(false);
    } catch (error: any) {
      toast(error.response.data.data.error);
      setValidUrl(false);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="jumbotron text-center bg-primary square">
        <h1 style={{ color: "white" }}>Account Activation</h1>
        <p className="lead">
          Verify your email to unlock some special features.
        </p>
      </div>
      <div className="container col-md-4 offset-md-4 pb5 text-center">
        <Button
          type="primary"
          disabled={validUrl}
          onClick={(e) => verifyEmailUrl(e)}
        >
          {loading ? <SyncOutlined spin /> : "Activate"}
        </Button>
        <p style={{ marginTop: "20px" }}>
          {validUrl && (
            <Link href={user ? "/user" : "/login"}>
              {user ? "Dashboard" : "Login"}
            </Link>
          )}
        </p>
      </div>
    </>
  );
};

export default Activate;
