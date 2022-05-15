import { useContext, useEffect } from "react";
import { SyncOutlined } from "@ant-design/icons";

import Axios from "../../axios-url";
import { AuthContext } from "../../context/AuthContext";

const StripeCallback = () => {
  const {
    state: { user },
  } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      Axios.post("/instructor/get-account-status").then((_res) => {
        window.location.href = "/instructor";
      });
    }
  }, [user]);

  return (
    <SyncOutlined
      spin
      className="d-flex justify-content-center display-1 text-danger p-5"
    />
  );
};

export default StripeCallback;
