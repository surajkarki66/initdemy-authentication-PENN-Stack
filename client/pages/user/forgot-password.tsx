import { useState, useContext, useEffect, SyntheticEvent } from "react";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

import Axios from "../../axios-url";
import { AuthContext } from "../../context/AuthContext";
import { NextPage } from "next";

const ForgotPassword: NextPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    state: { user },
    csrfToken,
  } = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    if (user !== null) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      Axios.defaults.headers.post["X-CSRF-Token"] = csrfToken;
      const { data } = await Axios.post("/user/forgotPassword", { email });
      setLoading(false);
      toast(data.data.message);
    } catch (error: any) {
      setLoading(false);
      toast(error.response.data.data.error);
    }
  };
  return (
    <>
      <div className="jumbotron text-center bg-primary square">
        <h1 style={{ color: "white" }}>Forgot Password</h1>
        <p className="lead">
          If you forgot the password then click here to reset the password
        </p>
      </div>
      <div className="container col-md-4 offset-md-4 pb5">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-4 p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
          <br />
          <button
            type="submit"
            className="btn btn-primary btn-block p-2"
            disabled={loading || !email}
          >
            {loading ? <SyncOutlined spin /> : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
