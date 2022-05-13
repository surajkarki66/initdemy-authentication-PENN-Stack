import { useState, SyntheticEvent, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import Axios from "../axios-url";
import { AuthContext } from "../context/AuthContext";

const Register: NextPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { state, csrfToken } = useContext(AuthContext);
  const { user } = state;
  console.log(csrfToken);

  useEffect(() => {
    if (user !== null) router.push("/");
  }, [router, user]);

  const handleSubmit = async (e: SyntheticEvent) => {
    console.log(csrfToken);
    e.preventDefault();
    try {
      setLoading(true);
      Axios.defaults.headers.post["X-CSRF-Token"] = csrfToken;
      const { data } = await Axios.post(`/users/register`, {
        firstName,
        lastName,
        email,
        password,
      });
      if (data) {
        toast.success("Registration successful. Please login.");
        setLoading(false);
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error.response.data.data.error);
      setLoading(false);
    }
  };
  return (
    <>
      <div className="jumbotron text-center bg-primary square">
        <h1 style={{ color: "white" }}>Register</h1>
        <p className="lead">Lets get registered to our platform!</p>
      </div>
      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-4 p-2"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter first name"
            required
          />
          <input
            type="text"
            className="form-control mb-4 p-2"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter last name"
            required
          />
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
              disabled={
                !firstName || !lastName || !email || !password || loading
              }
            >
              {loading ? <SyncOutlined spin /> : "Submit"}
            </button>
          </div>
        </form>
        <p className="text-center p-3">
          Already registered?{" "}
          <Link href="/login">
            <a>Login</a>
          </Link>
        </p>
      </div>
    </>
  );
};

export default Register;
