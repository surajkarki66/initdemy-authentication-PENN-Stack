import { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { SyntheticEvent, useContext, useEffect, useState } from "react";

import Axios from "../../../axios-url";
import { AuthContext } from "../../../context/AuthContext";
import { SyncOutlined } from "@ant-design/icons";

const PasswordReset: NextPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    state: { user },
    csrfToken,
  } = useContext(AuthContext);

  const router = useRouter();
  const token = router.query.token;

  useEffect(() => {
    if (user !== null) {
      router.push("/");
    }
  }, [router, user]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      Axios.defaults.headers.post["X-CSRF-Token"] = csrfToken;
      const { data } = await Axios.post("/user/resetPassword", {
        newPassword,
        resetLink: token,
      });
      setNewPassword("");
      setLoading(false);
      toast(data.data.message);
      router.push("/login");
    } catch (error: any) {
      setLoading(false);
      toast(error.response.data.data.error);
    }
  };

  return (
    <>
      <div className="jumbotron text-center bg-primary square">
        <h1 style={{ color: "white" }}>Reset Password</h1>
        <p className="lead">Create your new password</p>
      </div>
      <div className="container col-md-4 offset-md-4 pb5">
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="form-control mb-4 p-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
          <br />
          <button
            type="submit"
            className="btn btn-primary btn-block p-2"
            disabled={loading || !newPassword}
          >
            {loading ? <SyncOutlined spin /> : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
};

export default PasswordReset;
