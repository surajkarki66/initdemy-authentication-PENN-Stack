import { NextPage } from "next";
import { toast } from "react-toastify";
import { useContext, useState } from "react";

import Axios from "../../axios-url";
import { Button } from "antd";
import {
  SettingOutlined,
  UserSwitchOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../../context/AuthContext";
import UserRoute from "../../components/routes/UserRoute";

const BecomeInstructor: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const {
    state: { user },
  } = useContext(AuthContext);

  const becomeInstructor = () => {
    setLoading(true);
    Axios.post("/users/make-instructor")
      .then((res) => {
        window.location.href = res.data;
      })
      .catch((error) => {
        toast("Stripe onboarding failed. Try again.");
        setLoading(false);
      });
  };
  return (
    <>
      <div className="jumbotron text-center bg-primary square">
        <h1 style={{ color: "white" }}>Become Instructor</h1>
        <p className="lead">Become a great teacher!</p>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center">
            <div className="pt-4">
              <UserSwitchOutlined className="display-1 pb-3" />
              <br />
              <h2>Setup payout to publish courses on Initdemy</h2>
              <p className="lead text-warning">
                Initdemy partners with stripe to transfer earnings to your bank
                account
              </p>
              <Button
                className="mb-3"
                type="primary"
                block
                shape="round"
                icon={loading ? <LoadingOutlined /> : <SettingOutlined />}
                size="large"
                onClick={becomeInstructor}
                disabled={
                  (user && user.role && user.role.includes("INSTRUCTOR")) ||
                  loading
                }
              >
                {loading ? "Processing...." : "Payout Setup"}
              </Button>
              <p className="lead">
                You will be redirected to stripe to complete onboarding process
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BecomeInstructor;
